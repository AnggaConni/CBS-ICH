// CBS-ICH cloud authentication and report persistence.
// Loaded before the original app script; the original DOMContentLoaded callback
// will call the overridden app.init() after this file installs its handlers.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof app === 'undefined') return;
  Object.assign(app, {
    sb: null, session: null, community: null, authBusy: false,

    async init() {
      this.data = [];
      this.buildForm();
      this.renderList();
      this.go('list');
      if (!window.CBS_ICH_SUPABASE || !window.supabase) {
        this.showAuthError('Supabase configuration could not be loaded.');
        this.showAuth('signin');
        return;
      }
      this.sb = window.supabase.createClient(
        window.CBS_ICH_SUPABASE.url,
        window.CBS_ICH_SUPABASE.publishableKey
      );
      this.sb.auth.onAuthStateChange((event, session) => {
        this.session = session;
        if (session) setTimeout(() => this.onSignedIn(session), 0);
        else {
          this.community = null;
          this.data = [];
          this.renderList();
          this.updateAuthBar();
          this.showAuth('signin');
        }
      });
      const { data, error } = await this.sb.auth.getSession();
      if (error) {
        this.showAuthError(error.message);
        this.showAuth('signin');
      } else if (data.session) {
        this.session = data.session;
        await this.onSignedIn(data.session);
      } else {
        this.showAuth('signin');
      }
    },

    showAuth(mode) {
      const overlay = document.getElementById('auth-overlay');
      if (!overlay) return;
      overlay.classList.add('show');
      document.getElementById('auth-signin').classList.toggle('hidden', mode !== 'signin');
      document.getElementById('auth-community').classList.toggle('hidden', mode !== 'community');
    },
    hideAuth() {
      document.getElementById('auth-overlay')?.classList.remove('show');
    },
    showAuthError(message) {
      const el = document.getElementById('auth-error');
      if (el) {
        el.textContent = message;
        el.classList.remove('hidden');
      }
    },
    async googleSignIn() {
      const el = document.getElementById('auth-error');
      if (el) el.classList.add('hidden');
      const { error } = await this.sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          queryParams: { prompt: 'select_account' }
        }
      });
      if (error) this.showAuthError(error.message);
    },
    async signOut() {
      if (this.sb) await this.sb.auth.signOut();
      this.session = null;
      this.community = null;
      this.data = [];
      this.updateAuthBar();
      this.showAuth('signin');
    },
    updateAuthBar() {
      const label = document.getElementById('auth-user-label');
      if (label) label.textContent = this.session
        ? (this.session.user.email || 'Google account') + (this.community ? ' · ' + this.community.name : '')
        : 'Not signed in';
    },

    async onSignedIn(session) {
      if (this.authBusy) return;
      this.authBusy = true;
      try {
        const { data: memberships, error } = await this.sb
          .from('community_members')
          .select('community_id,role,communities(id,name,province,regency,verification_status)')
          .eq('user_id', session.user.id)
          .limit(1);
        if (error) throw error;
        if (!memberships || !memberships.length) {
          this.community = null;
          this.data = [];
          this.updateAuthBar();
          this.showAuth('community');
          return;
        }
        const relation = memberships[0].communities;
        this.community = Array.isArray(relation) ? relation[0] : relation;
        if (!this.community) throw new Error('Community profile could not be loaded.');
        await this.loadRemoteRecords();
        this.updateAuthBar();
        this.hideAuth();
        const subtitle = document.querySelector('#view-list .text-xs.text-gray-500');
        if (subtitle) subtitle.textContent =
          'Two active report slots · cloud-synced · every submission keeps its version history.';
        this.renderList();
      } catch (error) {
        this.showAuthError(error.message || 'Could not load your community workspace.');
        this.showAuth('signin');
      } finally {
        this.authBusy = false;
      }
    },

    async registerCommunity(event) {
      event.preventDefault();
      const name = document.getElementById('auth-community-name').value.trim();
      const province = document.getElementById('auth-province').value.trim();
      const regency = document.getElementById('auth-regency').value.trim();
      const button = document.getElementById('auth-register-btn');
      const errorBox = document.getElementById('auth-register-error');
      errorBox.classList.add('hidden');
      button.disabled = true;
      button.textContent = 'Creating workspace…';
      try {
        const { data: community, error } = await this.sb.from('communities')
          .insert({
            name,
            province: province || null,
            regency: regency || null,
            created_by: this.session.user.id
          })
          .select('id,name,province,regency,verification_status')
          .single();
        if (error) throw error;

        const { error: memberError } = await this.sb.from('community_members')
          .insert({
            community_id: community.id,
            user_id: this.session.user.id,
            role: 'owner'
          });
        if (memberError) throw memberError;

        this.community = community;
        await this.loadRemoteRecords();
        this.updateAuthBar();
        this.hideAuth();
        this.toast('Community workspace created. You can submit up to two reports.');
      } catch (error) {
        errorBox.textContent = error.message || 'Could not register community.';
        errorBox.classList.remove('hidden');
      } finally {
        button.disabled = false;
        button.textContent = 'Create community workspace';
      }
    },

    async loadRemoteRecords() {
      if (!this.community) return;
      const { data: reports, error } = await this.sb.from('ich_reports')
        .select('id,slot_number,ich_name,category,province,regency,latitude,longitude,access_level,publication_status,latest_version_id,created_at,updated_at')
        .eq('community_id', this.community.id)
        .order('slot_number');
      if (error) throw error;

      const versionIds = (reports || []).map(row => row.latest_version_id).filter(Boolean);
      let versions = [];
      if (versionIds.length) {
        const result = await this.sb.from('ich_report_versions')
          .select('id,payload,version_number')
          .in('id', versionIds);
        if (result.error) throw result.error;
        versions = result.data || [];
      }
      const versionMap = Object.fromEntries(versions.map(row => [row.id, row]));
      this.data = (reports || []).map(row => {
        const payload = versionMap[row.latest_version_id]?.payload;
        const record = payload?.report || {
          id: 'CBS-' + row.id,
          name: row.ich_name,
          domain: row.category,
          place: [row.regency, row.province].filter(Boolean).join(', '),
          created: row.created_at,
          updated: row.updated_at
        };
        return {
          ...record,
          remoteId: row.id,
          slotNumber: row.slot_number,
          publicationStatus: row.publication_status
        };
      });
      this.renderList();
    },

    async save(event) {
      event.preventDefault();
      if (!this.session || !this.community) {
        this.showAuth('signin');
        return;
      }
      const record = this.collect();
      if (!record.name) {
        this.toast('Please give the heritage a name', 'err');
        this.goStep(0);
        return;
      }
      if (!record.community) {
        this.toast('Please name the community or group', 'err');
        this.goStep(0);
        return;
      }

      const existing = this.editId ? this.data.find(row => row.id === this.editId) : null;
      if (existing) record.remoteId = existing.remoteId;
      let remoteId = record.remoteId;
      let slot = existing?.slotNumber;

      try {
        if (!remoteId) {
          const usedSlots = this.data.map(row => row.slotNumber);
          slot = [1, 2].find(number => !usedSlots.includes(number));
          if (!slot) {
            this.toast('Both community report slots are in use. Edit an existing report.', 'err');
            return;
          }
          const { data, error } = await this.sb.from('ich_reports').insert({
            community_id: this.community.id,
            slot_number: slot,
            ich_name: record.name,
            category: record.domain || null,
            province: this.community.province || null,
            regency: this.community.regency || null,
            latitude: record.lat || null,
            longitude: record.lng || null,
            access_level: 'community',
            publication_status: 'submitted'
          }).select('id').single();
          if (error) throw error;
          remoteId = data.id;
        } else {
          const { error } = await this.sb.from('ich_reports').update({
            ich_name: record.name,
            category: record.domain || null,
            province: this.community.province || null,
            regency: this.community.regency || null,
            latitude: record.lat || null,
            longitude: record.lng || null,
            access_level: 'community',
            publication_status: 'submitted',
            updated_at: new Date().toISOString()
          }).eq('id', remoteId);
          if (error) throw error;
        }

        const { error: versionError } = await this.sb.rpc('submit_ich_report', {
          p_report_id: remoteId,
          p_payload: { report: record },
          p_change_note: existing ? 'Community report updated' : 'Initial community submission'
        });
        if (versionError) throw versionError;

        record.remoteId = remoteId;
        record.slotNumber = slot;
        if (existing) {
          const index = this.data.findIndex(row => row.id === this.editId);
          if (index >= 0) this.data[index] = record;
        } else {
          this.data.push(record);
        }
        this.cur = record.id;
        this.editId = null;
        await this.loadRemoteRecords();
        this.toast('Report submitted. A new historical version has been saved.');
        this.viewDetail(record.id);
      } catch (error) {
        console.error(error);
        this.toast(error.message || 'Could not submit report to Supabase.', 'err');
        await this.loadRemoteRecords().catch(() => {});
      }
    },

    newRecord() {
      if (!this.session || !this.community) {
        this.showAuth('signin');
        return;
      }
      if (this.data.length >= 2) {
        this.toast('Both community report slots are in use. Edit an existing report.', 'err');
        return;
      }
      this.editId = null;
      this.form = { scores: {}, trends: {} };
      this.curStep = 0;
      document.getElementById('cbi-form').reset();
      document.getElementById('actions-list').innerHTML = '';
      document.getElementById('plan-list').innerHTML = '';
      document.getElementById('sign-list').innerHTML = '';
      this.renderOpts();
      document.querySelectorAll('.optbox').forEach(button => button.classList.remove('on'));
      document.querySelectorAll('.scale button').forEach(button => button.classList.remove('on'));
      document.querySelectorAll('.acc').forEach(item => item.classList.remove('open'));
      INDICATORS.forEach(item => this.updSum(item.n));
      this.addAction();
      this.addPlan();
      this.addSign();
      this.goStep(0);
      this.go('form');
    }
  });
});
