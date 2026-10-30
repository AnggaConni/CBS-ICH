# Google sign-in setup for CBS-ICH

The community input page uses Supabase Auth with Google OAuth. The browser only uses the Supabase publishable key; never put a Supabase secret/service-role key or Google client secret in GitHub.

## 1. Create Google OAuth credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create/select a project and configure Google Auth Platform / OAuth consent screen.
3. Choose the audience appropriate for your rollout. While in Testing mode, add the community members' Google accounts as test users.
4. Create an OAuth Client ID with application type **Web application**.
5. Add this authorized JavaScript origin:

   `https://anggaconni.github.io`

6. Add this authorized redirect URI:

   `https://maqqjdpazhziydqaetdu.supabase.co/auth/v1/callback`

7. Copy the OAuth Client ID and Client Secret.

## 2. Enable Google in Supabase

Open the [ICH-CBS Supabase project](https://supabase.com/dashboard/project/maqqjdpazhziydqaetdu/auth/providers).

1. Open Authentication → Sign In / Providers → Google.
2. Enable Google.
3. Paste the Google OAuth Client ID and Client Secret.
4. Save.

Do not commit the Google Client Secret to this repository and do not send it in chat.

## 3. Configure allowed redirects

Open Authentication → URL Configuration.

- Site URL: `https://anggaconni.github.io/CBS-ICH/`
- Add this exact Redirect URL: `https://anggaconni.github.io/CBS-ICH/input.html`

The input page returns users to itself after Google authentication.

## 4. How community access works

1. A contributor opens `input.html` and selects **Continue with Google**.
2. A first-time contributor registers their community name, province and regency/city.
3. Their Google account becomes the community owner. The community starts with verification status `pending`.
4. The owner can submit up to two report slots. Each save appends an immutable JSONB version.
5. Reports are not public by default. A repository moderator must verify the community and approve publication.

## 5. Moderator review and publication

Review community identity, consent and access restrictions before publication. Only moderators should run the following actions from the Supabase SQL Editor.

Verify a community:

```sql
update public.communities
set verification_status = 'verified', updated_at = now()
where id = '<community-uuid>';
```

Publish a report only when the community has explicitly approved public access:

```sql
update public.ich_reports
set publication_status = 'published',
    access_level = 'public',
    updated_at = now()
where id = '<report-uuid>';
```

The public dashboard reads `public_ich_dashboard`, which returns only published public reports belonging to verified communities.

## 6. Important notes

- The application enforces two report slots per community; the database also constrains slot numbers to 1 or 2 and makes each slot unique per community.
- Revisions create new immutable history versions; they do not overwrite old JSON snapshots.
- Community and restricted records do not appear on the public dashboard.
- The original offline browser data is not automatically uploaded. Export and review any existing local JSON records before migrating them.
- Google OAuth is not fully operational until the Google Client ID/Secret and Supabase redirect settings above have been configured.
