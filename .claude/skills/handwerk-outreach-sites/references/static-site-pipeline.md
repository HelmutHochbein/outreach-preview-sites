# Static Site Pipeline

Use this reference when generating a Handwerk outreach site from Airtable, an existing website, or a short business brief.

## Goal

Create a static, GitHub Pages-ready preview site with minimal user effort. The agent should gather source data, normalize it into a brief, generate the site, verify it locally, and prepare GitHub delivery.

## Airtable Input

When the user references Airtable, use the Airtable connector in this order:

1. `search_bases` or `list_bases` to identify the base.
2. `list_tables_for_base` to inspect tables and field IDs.
3. `list_records_for_table`, `search_records`, or interface-page record tools to locate the business record.
4. Read linked records only when they provide services, images, contacts, notes, or status needed for the site.

Normalize likely fields into this brief:

| Brief field | Airtable examples |
|---|---|
| `business_name` | Name, Unternehmen, Firma |
| `trade` | Branche, Gewerk, Kategorie |
| `city` / `service_area` | Stadt, Region, Einzugsgebiet |
| `services` | Leistungen, Angebot, Service-Liste |
| `phone` / `email` | Telefon, E-Mail, Kontakt |
| `website_url` | Website, URL, Bestehende Website |
| `notes` | Notizen, Besonderheiten, Positionierung |
| `proof` | Bewertungen, Zertifikate, Referenzen, Meisterbetrieb |
| `status` | Pipeline status, preview sent, GitHub URL |

If useful, update Airtable after generation with preview URL, repo URL, status, or notes, but only when the user asked for Airtable updates or the workflow clearly expects it.

## Existing Website Input

When the user provides a URL:

1. Fetch and inspect the site for business identity, services, local area, contact details, trust signals, and visual direction.
2. Extract facts conservatively. Do not invent certifications, memberships, ratings, or guarantees.
3. Use the existing site as source material. Improve structure, copy, visual polish, and local SEO rather than cloning the design.
4. If images from the existing site are used, preserve attribution/rights uncertainty in the README unless the user confirms they are allowed to reuse them.

## Site Brief

Before writing files, internally form this brief:

```yaml
business_name:
trade:
city:
service_area:
primary_services:
urgent_service: false
contact:
  phone:
  email:
  address:
existing_website:
design_premise:
trust_signals:
proof_or_projects:
repo:
preview_status:
```

Ask the user only for missing `business_name`, `trade`, or GitHub target when those cannot be inferred.

## Static Site Output

Default to a single-site directory named `website-[slug]` unless the user specifies a repo/folder. Include:

- `index.html`
- `assets/css/styles.css`
- `assets/js/main.js` only when interaction is needed
- `assets/images/` with optimized local images or placeholders
- `robots.txt`
- `sitemap.xml`
- `README.md`

Keep the site dependency-free by default. If a framework is already present or requested, follow that project style and document build/deploy steps.

## GitHub Delivery

Prepare for GitHub Pages:

- Use relative asset paths.
- Keep the entry point at `index.html`.
- Avoid server-only routing.
- Include a README with preview purpose, source input, replacement placeholders, and Pages deployment note.
- If pushing is authorized, commit intentionally and push to the requested branch or create a draft PR.

Recommended GitHub Pages setup for static output:

- Deploy from branch: `main` or preview branch.
- Folder: repository root for single-site repos, or `/docs` if the repo already uses that convention.
- Share the resulting Pages URL once available.

Do not claim that the Pages URL is live until GitHub has actually produced it or the user confirms deployment.

## Verification

Before delivery:

- Open locally in browser or run a lightweight static server.
- Check desktop and mobile viewport.
- Verify hero image, CTAs, navigation, form/contact links, and no horizontal scroll.
- Check title, meta description, H1, schema, `robots.txt`, and `sitemap.xml`.
- Run `git status` and summarize changed files.

## Minimal User-Touch Policy

Proceed without extra questions when the input contains enough to produce a credible preview. Use placeholders for non-critical missing details and mark them clearly. Stop only for permissions, target repo ambiguity, or facts that would materially change the site.
