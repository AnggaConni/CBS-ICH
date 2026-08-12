# Community Heritage Recorder

**A community-based inventory (CBI) tool for living heritage, derived from the UNESCO 2003 Convention periodic reporting framework.**

Offline-first. Browser-based. No server. No account. No tracking.

---

## Table of contents

1. [What this is](#1-what-this-is)
2. [What this is not](#2-what-this-is-not)
3. [Why it exists](#3-why-it-exists)
4. [Quick start](#4-quick-start)
5. [Installation and hosting](#5-installation-and-hosting)
6. [How to use it — step by step](#6-how-to-use-it--step-by-step)
7. [Conversion logic: from periodic report to community form](#7-conversion-logic-from-periodic-report-to-community-form)
8. [The 24 themes and their source indicators](#8-the-24-themes-and-their-source-indicators)
9. [Full field-to-source mapping](#9-full-field-to-source-mapping)
10. [The 1–5 scoring scale](#10-the-15-scoring-scale)
11. [Ethics and consent](#11-ethics-and-consent)
12. [Data storage, backup and recovery](#12-data-storage-backup-and-recovery)
13. [Export formats](#13-export-formats)
14. [Data schema](#14-data-schema)
15. [Handing data to a government focal point](#15-handing-data-to-a-government-focal-point)
16. [Translation and localisation](#16-translation-and-localisation)
17. [Facilitator guide](#17-facilitator-guide)
18. [Technical notes](#18-technical-notes)
19. [Limitations and known issues](#19-limitations-and-known-issues)
20. [Contributing](#20-contributing)
21. [Citation](#21-citation)
22. [Licence](#22-licence)
23. [Disclaimer](#23-disclaimer)

---

## 1. What this is

Community Heritage Recorder is a single-file web application that lets a community — bearers, practitioners, elders, youth groups, local associations — record their own living heritage in a structured way.

The structure is not invented. It is adapted from two official reporting instruments of the **UNESCO 2003 Convention for the Safeguarding of the Intangible Cultural Heritage**:

| Official form | What it is | Who fills it in officially |
|---|---|---|
| **Form ICH-10** (2027 edition, revised 30 June 2026) | Periodic report on implementation of the Convention and on elements inscribed on the Representative List | State Party |
| **Form ICH-11** (2027 edition, revised 30 June 2026) | Report on the status of an element inscribed on the Urgent Safeguarding List | State Party |

Those forms contain a **26-indicator Overall Results Framework** (ORF), adopted by the General Assembly of States Parties in 2018 (Resolution 7.GA 9). Twenty-four of those indicators describe things a community can actually observe about itself. This tool turns those twenty-four into plain-language questions and lets the community answer them, score them, and export the result.

**Key characteristics:**

- Runs entirely in the browser from one HTML file
- Works offline after first load
- All data stays in the device's `localStorage`
- No network requests except the initial CDN asset load
- Mobile-first, with a full desktop layout at ≥1024px
- Exports to PDF, CSV, Word, JSON and XML
- Sharing uses the device's native share sheet (Bluetooth, chat apps, email)

---

## 2. What this is not

Read this section carefully. Misrepresenting the output of this tool can cause real harm to a community.

**This is not an official UNESCO application.** It is not endorsed by, affiliated with, or approved by UNESCO or its Secretariat.

**This is not an official government form.** Periodic reports under the 2003 Convention are submitted by States Parties through the official online system. A community cannot submit a periodic report.

**A completed record is not a periodic report.** It is community-held evidence that *may* be used by a State Party when preparing its report, if the State chooses to draw on it.

**Answering these questions does not "report against indicator 8"** in any formal sense. The correspondence between this tool's themes and the official indicators is a *re-phrasing for community use*, documented transparently in §7–9, not an official equivalence.

**Indicators 23 and 26 are deliberately absent.** Form ICH-10 states explicitly that both are *"monitored and reported only at the global level."* Indicator 23 concerns the geographic distribution of advisory bodies involved by the Intergovernmental Committee; Indicator 26 concerns the effectiveness of the ICH Fund. Neither is answerable at community level. Any tool claiming otherwise is wrong.

---

## 3. Why it exists

The Overall Results Framework is a genuine advance — it made periodic reporting measurable rather than purely narrative. But it inherited a structural problem from the Convention itself: **the State reports, and the State reports on community participation.**

Form ICH-10 asks whether inventorying "ensure[s] inclusive participation of communities, groups and NGOs" (8.1.2), whether research is conducted "with their free, prior, sustained and informed consent" (9.2.1), and whether awareness-raising "reflect[s] the widest possible inclusive participation" (17.1.1). These are excellent questions. But the answer is written by a ministry, and there is no structured mechanism for the community's own account to reach the file.

This creates a verification gap. A State can write "communities participated widely" and there is often no independent record to check it against.

This tool does not close that gap — only a change in the reporting architecture could do that. What it does is **give communities a structured, portable, self-held record** that:

- uses the same conceptual vocabulary as the official framework, so it is legible to officials
- is generated and controlled by the community itself
- can be handed over as evidence, or withheld
- exists whether or not any State ever asks for it

Even where no government ever sees it, the exercise has value. Working through 24 themes forces a community to notice things it had not articulated: that no one under thirty is learning; that documentation about them sits in a university 400km away; that the journalist who visited last year never sent back a copy.

---

## 4. Quick start

**For a community that just wants to use it:**

1. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge — phone or computer).
2. Tap **Examples** to load two sample records and see how a completed record looks.
3. Tap **New Record** and work through the eight steps.
4. Tap **Back up all records** regularly and keep the file somewhere safe.

**No installation, no internet needed after the first load, no account.**

---

## 5. Installation and hosting

### Option A — Just open the file

Download `index.html`, open it. Done. This works for a single device.

### Option B — Serve it locally

```bash
git clone https://github.com/YOUR-ORG/community-heritage-recorder.git
cd community-heritage-recorder
python3 -m http.server 8080
# open http://localhost:8080
```

### Option C — GitHub Pages

```bash
# Push to a repository, then in Settings → Pages:
# Source: deploy from branch, / (root)
```

The app will be served at `https://YOUR-ORG.github.io/community-heritage-recorder/`.

### Option D — Fully offline deployment (recommended for field use)

The app loads five assets from CDNs on first run. For genuinely offline use — remote villages, no data, shared devices — vendor them locally:

```bash
mkdir -p vendor
cd vendor

# Tailwind (use the standalone build, not the JIT CDN script)
curl -o tailwind.js https://cdn.tailwindcss.com

# Leaflet
curl -o leaflet.css https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
curl -o leaflet.js  https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
curl -o marker-icon.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
curl -o marker-shadow.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png

# Phosphor Icons
curl -o phosphor.js https://unpkg.com/@phosphor-icons/web

# Inter font — download the woff2 files from Google Fonts and add an @font-face block
```

Then edit the `<head>` of `index.html` to point at `vendor/` instead of the CDN URLs.

**Note on map tiles.** The map uses CARTO basemap tiles, which require a network connection. Offline, the map will show a grey background but coordinate entry, the marker, and the radius circle all still work. If you need offline tiles, consider bundling a small MBTiles set for your region and serving it with a local tile server — this is beyond the scope of the default build.

### Option E — Install as an app on the phone

Most mobile browsers offer **"Add to Home Screen"**. This gives an app icon and a full-screen launch. The app is not a full PWA — there is no service worker or manifest in the default build — so the first load still needs a connection. Adding a service worker is a welcome contribution.

---

## 6. How to use it — step by step

The form has **eight steps**. You can move freely between them; nothing is lost when you switch.

### Before you start — hold a meeting

Do not begin typing. Sit with the community first. Explain what the record is for, who might see it, and where it will be kept. Agree explicitly on what must **not** be recorded. Only then open the app.

### Step 1 — Basics

Name of the heritage in the community's own language first, translation second. Type of heritage (five UNESCO domains plus "Other"). Location: tap the map or drag the marker, then set the spread radius in metres. Who is recording, and the community's contact person.

*Source: ICH-10 A.2, A.3, 6.1b.2; ICH-11 A.2, A.3.*

### Step 2 — Permission

The consent page. Records whether the community was told what the record is for, who will see it, where it is kept, and their right to refuse, withdraw or correct. Records the consent status, any conditions attached, what must stay private, and who holds the authority to give or withdraw consent.

**The restricted-knowledge field asks only for the *fact* of a restriction and who governs it — never the restricted content itself.**

*Source: ICH-10 9.2.1, 17.1.1, 6.1b.5, 10.1.1; Ethical Principles for Safeguarding ICH.*

### Step 3 — The heritage

Free-text description of what actually happens. What it means to the community *today* — not historically. Headcounts: master bearers, active practitioners, learners, and a gender/age breakdown. Special roles tied to gender, age, family or lineage. Places and materials the practice requires.

*Source: ICH-11 B.1; ICH-10 C.2, 5.3.1, 13.3.2.*

### Step 4 — Health check

The community's own viability judgement on a five-point scale from *Healthy* to *Stopped*. How often it is practised now, with a free-text field that explicitly invites comparison with ten years ago. Trend arrows for seven demographic measures. How transmission actually works, and whether the traditional mode is still strong. A thirteen-item threat checklist plus narrative.

*Source: ICH-11 B.2; ICH-10 C.3, 6.1b.4, 4.2.1.*

### Step 5 — Our actions

What has already been done — repeatable rows for activity, date, who did it, and result. Difficulties encountered. Where support came from, including non-monetary support. Goals for the next three to four years. Planned activities. What help is needed from outside, and on what conditions.

*Source: ICH-11 3.1, 3.2, 3.3, C.1, C.2, C.3.*

### Step 6 — Self-check

The heart of the tool. Twenty-four collapsible themes in seven groups. For each: tick what applies, write notes and examples, give a score from 1 to 5. Theme 18 (media) additionally carries a ten-point quick check on whether coverage described the community correctly.

*Source: ICH-10 Section B, Indicators 1–22, 24, 25.*

### Step 7 — Summary

Automatic score summary with average and completion count. Three strongest points, three weakest, three priorities. A short written summary — write this last.

*Source: ICH-10 A.1, Annex to Section B; ICH-11 A.1.*

### Step 8 — Sign-off

How the record was validated: read aloud, reviewed by bearers, reviewed by customary authorities, circulated in writing. Date, attendance with gender and age breakdown. What changed after review. Who was missing and what will be done differently. Names of those who approved it. Who holds the original, who may see it, when to review again.

*Source: ICH-11 Section D; ICH-10 C.7.*

---

## 7. Conversion logic: from periodic report to community form

This section documents exactly how the official instruments were transformed. It exists so the conversion can be audited, criticised and corrected.

### 7.1 The three source layers

```
UNESCO 2003 Convention
        │
        ├── Operational Directives (incl. ODs on media, ethics, participation)
        │
        ├── Overall Results Framework (2018, Res. 7.GA 9)
        │     ├── 8 Overarching Aims
        │     ├── 26 Core Indicators
        │     └── 86 Assessment Factors
        │
        └── Reporting Forms (2027 edition)
              ├── ICH-10 — Sections A, B (26 indicators), C, D, Annex
              └── ICH-11 — Sections A, B, C, D, E
```

### 7.2 Five transformation rules

**Rule 1 — Change the grammatical subject.**

Official forms ask what *the State* has done. Community forms ask what *we* have and what reaches *us*.

| ICH-10 | This tool |
|---|---|
| "Do competent bodies and institutions for ICH safeguarding exist in your country?" | "Is there a group, association, customary body or committee that takes responsibility for this heritage?" |
| "Do training programmes on safeguarding and managing intangible cultural heritage exist in your country?" | "Has anyone offered training on how to protect, record or manage this heritage?" |

**Rule 2 — Move from national aggregate to single element.**

Official indicators cover an entire national system. Each record here covers one element. Where an indicator is inherently systemic (11, 12, 13), the question becomes "does this reach *us*?" rather than "does this exist nationally?"

**Rule 3 — Replace technical vocabulary with concrete nouns.**

This is also a translation-robustness measure — see §16.

| Official term | Community wording |
|---|---|
| viability | how healthy is it |
| safeguarding measures | what have you already done |
| transmission | how it is passed on |
| free, prior, sustained and informed consent | ask first — always |
| inventorying process | making the record |
| bearers and practitioners | who keeps it alive |
| moral and material interests | are bearers named, credited and paid fairly |
| enabling environment for monitoring | can we check whether it is working |

**Rule 4 — Convert assessment factors into tick-boxes.**

The ORF's 86 assessment factors sit behind the 26 indicators. Where ICH-10 exposes them as "select all that apply", they became checkbox options directly. Where they are implicit in prose, they were surfaced as options. Example — Indicator 18.1.1 in ICH-10 lists four things media coverage may accomplish; all four appear verbatim (re-worded) as options under theme 18.

**Rule 5 — Keep the rating scale, simplify the descriptions.**

The Annex to Section B of ICH-10 defines five levels: *Not yet started / Emerging / Moderate / Substantial / Fully achieved*, each with a formal description. The levels are preserved 1:1; the descriptions are rewritten in plain language. See §10 for the side-by-side.

### 7.3 What was dropped, and why

| Dropped | Reason |
|---|---|
| Indicator 23 | ICH-10: "monitored and reported only at the global level" |
| Indicator 26 | ICH-10: "monitored and reported only at the global level" |
| ICH-10 A.4 (accredited NGOs) | Auto-filled from UNESCO's database; not community knowledge |
| ICH-10 A.5 (international cooperation mechanisms) | Auto-filled; State-level |
| ICH-11 Section E / ICH-10 Section D (State signature) | Replaced by community sign-off (§Step 8) |
| Budget figures in USD | Replaced by open text on resources and support, including in-kind |

### 7.4 What was added that has no official counterpart

These additions exist because community practice requires them even though State-level reporting does not.

| Addition | Rationale |
|---|---|
| **Restricted-knowledge field** | ICH-10 references customary access restrictions (6.1b.5, 10.1.1) but provides no field to *declare* them. Communities need to record the boundary before recording anything else. |
| **Consent-holder field** | Who has authority to give or withdraw consent is often contested and rarely written down. |
| **Trend arrows** | ICH-11 B.2 asks about demographics; a two-point comparison makes decline visible at a glance. |
| **Media log and quick check (theme 18)** | Indicator 18.3.1 asks about alignment with Convention concepts but offers no operational test. The ten-point check makes it assessable by non-specialists. |
| **"Who was missing" field** | ICH-11 3.3 asks whether communities "could have been involved more broadly." Making this a required reflection field rather than an afterthought. |
| **Backup / restore** | `localStorage` is volatile. Not a reporting concern, but an existential one for the record. |

---

## 8. The 24 themes and their source indicators

Themes are grouped into seven clusters. The **Aim** column maps to the ORF's eight Overarching Aims.

### Cluster: Capacity — *Aim 1, Institutional and human capacities*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 1 | A group looks after this heritage | Ind. 1 (1.1.1, 1.2.1) | Does a competent body exist? Is there a consultative forum where all voices meet? |
| 2 | Training is available to us | Ind. 2 (2.1.1) | Who provides training? Is it inclusive? |
| 3 | We are the ones being trained — and training others | Ind. 3 (3.1.1) | Are bearers recipients *and* providers? Trained to inventory their own heritage? |

### Cluster: Passing it on — *Aim 2, Transmission and education*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 4 | It is taught, and bearers help shape the teaching | Ind. 4 (4.1.1, 4.2.1, 4.3.1) | Do bearers design and deliver? Are community-recognised modes preserved? |
| 5 | It appears in school lessons | Ind. 5 (5.1.1, 5.2.1, 5.3.1) | Curriculum placement, mother tongue, mutual respect, protection of spaces |
| 6 | Learning after school | Ind. 6 (6.1.1, 6.1.2) | Academic and TVET pathways; can community members actually access them? |

### Cluster: Our record — *Aim 3, Inventorying and research*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 7 | Our record shows the full picture | Ind. 7 (7.1.2, 7.1.3) + 6.1b.1, 6.1b.4 | Diversity of variants; oriented to safeguarding; viability recorded; updated |
| 8 | Everyone helped make the record | Ind. 8 (8.1.2) + 6.1b.6 | Who decided what to record; all sectors, genders, regions; read-back and approval |
| 9 | Research is done with us, not about us | Ind. 9 (9.1.1, 9.1.2, 9.2.1) | Support for research; ethical conformity; consent at every stage |
| 10 | We can get to our own recordings | Ind. 10 (10.1.1, 10.2.1) | Access level; customary restrictions respected; actual use beyond research |

### Cluster: Rules & support — *Aim 4, Policies, legal and administrative measures*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 11 | Cultural rules and support reach us | Ind. 11 (11.1a.1, 11.2.1, 11.3.1) | Policies at each level; equitable support; community participation in policymaking |
| 12 | Education rules recognise it | Ind. 12 (12.1.1) | Recognition, transmission, mother tongue |
| 13 | Other government programmes affect it | Ind. 13 (13.1.1, 13.2.1, 13.3.1, 13.3.2) | Ethical Principles in development; social/economic/disaster; fiscal incentives; resource availability |
| 14 | Our rights are respected | Ind. 14 (14.1.1, 14.2.1) | IP and privacy protection; customary rights to land/sea/forest; conflict resolution |

### Cluster: Its place in society — *Aim 5, Role of ICH in society*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 15 | Its importance is recognised | Ind. 15 (15.1.1, 15.2.1) | Community use for well-being and peace; recognition in development interventions |
| 16 | Our plans include everyone | Ind. 16 (16.1.1, 16.2.1) | Eight inclusivity categories; self-respect and mutual respect |

### Cluster: Telling others — *Aim 6, Awareness raising*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 17 | We lead the telling of our own story | Ind. 17 (17.1.1, 17.1.2, 17.2.1, 17.2.2, 17.3.1) | Consent; moral and material interests; youth engagement; community's own media |
| 18 | Working with journalists and media | Ind. 18 (18.1.1, 18.2.1, 18.3.1) | What coverage accomplished; joint cooperation and capacity-building; alignment with Convention concepts |
| 19 | Public events and recognition | Ind. 19 (19.1.1, 19.1.2, 19.2.1) | Bearer acknowledgement; public events; audiences; mutual respect |
| 20 | Ethics are respected | Ind. 20 (20.1.1) | Ethical Principles; professional codes; community's own rules for outsiders |

### Cluster: Working together — *Aim 7, Engagement of stakeholders*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 21 | Who is really involved | Ind. 21 (21.1.1 a–d) | Depth of participation by CGIs, NGOs, private sector, others |
| 22 | We can check whether it is working | Ind. 22 (22.1.1) | Enabling environment for monitoring by community, NGOs, scholars; grievance channel |

### Cluster: Beyond our area — *Aim 8, International engagement*

| # | Theme | Source | Key sub-questions |
|---|---|---|---|
| 24 | Links across borders | Ind. 24 (24.1.1, 24.2.1) | Shared elements across borders; exchange of information, practice, documentation |
| 25 | Wider networks | Ind. 25 (25.1.1, 25.2.1) | Category 2 centres, UNESCO bodies, accredited NGOs, networks; obstacles |

*Numbering deliberately skips 23; theme numbers match official indicator numbers throughout, so a record can be read alongside the official form.*

---

## 9. Full field-to-source mapping

For auditors, researchers and government focal points.

| App section | App field | Official source |
|---|---|---|
| Basics | Name, translated name, other names | ICH-10 C.2 / ICH-11 B.1 |
| Basics | Type of heritage | ICH-10 6.1b.2 (five domains) |
| Basics | Latitude, longitude, spread, place | ICH-10 6.1b.3 (geographical scope) |
| Basics | Community, contact, contact role | ICH-10 A.2, C.1 / ICH-11 A.2 |
| Basics | Recorded by | ICH-10 A.3.1 (adapted to community actors) |
| Permission | Community was told about | Ethical Principles 4, 7; ICH-10 9.2.1 |
| Permission | Permission status, conditions | ICH-10 9.2.1, 17.1.1 |
| Permission | What must stay private | ICH-10 6.1b.5, 10.1.1 (customary access) |
| Permission | Consent holder | *Added — no official counterpart* |
| The heritage | Description | ICH-11 B.1 |
| The heritage | What it means today | ICH-11 B.1 / ICH-10 C.2 |
| The heritage | Bearers, practitioners, learners | ICH-11 B.2 (demographics) |
| The heritage | Women, men, under 30 | ICH-11 B (gender attention) / ICH-10 16.1.1 |
| The heritage | Special roles | ICH-11 B.1 (roles and responsibilities) |
| The heritage | Places needed | ICH-10 5.3.1 |
| The heritage | Materials needed | ICH-10 13.3.2 |
| Health check | How healthy | ICH-11 B.2 / ICH-10 C.3, 6.1b.4 |
| Health check | How often, notes | ICH-11 B.2 (frequency and extent) |
| Health check | Trends | ICH-11 B.2 (demographics over time) |
| Health check | Ways of passing on | ICH-10 4.2.1 |
| Health check | Strength of teaching | ICH-11 B.2 (traditional modes) |
| Health check | Threats, notes | ICH-11 B.2 / ICH-10 6.1b.4 |
| Our actions | Activities (what/when/who/result) | ICH-11 3.1, 3.2 |
| Our actions | Difficulties | ICH-11 3.2.b |
| Our actions | Support sources, notes | ICH-11 3.2.d, C.3 |
| Our actions | Goals | ICH-11 C.1.a |
| Our actions | Plans | ICH-11 C.1.b, C.2 |
| Our actions | Help needed | ICH-11 C.1.c, C.3 |
| Self-check | Themes 1–22, 24, 25 | ICH-10 Section B |
| Summary | Score summary, average | ICH-10 Annex to Section B |
| Summary | Strengths, weaknesses, priorities | ICH-10 Annex (targets) |
| Summary | Short summary | ICH-10 A.1 / ICH-11 A.1 |
| Sign-off | How it was checked | ICH-11 Section D.b |
| Sign-off | Date, attendance breakdown | ICH-11 Section D (widest possible participation) |
| Sign-off | Changes after review | *Added* |
| Sign-off | Who was missing | ICH-11 3.3 ("could have been involved more broadly") |
| Sign-off | Approved by | ICH-11 Section E (adapted from State signature) |
| Sign-off | Kept by, who may see it, review date | ICH-10 6.1b.1, 6.1b.5 |

---

## 10. The 1–5 scoring scale

Preserved 1:1 from the Annex to Section B of Form ICH-10. Only the descriptions are simplified.

| Level | ICH-10 official label | ICH-10 official description | This tool |
|---|---|---|---|
| 1 | Not yet started | No evidence of progress towards the achievement of the core indicator. | **Nothing yet** — This has not started at all. |
| 2 | Emerging | Initial actions and measures have been undertaken. However, achievements remain limited in scope, coverage or effectiveness, and substantial gaps remain. | **Just beginning** — Something small has started, but it reaches few people. |
| 3 | Moderate | Progress is evident, but implementation is incomplete or uneven. Key actions are being implemented, demonstrating commitment. However, coverage is still partial, quality is variable, and monitoring of outcomes is limited. | **Halfway** — It is really happening, but it is uneven and nobody checks the results. |
| 4 | Substantial | Significant progress has been made. Actions are consistently implemented across relevant areas... only minor gaps remaining. Monitoring mechanisms are in place, although processes for continuous improvement may not yet be systematic. | **Working well** — It happens regularly, only small gaps remain, and results are tracked. |
| 5 | Fully achieved | The core indicator has been achieved. Actions are fully implemented and sustained... Monitoring, evaluation and continuous improvement mechanisms are systematically applied. | **Fully in place** — It works, it lasts, and it is reviewed and improved regularly. |

### A note on scoring honestly

There is a strong temptation to score high. Resist it.

A record full of 4s and 5s is useless for planning and immediately suspect to anyone reading it. A record showing 2s and 3s with clear notes is far more valuable — it identifies exactly where effort should go, and it is credible.

Score 3 does not mean failure. It means *"this is really happening but nobody checks whether it works."* That is an honest and extremely common state of affairs.

---

## 11. Ethics and consent

This tool implements the **Ethical Principles for Safeguarding Intangible Cultural Heritage** (adopted 2015, 12 principles) at the interface level.

### Non-negotiable rules

1. **Ask before recording.** Not after. Not "we'll show them later." Before.
2. **Restricted knowledge stays out.** The tool provides a field to *declare that a restriction exists* and who governs it. It must never be used to store the restricted content itself, "just for our own reference." Once typed, it can be exported, shared and lost.
3. **Consent is not a checkbox event.** Principle 4 of the Ethical Principles requires *sustained* consent. Re-ask at each new stage: recording, archiving, publication, commercial use.
4. **The community can withdraw.** Build in the deletion path from the start. Delete means delete — including from every device the record was shared to.
5. **Read it back.** A record the community has not heard read aloud has not been validated, whatever the sign-off page says.
6. **Include the quiet voices.** Elders and youth, women and men, the central families and the marginal ones. The "Who was missing" field exists to make exclusion visible rather than invisible.

### On the consent-holder question

The field asking *who* may give or withdraw consent is frequently the hardest in the whole form, and the most important. Communities are not monolithic. A performing troupe's leader may not speak for the lineage that owns the repertoire. A village head may not speak for the ritual specialists.

If the answer is contested, **record that it is contested.** That is more useful than a false consensus.

### On sharing

The export modal carries a deliberate warning: *"Before sharing, check that nothing restricted by custom is included. Sharing cannot be undone."*

This is not boilerplate. A JSON file sent over a chat app is copied to the recipient's device, their cloud backup, and possibly their gallery. There is no recall.

---

## 12. Data storage, backup and recovery

### Where data lives

Everything is stored in the browser's `localStorage` under the key `cbi_records_v2`. This is:

- **Local** — never transmitted anywhere
- **Origin-scoped** — records saved on `file://` are not visible from `https://`, and vice versa
- **Browser-scoped** — Chrome and Firefox on the same device do not share records
- **Volatile** — clearing site data, clearing browsing history with "cookies and site data" ticked, uninstalling the browser, or some "cleaner" apps will delete everything
- **Size-limited** — typically 5–10 MB per origin, which is thousands of records, but the app will show an error if it fills

### Back up. Regularly.

**Sidebar → Back up all records** produces a single JSON file containing every record. Do this:

- after every working session
- before clearing browser data for any reason
- before handing the device to anyone else
- before changing phones

Keep at least two copies in different places — one on a computer, one on a USB drive, or one held by a different person in the community.

### Restore

**Sidebar → Restore from file**, select a backup JSON. The importer:

- accepts a full backup (`{records: [...]}`)
- accepts a single-record export (`{record: {...}}`)
- accepts a bare array (`[...]`)
- **does not overwrite** — if an ID already exists, the incoming record gets a suffixed ID, so nothing is silently destroyed

### Moving to a new device

1. Back up on the old device
2. Transfer the JSON file (Bluetooth, cable, chat, email)
3. Open the app on the new device
4. Restore from file

---

## 13. Export formats

| Format | Button | Use it for | Technical notes |
|---|---|---|---|
| **Share** | Share | Sending to a colleague, official, or another device via Bluetooth, WhatsApp, Signal, email | Uses the Web Share API Level 2 with file attachment. Three-tier fallback: file share → text-only share → file download. `AbortError` (user cancelled) is handled silently. |
| **PDF / Print** | PDF / Print | Paper copies for meetings, archives, handover to officials | Opens the browser print dialogue; choose "Save as PDF". A dedicated `@media print` stylesheet hides navigation and prints only the detail view, with page-break control on cards. |
| **Spreadsheet (CSV)** | Spreadsheet | Analysis in Excel, LibreOffice, or a statistics package | UTF-8 with BOM (so Excel reads non-Latin script correctly), CRLF line endings, **every** cell quoted, embedded quotes doubled, newlines flattened to spaces. Arrays joined with `; `. All 24 themes produce three columns each (score, ticked options, notes). |
| **Word** | Word | Editable report, inserting photographs, adding letterhead | HTML with Office namespaces and a `w:WordDocument` processing instruction, so Word opens it as a document rather than a web page. A4 page setup, Calibri, structured tables. |
| **Data file (JSON)** | Data file | Complete backup, moving between devices, feeding another system | Wrapped in a versioned envelope: `{format, version, exported, note, record}`. Pretty-printed. |
| **Catalogue (XML)** | Catalogue | Library, museum and archive catalogues; metadata harvesting | Dublin Core (`dc:`, `dcterms:`) plus a custom `cbi:` namespace for community-specific data. See below. |

### XML structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Community-Based Inventory record. Prepared by and for the community.
     Not an official government or UNESCO report. -->
<cbi:record
  xmlns:cbi="https://example.org/ns/community-based-inventory/1.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/">

  <dc:identifier>CBI-1740000000000</dc:identifier>
  <dc:title>Wayang Sasak</dc:title>
  <dcterms:alternative>Sasak shadow puppet theatre</dcterms:alternative>
  <dc:subject>Performing arts</dc:subject>
  <dc:type>Intangible cultural heritage</dc:type>
  <dc:creator>Sasak Puppetry Association</dc:creator>
  <dc:description>...</dc:description>
  <dcterms:spatial>POINT(116.1167 -8.5833)</dcterms:spatial>
  <dcterms:extent>Radius 28000 metres</dcterms:extent>
  <dc:rights>Permission: Yes, but with conditions. Access: Parts of it are
             restricted. Some aspects may be restricted by customary practice.</dc:rights>
  <dcterms:rightsHolder>Sasak Puppetry Association</dcterms:rightsHolder>

  <cbi:health>
    <cbi:viability>At risk</cbi:viability>
    <cbi:frequency>Less often than before</cbi:frequency>
    <cbi:transmissionStrength>Weakening</cbi:transmissionStrength>
    <cbi:threat>Few bearers left, or bearers are ageing</cbi:threat>
  </cbi:health>

  <cbi:people bearers="9" practitioners="41" learners="14"
              women="11" men="39" youth="16"/>

  <cbi:selfAssessment average="2.71" themesAnswered="24" themesTotal="24">
    <cbi:theme number="1" score="4" title="A group looks after this heritage"
               group="Capacity"/>
    <!-- ... -->
  </cbi:selfAssessment>
</cbi:record>
```

**Change the `cbi:` namespace URI** to one you control before deploying institutionally.

### Export robustness

These were the most fragile parts of the original and were specifically hardened:

- Control characters (`U+0000–U+0008`, `U+000B`, `U+000C`, `U+000E–U+001F`, `U+FFFE`, `U+FFFF`) are stripped before XML escaping — a single stray character otherwise makes the file unparseable
- Empty XML elements are omitted rather than emitted blank
- Blob URLs are revoked on a delay with DOM cleanup, preventing truncated downloads on slower Android browsers
- Filenames are sanitised with a Unicode-aware regex (`\p{L}\p{N}`), preserving non-Latin names while stripping filesystem-hostile characters, capped at 50 characters

---

## 14. Data schema

```typescript
interface Record {
  // Identity
  id: string;              // "CBI-<timestamp>"
  created: string;         // ISO 8601
  updated: string;         // ISO 8601

  // Basics
  name: string;            // required
  name2: string;           // translated name
  alt: string;             // comma-separated alternatives
  domain: string;          // one of five UNESCO domains, or "Other"
  place: string;
  lat: number;
  lng: number;
  spread: number;          // metres

  // Who recorded
  community: string;       // required
  contact: string;
  contactRole: string;
  recordedBy: string[];

  // Permission
  consentInfo: string[];
  consentStatus: string;
  consentCond: string;
  restricted: string;      // fact of restriction ONLY, never content
  consentHolder: string;

  // The heritage
  description: string;
  meaning: string;
  bearers: number;
  practitioners: number;
  learners: number;
  women: number;
  men: number;
  youth: number;
  roles: string;
  places: string;
  materials: string;

  // Health
  viability: string;       // Healthy | Under pressure | At risk |
                           // Needs urgent help | Stopped
  frequency: string;
  freqNote: string;
  trends: { [rowIndex: string]: "up" | "same" | "down" };
  transmissionWays: string[];
  transStrength: string;
  transNote: string;
  threats: string[];
  threatNote: string;

  // Actions
  actions: { what: string; when: string; who: string; result: string }[];
  difficulties: string;
  supportSources: string[];
  supportNote: string;
  goals: string;
  plans: { what: string; who: string; when: string }[];
  needs: string;

  // Self-check — keys are official indicator numbers
  indicators: {
    [n: string]: {
      options: string[];
      checklist: string[];   // theme 18 only
      note: string;
      score: 1 | 2 | 3 | 4 | 5 | null;
    }
  };

  // Summary
  strengths: string[];
  weaknesses: string[];
  priorities: string[];
  summary: string;

  // Sign-off
  validation: string[];
  valDate: string;
  valCount: number;
  valW: number;
  valM: number;
  valY: number;
  valChanges: string;
  valMissing: string;
  signatories: { name: string; role: string }[];
  keeper: string;
  access: string;
  review: string;
}
```

**Note on indicator keys.** They match official ORF indicator numbers, so `record.indicators["18"]` is the media theme. Key `"23"` and key `"26"` never exist.

---

## 15. Handing data to a government focal point

If your Ministry of Culture, National Commission for UNESCO, or heritage agency requests community input for a periodic report:

### What to give them

1. **The PDF** — human-readable, signed, dated
2. **The CSV** — machine-readable for their aggregation
3. **A cover note** stating clearly:
   - this is the community's own self-assessment
   - the correspondence to official indicators is a re-phrasing, documented in this README §7–9
   - the community retains rights over the content
   - which parts, if any, are restricted and must not be published

### What to insist on

- **Attribution.** If your data informs the report, the community should be named.
- **Sight of the draft.** Ask to see how your material was used before submission.
- **A copy back.** Form ICH-10 10.1.1 asks whether documentation is accessible to communities. Ask for the finished report.

### What to be careful about

Once handed over, published periodic reports are public on the UNESCO ICH website. Do not include anything the community has marked restricted.

If your record shows low scores — say, 1s on themes 11, 12 and 13 (government support and policy) — a ministry may be reluctant to reproduce that. **Do not soften it.** Those low scores are the honest finding, and they are exactly the evidence that justifies asking for more support. Keep your own copy regardless of what appears in the official report.

---

## 16. Translation and localisation

### Using browser translation

The interface was written specifically to survive machine translation:

- short sentences, mostly under fifteen words
- concrete nouns instead of abstract nominalisations
- active voice
- no idioms, no metaphors
- no acronyms in the interface text
- consistent terminology — the same concept always uses the same word

To translate: use your browser's built-in translate function (Chrome: right-click → Translate; Safari: address bar → Translate). The layout is designed to tolerate 30–40% text expansion, which covers most European and Southeast Asian languages.

**Caution.** Machine translation will not correctly render your community's own terminology. Always enter names, roles and concepts in your own language in the free-text fields — never rely on translation for those.

### Proper localisation

For a real translation, all user-facing strings live in two places:

1. The `INDICATORS`, `SCALE`, `DOMAINS`, `THREATS` and `VIABILITY` constants at the top of the `<script>` block
2. Template literals in the `p0()` through `p7()` panel functions

A contribution that extracts these into a language file and adds a picker would be very welcome. See §20.

---

## 17. Facilitator guide

For NGO staff, researchers, students and cultural officers supporting a community.

### Your role

You are the typist, not the author. The community decides what is recorded, what is left out, and what the scores are. If you find yourself supplying the answers, stop.

### Time required

| Activity | Realistic time |
|---|---|
| Opening meeting, explanation, consent | 1–2 hours |
| Steps 1–5 (basics through actions) | 2–3 hours |
| Step 6 (24 themes) | 3–4 hours — **split across sessions** |
| Steps 7–8 (summary and sign-off) | 1–2 hours |
| Read-back and validation meeting | 2 hours |
| **Total** | **9–13 hours across 3–4 sessions** |

Attempting the whole thing in one day produces fatigue and shallow answers, especially on the later themes.

### Suggested session plan

**Session 1 — Consent and basics.** Explain, agree, record what stays private. Complete steps 1–3. End early; let people think.

**Session 2 — Health and actions.** Steps 4–5. The trend arrows often provoke the most useful discussion; leave room for it.

**Session 3 — Self-check, part one.** Themes 1–13. Work through them out loud as a group. One person types.

**Session 4 — Self-check, part two, and summary.** Themes 14–25, then steps 7–8.

**Session 5 — Validation.** Read the whole record aloud. Make corrections live. Collect names.

### Facilitation tips

- **Project the screen** if you can, so everyone sees what is typed.
- **Score by discussion, not by vote.** If people disagree between 2 and 3, that disagreement is worth recording in the notes field.
- **Do not skip the notes.** A bare score of 3 tells you nothing in two years' time. Two sentences of context makes it useful.
- **Watch for "we should say we have that."** Gently redirect: the record is for the community's own planning, not a grant application.
- **Let elders speak first on meaning, youth first on media and transmission.** They have different and equally necessary knowledge.
- **Back up at the end of every session.** Every one.

---

## 18. Technical notes

### Stack

| Component | Version | Purpose |
|---|---|---|
| Tailwind CSS | CDN (JIT) | Utility styling |
| Leaflet | 1.9.4 | Interactive maps |
| Phosphor Icons | latest | Iconography |
| Inter | Google Fonts | Typeface |
| CARTO basemaps | — | Map tiles |

No build step. No framework. No bundler. One HTML file, roughly 2,400 lines including data definitions.

### Browser support

| Browser | Minimum | Notes |
|---|---|---|
| Chrome / Edge | 90+ | Full support including file sharing |
| Firefox | 88+ | No Web Share Level 2 — falls back to download |
| Safari (iOS) | 14+ | Full support |
| Safari (macOS) | 14+ | Text share only |
| Samsung Internet | 14+ | Full support |

Required APIs: `localStorage`, `Blob`, `URL.createObjectURL`, `FileReader`, ES2018 (async/await, spread, optional chaining not used). `navigator.share` and `navigator.geolocation` are feature-detected with fallbacks.

### Architecture

Single `app` object, no framework. Views are `<main>` elements toggled by class. The form is eight `.panel` divs with `display` switching. Indicator content is generated from the `INDICATORS` array at boot, so adding or amending a theme means editing one array entry, not touching markup.

### Adding or amending a theme

```javascript
{
  n: 27,                          // number (avoid 23, 26)
  group: "Capacity",              // cluster heading
  icon: "ph-buildings",           // Phosphor icon name
  title: "Short plain title",
  q: "The question, in plain words?",
  opts: ["Option one", "Option two"],
  extra: "Guidance for the notes field.",
  scaleLabel: "Optional custom label for the score",   // optional
  checklist: {                                        // optional
    title: "Quick check heading",
    items: ["Check one", "Check two"]
  }
}
```

Everything else — the accordion, options, notes field, scale, summary, exports — is generated automatically.

### Security

No server, no authentication, no network transmission of user data. The threat model is therefore **physical device access**, not remote attack.

All user-supplied strings are escaped before insertion into the DOM (`esc()`), into Word HTML (`esc()`), into CSV (`csvCell()`) and into XML (`xmlEsc()`). Even so, on a shared device, anyone with the unlock code can read every record. For sensitive material, use a device with a lock and consider full-device encryption.

---

## 19. Limitations and known issues

**Honest list.**

1. **`localStorage` is fragile.** A cleaning app can delete everything without warning. Backup is the only mitigation and it is manual.
2. **Not a real PWA.** No service worker, no manifest. First load needs a network. Adding these would be a valuable contribution.
3. **Map tiles need a connection.** Offline, the map shows grey; coordinates, marker and radius still work.
4. **No photo or audio attachments.** Deliberate — media would blow past the `localStorage` quota immediately. Keep media in a separate folder, referenced by record ID.
5. **No multi-device sync.** By design. Sync means a server, and a server means a data controller, custody questions, and a target.
6. **English only in the default build.** See §16.
7. **No conflict resolution on import.** Duplicate IDs are suffixed, not merged. If two people edit the same record separately, you get two records.
8. **The 1–5 scale is subjective.** Two communities scoring themselves 3 may be in very different situations. Scores are for internal tracking over time, not for comparison between communities.
9. **The indicator mapping is an interpretation.** It is documented so it can be challenged. If you think a mapping is wrong, open an issue.
10. **Print output is long.** A fully completed record runs 12–20 pages. That is inherent to 24 themes.

---

## 20. Contributing

Contributions are welcome, particularly:

**High priority**

- Service worker and manifest for true offline / installable use
- Translation infrastructure (string extraction plus language picker) and translations, especially into languages of communities using the tool
- Offline map tile support

**Also valuable**

- Accessibility audit (screen readers, keyboard navigation, contrast)
- Photo attachment via IndexedDB rather than `localStorage`
- Improvements to the indicator mapping, with reasoning
- Print stylesheet refinement
- Field-testing reports — what broke, what confused people, what was missing

### Ground rules

1. **No telemetry.** No analytics, no crash reporting, no "anonymous usage statistics." Ever.
2. **No mandatory network calls.** Any new feature must degrade gracefully offline.
3. **Plain language.** New interface text must be readable by someone with basic literacy and must survive machine translation.
4. **Document indicator mappings.** If you change how a theme relates to an official indicator, update §8 and §9.
5. **Do not claim official status.** Pull requests implying UNESCO endorsement will be rejected.

### Process

```bash
git checkout -b feature/your-feature
# edit index.html
# test on a real phone AND a desktop browser
# test every export format and open the resulting files
git commit -m "Add: short description"
# open a pull request
```

Test exports properly. Open the CSV in Excel *and* LibreOffice. Open the `.doc` in Word *and* LibreOffice Writer. Validate the XML with `xmllint`. Round-trip the JSON through the import function.

---

## 21. Citation

If you use this tool in research or in a publication:

```bibtex
@software{community_heritage_recorder,
  title  = {Community Heritage Recorder: A Community-Based Inventory Tool
            Derived from the UNESCO 2003 Convention Periodic Reporting Framework},
  year   = {2025},
  url    = {https://github.com/YOUR-ORG/community-heritage-recorder},
  note   = {AGPL-3.0-or-later}
}
```

### Related official sources

- UNESCO. *Convention for the Safeguarding of the Intangible Cultural Heritage.* Paris, 2003.
- UNESCO. *Operational Directives for the Implementation of the Convention.* Latest edition.
- UNESCO. *Overall Results Framework for the Convention.* Resolution 7.GA 9, 2018.
- UNESCO. *Ethical Principles for Safeguarding Intangible Cultural Heritage.* 2015.
- UNESCO. Form ICH-10 (2027 edition), revised 30 June 2026.
- UNESCO. Form ICH-11 (2027 edition), revised 30 June 2026.

All available at [ich.unesco.org](https://ich.unesco.org).

**Always check the current official forms.** The 2027-edition forms note that the online submission system was still under preparation with a target date of 30 September 2026. Question wording may change.

---

## 22. Licence

**GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**

```
Community Heritage Recorder
Copyright (C) 2025 Contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

### What AGPL-3.0 means here

**You may:** use it for any purpose including commercially; study and modify it; distribute copies; distribute modified versions.

**You must:** keep it under AGPL-3.0-or-later; disclose your source; state your changes; preserve copyright and licence notices.

**The network clause (§13) — why it matters for this project:** if you run a modified version as a network service, you must offer the complete source of your modified version to its users. You cannot take this tool, add features, host it as a service for communities, and keep those improvements private. Improvements made on the backs of communities must flow back to communities.

### What the licence does *not* cover

**The heritage data itself is not licensed by this project.** Records created with this tool belong entirely to the communities who made them. The AGPL covers the software only.

Nothing in this licence grants any right over any community's intangible cultural heritage, traditional knowledge, expressions, motifs, names or practices. Those rights are held by the communities concerned, under their own customary law and applicable national and international frameworks.

**Third-party components** retain their own licences: Tailwind CSS (MIT), Leaflet (BSD-2-Clause), Phosphor Icons (MIT), Inter (SIL OFL 1.1), CARTO basemaps (subject to CARTO terms), OpenStreetMap data (ODbL).

---

## 23. Disclaimer

This software is provided "as is", without warranty of any kind.

**It is not affiliated with, endorsed by, or approved by UNESCO.** References to UNESCO conventions, forms, indicators and frameworks are made for the purpose of accurate description and interoperability. Form ICH-10 and Form ICH-11 are UNESCO documents; this project reproduces their *structure and themes* in adapted form, with attribution, and does not present itself as an official instrument.

**Output is not an official report.** Under the 2003 Convention, periodic reports are submitted by States Parties through official channels. A record produced by this tool is community-held documentation. It may inform an official report if a State Party chooses to draw on it, but it is not, and cannot become, a periodic report in itself.

**Users are responsible for ethical conduct.** The tool cannot enforce consent, prevent the recording of restricted knowledge, or guarantee that a community was genuinely consulted. Those responsibilities rest entirely with the people using it. Recording a community's heritage without their free, prior, sustained and informed consent is a serious harm, and no software can prevent it.

**Verify against current official documents.** Reporting forms and indicator wording are periodically revised by the Intergovernmental Committee and the General Assembly. Always cross-check against the current versions at [ich.unesco.org](https://ich.unesco.org) before relying on any mapping in this README.

---

<div align="center">

**Built so that communities can hold their own record.**

*Living heritage belongs to the people who keep it alive.*

</div>
