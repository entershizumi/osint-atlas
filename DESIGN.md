# Atlas visual refresh — 2026-11-03

Reference: https://catlavan.net/. Inspected a Firecrawl full-page capture (1440 × 4380); the direct browser showed a Cloudflare challenge, which was not interacted with. The actual reference pixels were inspected from Firecrawl's screenshot, saved to the task's work directory. The HTML and branding output were used as secondary evidence.

## Observed reference

- Large scenic opening section with centered white copy; a compact floating translucent navigation capsule.
- Warm near-white sections, muted gray text, generous vertical gaps, compact outlined labels.
- Rounded feature/settings cards, slate-lavender filled buttons, quiet borders and very little hard shadow.
- Inter typography; large, tightly spaced headings and modest body text. Automated reported h1/h2 sizes of 16px do not reflect the visible hierarchy and are not used as exact evidence.
- A final large wordmark and understated footer rules.
- Firecrawl CSS/branding values: background `#F5F5F2`, primary/slate `#838BA1`, secondary `#5B6A92`, body gray `#5F5F5D`, component radius 14px. A red `#D72638` also appears in the extracted link palette, but the main visible calls to action are slate, not red.
- Reference imagery: Minecraft waterfront hero, laptop/client illustration, lighthouse and landscape product cards. These images, logo, wording and prices are not reused.

## Current Atlas direction — Field notes

The catalog now opens as an editorial field atlas rather than a dashboard banner. The catalog home uses full-width masthead navigation, an oversized three-line Cyrillic heading with a Georgia italic line, a working source-map diagram and a ruled index of real catalog counts. Other workspaces retain their navigation rail. The home menu drawer is inert while closed.

The diagram has keyboard-operable Domain / Photo / Company tabs, four selectable source nodes per route, role explanations and a real action to a source detail or built-in tool. It is explicitly a route diagram, not live intelligence or an invented result. Source labels do not imply automatic searches.

Three original code-native illustrations introduce file metadata, the 3D globe and Google query construction. Catalog covers use category-specific geometric diagrams. The footer ends in an oversized Atlas wordmark. No external imagery or reference artwork is used.

Light tokens: paper `#F5F5EE`, ink `#203D2E`, green `#245E48`, secondary text `#657066`, rule `#D5DBCD`. Panels use a warm white, small 8–9px corner radii, fine borders and restrained shadows. The photo, planet and query cards have sage, deep green and pale violet surfaces respectively. Dark mode uses light sage text on deep ink surfaces.

Type: Golos Text with Georgia italic. Desktop headline uses 58–94px depending on width. On small phones the first two lines are 60–70px and the final italic line scales to fit the viewport. Main section headings are 25–33px, tool titles 20px, descriptions 12–13px. Figure labels are deliberately small and supplementary; all actionable source nodes have visible names and keyboard focus states. Reduced motion disables transforms and transitions.

At 390px, the hero and diagram stack, feature cards become vertical, and the catalog uses one column. At desktop sizes, the hero is split and the three feature cards sit in a row. These are independently designed responsive layouts, not observations about the reference.

## Earlier adaptation (superseded on catalog home)

The dashboard stays task-oriented: an inset navigation rail, floating rounded top toolbar, a custom map scene hero and tool cards. It does not reproduce the reference's landing-page section order or gaming identity.

Proposed tokens (implementation choices):

| Role | Light | Dark |
|---|---|---|
| Background | `#F5F5F2` | `#15171E` |
| Panel | `#FFFFFF` | `#1E212B` |
| Main text | `#272A32` | `#F2F1F6` |
| Secondary text | `#666B78` | `#ACAFBF` |
| Border | `#E4E5E9` | `#343846` |
| Primary action | `#65718B` | `#AAB5D6` |
| Link / focus | `#53658F` | `#C3D0F2` |

Typography: keep the established Cyrillic-capable Golos Text font. Use a 52–60px desktop hero heading, 28px section titles, 19px tool titles, 13px card descriptions, and 12–14px controls. Mobile hero heading: 36–42px.

Cards use 18px radii, tool panels 20px, the hero 24px. Controls use 10–12px radii. Spacing follows 8/12/16/24/32/48px steps; these are proposed values, not measured reference CSS.

The hero map illustration is original SVG generated for Atlas. It is decorative, not a real location or current intelligence layer. No reference assets are copied. Existing provider attribution remains inside God's Eye View, whose own upstream interface is preserved.

Responsive behavior is implemented independently and checked at a mobile viewport; the desktop reference alone is not evidence of its mobile behavior. Motion is reduced when requested by system settings.

