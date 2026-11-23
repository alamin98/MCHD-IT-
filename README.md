# MCHD IT — Website Redesign

A static front-end with no build step and no runtime dependencies: one `index.html`, one CSS file, and one JS file. It deploys to any web server (Apache, Nginx, IIS) or drops into an existing CMS theme.

```
index.html                 markup (all live-site copy, verbatim)
assets/css/main.css        design tokens + all components
assets/js/main.js          interactions + content config (SYSTEMS, EXPERTISE, PINS)
assets/video/              hero walkthrough (webm + mp4)
assets/img/                logos, team photos, partners, dotted world map
scripts/check-content.mjs  content-parity guard  →  node scripts/check-content.mjs
CONTENT-INVENTORY.md       the verbatim copy this build must preserve
```

## What changed

**Hero.** The content is centred at the top, followed by a cinematic featured-system stage.
- **Wide landscape screens (≥900px):** the hero pins while the stage scales from an inset card to full-bleed. The corner radius goes to 0 and the copy fades out.
- **Video playback:** the walkthrough starts once the frame opens, and rewinds when you scroll back up.
- **Chapters:** the system's chapter bars work like a carousel. They auto-advance with the video and you can click one to jump to it.
- **Pause:** a pause control covers WCAG 2.2.2.
- **Background:** slowly drifting light beams, a panning dot grid and floating particles.
- **Small and portrait screens:** no pinning; the video sits on top with the caption below it.

**What We Do.** On desktop this is a scroll-driven explorer: a sticky index on the left drives a large panel with a bespoke animated illustration per category. Click any item or use the arrow keys to jump. On tablet and mobile, and with reduced motion, it becomes stacked cards. "Show More" is kept and appears automatically once more than 6 categories are configured.

**Rest of the site.**
- **Technology:** cards with hover states.
- **Team:** a snap carousel with arrows, dots, keyboard support and autoplay that pauses on hover and focus.
- **Map:** an interactive dotted world map traced from the live map, with arcs from Bangladesh and all 15 labelled countries.
- **Partners:** a marquee.
- **Navigation and utilities:** a floating nav with active-section state, a mobile menu and back-to-top.

## Accessibility and performance

- **Reduced motion:** with `prefers-reduced-motion`, the page drops pinning, autoplay, particles and the marquee, and shows the static layout.
- **Accessible names:** semantic landmarks, a skip link, tab/tabpanel roles in the explorer, and labelled carousel controls.
- **Animation cost:** animations use only `transform` and `opacity`. rAF loops run only while their section is on screen.
- **Weight:** the hero video is about 1.4 MB (mp4) or 1.2 MB (webm), with a poster and faststart. The JS is about 40 KB unminified and has no libraries.
- **Server requirement:** the server must support HTTP Range requests so video seeking works. All standard servers do.

## Must replace before launch

These are placeholders or gaps that the source screenshots could not provide:

1. **Hero video.** `graveyard-system.mp4/.webm` is a camera-move render of the single dashboard screenshot. Replace it with a real 10–20 s screen recording at 1920×1200, H.264 crf ~24, muted, and update `chapters[].start` in `main.js`.
2. **The other 3 hero carousel slides.** Add them to `SYSTEMS` in `main.js`. Prev/next and auto-advance switch on automatically.
3. **Expertise categories hidden behind "Show More"** on the live site. Add them to `EXPERTISE`.
4. **Remaining team members.** The live carousel shows about 14 dots; only 4 were visible. Duplicate the `<li class="person">` blocks.
5. **Link targets.** All 6 "Learn more" links, Client Portal and Contact are `#` or `#contact`.
6. **Footer content** below the Client Portal row, if any.
7. **Higher-resolution originals** of the logos, team photos and partner logos. These were cropped from a screenshot, and the icddr,b logo is faded because it was captured at the marquee edge.
8. **Fonts.** The build uses Plus Jakarta Sans and JetBrains Mono from Google Fonts. Self-host them if the hosting environment blocks Google.

## Content issues found on the live site (left unchanged, per brief)

- **Hero vs. Global Footprint numbers:** the hero says 13+ / 120+ / 10M+, while Global Footprint says 11+ / 104+ / 10M+.
- **Team emails:** they appear shifted by one person. For example, Md. Ashrafuzzaman is shown with saleheen@icddrb.org.

## Update — 2026-11-06 (round 2)

- **Hero:** the video autoplays whenever the stage is on screen, with no click needed. On scroll, the frame scales to full-bleed while the footage gently zooms out from 1.10× to 1.00×, then pushes back in on exit.
- **Core Expertise:**
  - The "End-to-End Digital Health Solutions" banner was removed, as requested.
  - The explorer is now an equal 50/50 split, and the left list is the scroll timeline: active row, per-row progress, a counter, and a connector beam to the panel.
  - It now lists all 12 categories, including the 6 that sit behind "Show More" on the live site.
- **Team:** a continuous marquee that pauses on hover and focus.
- **New pages:**
  - `expertise.html?slug=…` is one template for all 12 categories. It has breadcrumbs, an overview, "What we do", tools, a contact call-to-action, prev/next, and a "More Expertise" sidebar.
  - `contact.html` has a contact form.
  - `login.html` is the Client Portal sign-in.
- **Pages are generated:** edit `scripts/build-pages.py` and run `python3 scripts/build-pages.py`.
- **Configure before launch:** the `SITE` block at the top of `assets/js/pages.js` holds the contact email, phone and address, the contact form endpoint, and the portal login URL and forgot-password URL.
- **Content still needed:**
  - Card descriptions for the 6 "Show More" categories (OPD, Dashboards, MEL, Data Security, API, ICT Training).
  - Overview, "What we do" and tools text for every expertise page except National Surveys. Pages without it show the title, description and navigation only.

## Update — round 3
- **Real product screens:** the expertise screens from `E:\Working place\Claude\video\Inner page` now appear in the home explorer panels and in the expertise page heroes. EDC and MEL also show a second screen. LIMS, OPD and API have no screen yet, so they keep the drawn illustration.
- **Contact page:** rebuilt from the live contact page with verbatim copy: the form, the contact cards, and all 17 team members with a show/hide toggle. With no backend configured, the form opens the visitor's email app addressed to qsrahman@icddrb.org.
- **Sign-in page:** rebuilt from the live portal page with verbatim copy. Set `SITE.portalLoginAction` in `assets/js/pages.js` to point it at the real portal.
- **Home team marquee:** now shows all 17 members from `data.js`, with the email-to-person mapping taken from the contact page.
- **Still waiting on:** the hero video file, and the full Details text for expertise pages 2–12.
- **Round 3, final:**
  - **Hero film:** the hero now plays `assets/video/showreel.mp4`, the 45 s MCHD IT showreel compressed to about 7 MB. It is muted, autoplays and loops; the expanding frame is the whole effect.
  - **Descriptions:** all 12 expertise card descriptions are in place, taken from "expertise short content.png".
  - **Still waiting on:** the full Details text for expertise pages 2–12.

## Update — round 4
- **Hero:** the KPI strip (13+ / 120+ / 10M+) was removed at the client's request. The same numbers still appear on the portal sign-in page.
- **Core Expertise explorer:**
  - The 01/12 counter and the gap above the list are gone.
  - The scroll track is about 40% shorter: 30vh per item instead of 48vh.
  - **Step scrolling:** with a mouse wheel or trackpad, one gesture moves exactly one item, and trackpad inertia is ignored.
  - **Release at the ends:** at item 12 the wheel releases to the next section; at item 1, scrolling up releases to the previous one.
  - Touch, keyboard and screen readers keep native scrolling.

## Update — round 5
- **Core Expertise scrolling:** container scroll replaces the pinned scroll track.
  - **Mouse over the 12 items:** one wheel gesture moves one item. At item 1 going up, or item 12 going down, the page carries on scrolling.
  - **Mouse anywhere else:** normal page scroll; the section just moves up.
  - The zone shows a subtle dashed outline and a "Scroll here" hint, and only engages when the component is at least 60% on screen.
- **Expertise case-study page** (`expertise.html?slug=…`), inspired by Six2Eight project pages. Its chapters, in order:
  - a statement hero with a meta grid
  - an overlapping cover that settles as you scroll
  - an Overview with a sticky label and a large lead paragraph
  - a dark "What we do" chapter with numbered cards
  - a Tools row with logos
  - a Screens gallery
  - the CTA, then "More Expertise" (a Next feature card plus a list)
  - Chapters without content are hidden automatically.
- **Admin panel** (`admin.html`): manages all expertise content and order, using Firebase (Firestore, Auth and Storage) or a browser-only demo mode. See **ADMIN.md**. Security rules are in `firestore.rules` and `storage.rules`.
- **Favicons:** `favicon.ico`, PNGs, the Apple touch icon and `site.webmanifest`, generated from the MCHD IT logo.


## Update — 2026-11-09 (hero behavior revision)

- Removed the desktop scroll-pinned hero transition.
- The showreel now remains in the normal document flow at its fixed responsive width (maximum 1120px).
- Scrolling no longer scales the stage, changes its width, translates it, or zooms the video footage.
- Existing autoplay, pause control, video fallback poster, and responsive layout remain in place.


## Update — 2026-11-13 (hero variants + expertise redesign)

**One codebase, two homepage heroes.** This folder merges `mchd-it-hero-fixed-v1` and `mchd-it-hero-split-v2`. The two folders differed only in the hero layout CSS, so everything else is shared.
- **Version 1 — centered hero:** copy centred, showreel below (from the v1 folder).
- **Version 2 — split hero:** copy left, showreel right on screens ≥961px (from the v2 folder). Its CSS is the "HERO VERSION 2" block at the end of `main.css`, scoped to `[data-hero="split"]`.
- **Switching:** `index.html?hero=1` or `index.html?hero=2`. The choice is remembered for the browser tab, so links back from inner pages keep the same version. Set the public default with `DEFAULT_HERO` in the small script in the `<head>` of `index.html`.

**Homepage.**
- The hero showreel has no drop shadow; it now sits flush in the hero with a faint hairline edge.
- New Technology menu icon (shield + Wi-Fi + circuit nodes) on every page. The source asset and an SVG version are in `assets/img/icons/`.
- Core Expertise no longer switches on scroll. The mouse wheel and trackpad always scroll the page; visitors click or tap an item (or use the arrow keys) to change the panel. The hint now reads "Select an expertise to explore".

**Expertise detail pages (all 12, one template).**
- **Hero:** the homepage hero field (beams, dot grid, particles), with the title on the left, the lead and actions on the right, and a key-facts strip. The strip shows only facts that exist: capabilities, selected projects, screen count, tools and delivered by.
- **Cover:** the real product screen, shown uncropped in a window frame. Click it to open the full-size viewer.
- **Sticky chapter bar** with the current chapter highlighted and a reading-progress line.
- **Chapters:** Overview, What we do (navy), Selected projects (cards), Tools, and Screens. Each one renders only when its content exists.
- **Then:** a CTA, Previous/Next cards with screens, and a grid of all other expertise.
- **Screen viewer:** a native `<dialog>`. Esc closes it, arrow keys move between screens, and focus returns to where you were.
- **Responsive:** desktop, tablet (≤1024px) and mobile (≤760px / ≤480px) layouts.
- **New real content:** EDC, Mapping & Listing and Active Surveillance now carry their full Overview, What we do and Selected projects text, transcribed verbatim from the live-page captures in `video/Inner page`. National Surveys is unchanged.
- **New `projects` field** (`[{ name, text }]`) in `data.js`, `store.js` and the admin panel ("Selected projects", one per line as `Name: description`).
- **Still waiting on** full detail text for the other 8 expertise pages. Those pages show the hero, the product screen or illustration, the CTA and navigation until the text is added.
