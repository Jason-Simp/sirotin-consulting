# Project inventory

Inventory completed 2026-08-02. Status labels describe how each supplied item should be treated during implementation.

## Business model and pricing

| File | Type | Purpose | Status | Product impact | Treatment |
| --- | --- | --- | --- | --- | --- |
| `00_START_HERE.md` | Markdown | Governing project mission, commercial rules, scope, sequence, domains, and quality bar | Current; final authority | Entire product | Use directly as the first source of truth |
| `Raw Docs/00_READ_ME_FIRST.txt` | Text | Index and cautionary notes for the recreated package | Supporting; current for its four DOCX files | Business, legal, launch | Preserve; use as provenance and attorney-review warning |
| `Raw Docs/01_Jason_AI_Automation_Partner_Launch_Kit.docx` | Word document, 30 pages | Consolidated offer, website copy, sales playbook, operations, forms, agreement, policies, and launch checklist | Supporting; heavily duplicates DOCX 02-04 | Entire product | Normalize against newer master brief and `00_START_HERE.md`; do not use as an unfiltered source |
| `Raw Docs/03_AI_Automation_Partner_Website_and_Sales_Copy.docx` | Word document, 10 pages | Offer, one-page site copy, and conversion playbook | Supporting; duplicated in launch kit | Public website and sales | Use for copy options; newer master brief wins |
| `Raw Docs/Jason’s AI Automation Partner Website and Client Portal Plan.md` | Markdown | Earlier detailed product/portal/Stripe/database plan | Supporting; earlier than master brief | Entire product | Use for operational detail not contradicted by newer sources |
| `Raw Docs/MASTER WEBSITE, CLIENT PORTAL, SEO, LLM AND DESIGN BRIEF.md` | Markdown | Most recent supplied master specification before `00_START_HERE.md` | Current supporting source | Entire product | Primary implementation detail source after final user instructions |

## Client portal and operations

| File | Type | Purpose | Status | Product impact | Treatment |
| --- | --- | --- | --- | --- | --- |
| `Raw Docs/04_AI_Automation_Partner_Client_Forms_and_Checklists.docx` | Word document, 10 pages | Intake, project brief, testing, approval, access, cost, cancellation, and launch forms | Current supporting source; portions duplicated in launch kit | Portal data model and admin workflows | Convert relevant fields into structured records and UI; retain legal warnings |

## Legal agreements and policies

| File | Type | Purpose | Status | Product impact | Treatment |
| --- | --- | --- | --- | --- | --- |
| `Raw Docs/02_AI_Automation_Partner_Agreement_and_SOW.docx` | Word document, 7 pages | Agreement, order form, recurring-payment authorization, limitations, and IP terms | Attorney-review draft; duplicated in launch kit | Checkout acceptance, legal pages, billing, audit records | Never publish as final law-ready text until placeholders and counsel review are complete |

## SEO, structured data, and AI-search optimization

These requirements live in `00_START_HERE.md` and sections 14-16 of the master brief. The master brief still contains `YOURDOMAIN.com` placeholders; implementation must normalize every public URL to `https://automatemejay.com`.

## Design system, branding, images, and visual assets

The detailed asset-by-asset disposition is in `ASSET_MANIFEST.md`.

| Folder/file group | Type | Apparent purpose | Status | Product impact | Treatment |
| --- | --- | --- | --- | --- | --- |
| `Sirotin Images/Jason Sirotin 2026 Headshot.png` | PNG, 1080x1457 | Primary professional portrait | Strong final candidate | Hero/about/entity identity | Use after responsive crops and optimization |
| `Sirotin Images/Jason Sirotin Consultation.jpg` | JPEG, 1350x1080 | Jason in a consultation/video-call setting | Supporting candidate | Collaboration/human relationship/OG | Crop out simulated call controls if used; do not imply a live portal feature |
| `Portfolio/*.png` (12 files) | PNG screenshots, mostly 1407x904 | Work samples and visual references | Rights/context validation required | Credibility or design reference | Keep out of MVP public pages until publication rights, client approval, and captions are confirmed |
| `Portfolio/*.svg` (14 files) | SVG thumbnails, 1920x1080 canvas | Simpl-branded product artwork | Reference-only; conflicts with independent-brand rule | Design reference only | Do not publish directly |

## Complete supplied visual file list

### Portfolio PNGs

- `Baxter BBC Operating System.png` — 1329x990
- `Brain Bytes Creative Business.png` — 1407x904
- `Driveon Protection.png` — 1407x904
- `ECG Productions.png` — 1407x904
- `School Amplified Business.png` — 1407x904
- `SimplCity Product.png` — 1407x848
- `SimplDemocracy.png` — 1407x848
- `SimplEngine Product.png` — 1407x848
- `SimplScribe Product.png` — 1407x904
- `SimplSite Product.png` — 1407x848
- `SimplWiki Product.png` — 1407x904
- `Tire God Go To Market.png` — 1407x904

### Portfolio SVGs

- `Simplengine 2 thumbnail.svg`
- `simplbridge thumbnail.svg`
- `simplcontent thumbnail.svg`
- `simplengine thumbnail.svg`
- `simplevoice thumbnail.svg`
- `simplmail thumbnail.svg`
- `simplnewsletter thumbnail.svg`
- `simplsocial dashboard thumbnail.svg`
- `simplsocial thumbnail.svg`
- `simplsolutions product portfolio thumbnail.svg`
- `simpltraining thumbnail.svg`
- `simplupload thumbnail.svg`
- `simplwiki 2 thumbnail.svg`
- `simplwiki thumbnail.svg`

## Historical, duplicated, and non-product files

| File | Type | Status | Treatment |
| --- | --- | --- | --- |
| `.DS_Store`, `Portfolio/.DS_Store`, `Raw Docs/.DS_Store` | macOS metadata | Obsolete/non-product | Exclude from version control and deployment |

## Review notes

- All four DOCX files were text-extracted and rendered successfully: 57 pages total.
- The launch kit duplicates substantial portions of the agreement, website copy, and forms documents; duplicates are preserved and reconciled rather than discarded.
- The master brief and earlier portal plan agree on the core offer and data model.
- The material conflicts requiring explicit decisions are captured in `DECISION_LOG.md`.
