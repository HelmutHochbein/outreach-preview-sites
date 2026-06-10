---
name: handwerk-outreach-sites
description: Use when creating, redesigning, auditing, generating, publishing, or scaling static Muster-Websites for local Handwerksunternehmen from Airtable records, existing websites, URLs, business data, trades, home services, contractor websites, outreach demos, Dachdecker, Elektriker, Sanitär, Maler, Gartenbau, Tischler, or similar German local-service businesses.
---

# Handwerk Outreach Sites

## Overview

This skill guides repeatable static sample websites for local German trades businesses. The goal is a believable, conversion-ready demo site that can be generated from an Airtable record or existing website, committed to GitHub, deployed with GitHub Pages, and sent as a preview with little user intervention.

## Use This With

Prefer existing project skills rather than duplicating them:

| Need | Use |
|---|---|
| Visual direction, brand, logo, hero, UI style | `ckm:design`, `ckm:brand`, `ckm:ui-styling` |
| Page structure and navigation | `site-architecture` |
| German website copy and CTAs | `copywriting`, then `copy-editing` |
| Lead flow and contact conversion | `cro` |
| Local search, GBP, service area, NAP | `seo-local`, `seo-maps` |
| JSON-LD and rich data | `seo-schema` or `schema` |
| Image sizing, alt text, performance | `seo-images`, `seo-technical` |
| Visual QA screenshots | `seo-visual` or browser verification |
| Airtable record input | Airtable connector: search base, list tables, read record |
| GitHub repository, commit, PR, Pages preview | GitHub plugin/CLI |

Load `references/static-site-pipeline.md` when the user provides an Airtable record, an existing website URL, or asks to generate/publish the static site end to end.

Load `references/quality-rubric.md` when auditing a finished site, choosing a trade-specific page structure, or comparing multiple Muster-Websites.

## Input Modes

- **Airtable record**: Resolve the base, table, and record with the Airtable connector. Convert fields into a site brief before writing code. Do not require the user to manually restate fields already present in Airtable.
- **Existing website URL**: Inspect the current site for business facts, services, tone, local signals, and visual cues. Treat weak existing design as source material, not as a style to copy.
- **Plain business brief**: Use the supplied business name, trade, location, services, and contact details. Fill gaps with clearly marked placeholders.

If the input contains enough business identity, trade, service area, and contact path to create a credible demo, proceed without asking follow-up questions. Ask only when a missing fact would change the generated site materially, such as target business, target repository, or whether to publish.

## Workflow

1. **Normalize the input**
   Build a concise site brief from Airtable, an existing website, or the user's notes: business name, trade, city/service area, core services, phone/email, differentiators, proof signals, existing URL, and preferred repo name.

2. **Classify the business**
   Identify trade, service area, urgency level, trust model, seasonality, and whether the business is brick-and-mortar, service-area, or hybrid.

3. **Plan the site**
   Use a small local-service structure by default: Home, Leistungen, one page or section per core service, Referenzen/Projekte, Über uns, Einzugsgebiet, Kontakt. Add emergency, financing, warranty, or maintenance pages only when the trade needs them.

4. **Create a distinct design premise**
   Pick one concrete visual angle: workshop precision, clean engineering, warm family business, premium renovation, emergency reliability, heritage craft, or modern regional specialist. Avoid interchangeable SaaS cards, giant abstract gradients, stock-like hero crops, and vague "quality/service/trust" compositions.

5. **Write conversion-first German copy**
   Lead with the trade, region, and outcome. Make CTAs concrete: "Dachcheck anfragen", "Rückruf vereinbaren", "Angebot für Badmodernisierung", "Notdienst anrufen". Include phone-first mobile behavior when urgent or high-intent.

6. **Build local trust**
   Include real-feeling signals: owner/team, years in business, Meisterbetrieb/Innung when relevant, certifications, warranty, local project examples, material brands, response times, review snippets, service area, and clear NAP placeholders.

7. **Generate the static site**
   Create or update a standalone static site directory with `index.html`, CSS, JS only when useful, images/assets, `robots.txt`, `sitemap.xml`, and a clear `README.md`. Prefer simple, dependency-light static output unless the existing project already uses a framework.

8. **Implement local SEO foundations**
   Add sensible title/meta, one H1, service/location language, LocalBusiness or trade-specific JSON-LD, image alt text, sitemap, robots.txt, and clean internal links. For demos, use realistic placeholders without inventing unverifiable certifications.

9. **Verify like a client would**
   Check desktop and mobile first viewport, contact path, tap targets, image rendering, no overlap, no horizontal scroll, basic performance, and whether the site can be understood in 5 seconds by a homeowner.

10. **Prepare GitHub delivery**
   Commit the static site to the requested GitHub repository or create a repo/branch when asked. Include GitHub Pages-ready structure and tell the user the repo path, branch, and preview/deploy next step. Do not publish or push if the user has not authorized GitHub changes.

## Default Output Standard

A finished Muster-Website should include:

- A first viewport with the company/trade, region, primary service promise, real-looking visual, phone/contact CTA, and a hint of the next section.
- Service sections that answer "what exactly do they do, for whom, where, and what happens next?"
- Trust and proof before the final CTA, not only at the bottom.
- Mobile-first contact behavior: phone, quick form, or callback depending on trade urgency.
- Local SEO basics and schema placeholders that can be replaced by a real business.
- Visual assets that show actual craft, materials, buildings, tools, teams, or completed work.
- A GitHub Pages-friendly static output with no hidden build requirement unless documented in the README.

## Trade Heuristics

- **Emergency trades**: electricians, plumbers, locksmith-like services need phone-first CTAs, response time, availability, and area clarity.
- **High-ticket renovation**: roof, bathroom, facade, windows, solar-adjacent work needs proof, process, warranty, financing or staged consultation.
- **Aesthetic trades**: painters, landscapers, carpenters need before/after, material taste, project galleries, and design confidence.
- **Compliance-heavy trades**: electrical, heating, roofing, fire safety need certification placeholders, standards language, and careful claims.

## Quality Gate

Before calling a Muster-Website ready, answer yes to all:

- Does it feel like a specific local business rather than a template?
- Can a visitor identify trade, region, and next action above the fold?
- Are CTAs matched to the buying moment and trade urgency?
- Are trust signals concrete and plausibly verifiable?
- Does mobile work without cramped text, overlap, or hidden contact paths?
- Are SEO/schema/image basics present without keyword stuffing?
- Is the site ready to commit and preview through GitHub Pages?

If any answer is no, revise before delivery.
