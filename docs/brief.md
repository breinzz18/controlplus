# Control Plus Canarias: art direction brief

## 1. Concept: "Señal Verde" (Green Signal)
The site reads like a calm inspection instrument: lab-white surfaces, indigo ink, hairline graticules, and the brand green used only as the "all clear" status light (a passed check, a clean result, an open WhatsApp line). Futuristic means measured, certified and quiet: macro imagery, monospaced data, one scan-line motif carried from hero to map, never neon or sci-fi. [impeccable mode-persuade: offer + action in the first viewport; design-taste 0.A: audience picks the aesthetic]

Design read: a trust-first local-service landing for owners deciding on a phone; light lab theme, scientific-precision language, vanilla HTML/CSS + small JS.

## 2. Colour tokens
| Token | Hex | Role / contrast |
|---|---|---|
| `--paper` | #F4F7F6 | Page canvas (cool lab white, faint green tint) |
| `--surface` | #FFFFFF | Raised panels, cards |
| `--ink` | #0E1430 | Text, headings. 16.8:1 on paper |
| `--ink-2` | #4A5170 | Secondary text. 7.2:1 on paper |
| `--line` | #DCE2E0 | Hairlines, graticule (decorative only) |
| `--indigo` | #384898 | Brand indigo: links, icons, focus ring. 7.6:1 on paper, white on it 8.2:1 |
| `--indigo-deep` | #0B1026 | Hero scrim base, contact block, footer |
| `--indigo-mist` | #B9C3F0 | Secondary text on deep indigo. 10.9:1 |
| `--signal` | #0BC91E | Brand green. FILLS ONLY: WhatsApp button, status dots, scan line. Never text on light (2.2:1 fails). Ink text on signal = 8.1:1 |
| `--signal-ink` | #067A14 | Green when it must be text/icon on light. 5.1:1 on paper |
| `--signal-glow` | rgba(11,201,30,.18) | Focus halo, scan-line bloom (max 1 per viewport) |
| `--danger` | #B42318 | Form errors only |

Rules: one accent (green) locked across the page [design-taste 4.2]; WhatsApp CTA = `--signal` bg + `--ink` label (never white on green); shadows tinted indigo `0 12px 32px -12px rgba(14,20,48,.18)`. Theme: light page; hero sits on media under an indigo scrim; contact + footer is the one deliberate colour-block close in `--indigo-deep` [design-taste 4.11]. No dark-mode toggle; respect `color-scheme: light`.

## 3. Type (Google Fonts, latin + latin-ext subsets, ñ/á/ü verified)
- Display: **Archivo** variable, `wdth 112`, wght 600–650 (engineered, slightly expanded, precise).
- Text: **Geist** 400/500/600.
- Data: **Geist Mono** 500 for numerals, service codes (PC-01, SP-01), coordinates. `tabular-nums`.
- Scale (fluid): hero `clamp(2.4rem, 1.5rem+4vw, 4.5rem)` lh 1.02, tracking -0.025em · h2 `clamp(1.9rem, 1.3rem+2.4vw, 3.1rem)` lh 1.06 · h3 `clamp(1.15rem, 1.05rem+.5vw, 1.4rem)` lh 1.2 · body-l 1.125rem/1.6 · body 1rem/1.6 (floor) · small .875rem · mono label .75rem/1.3, +0.04em.
- `text-wrap: balance` on headings, `pretty` on paragraphs, 62ch measure, hero headline max 2 lines desktop / 4 mobile. Preload only Archivo + Geist 400; `font-display: swap` with metric-matched fallback. [impeccable typeset; redesign-existing typography]

## 4. Layout, section by section (mobile first)
Grid: 4 cols mobile (16px gutters, 20px side margin), 12 cols ≥1024 (max 1240px). Spacing base 4px; section padding 72px mobile / 128px desktop, bottom slightly larger. Radius rule: buttons full pill, cards 16px, inner media 12px, inputs 10px. Max one eyebrow per 3 sections.

**Header** 60px, fixed, transparent over hero then `--paper` at 88% + backdrop-blur + hairline. Logo (existing raster box, 34px tall) · ES|EN segmented mono toggle · call icon button. Desktop adds WhatsApp pill.
**Mobile action dock** (signature): bottom bar with WhatsApp (green, 60%) + Llamar (indigo outline), `env(safe-area-inset-bottom)`, appears once hero CTAs leave view. [mobile-native 7]

1. **Hero**: full-bleed loop (L1/L2) under a bottom-up indigo scrim; content bottom-aligned for thumb reach on mobile, left-aligned desktop. Headline + ≤20-word subtext + WhatsApp (primary) + Llamar (secondary). Nothing else [design-taste 4.7]. A 1px green scan line rests at the bottom edge of the media.
2. **Trust bar**: 4 data cells on `--surface`, 2×2 mobile, 1×4 desktop: `2011` desde · `4,3★` 51 reseñas Google · `ROESB` inscrita · `8` islas. Mono numerals, hairline dividers, no cards.
3. **Control de plagas (6)**: mobile horizontal scroll-snap rail of tall specimen cards (code PC-01…, line icon, title, one line); desktop asymmetric bento (1 large cell with I2/L3 media + 5). Tap opens inline detail (grid-rows 0fr→1fr) with "Consultar por WhatsApp" pre-filled with that service name.
4. **Salud pública y seguridad alimentaria (7)**: different family: indexed protocol list. Desktop: sticky media column left (I3, swapping to I4 on Legionella row) + right rows SP-01…07 with hairlines. Mobile: rows as disclosures with media strip on top. Each row ends with its own pre-filled WhatsApp link.
5. **Cómo trabajamos (4)**: vertical line timeline on mobile, horizontal on desktop; the line draws as you scroll, each node turns green when passed. Real van photo (fugoneta.png, background removed, ≤40KB WebP) sits at step 2 "visita técnica".
6. **Sectores** (proposed upgrade): "¿Para quién es?" segmented selector (Hostelería · Comunidades · Empresas · Hogares) over the 4 sector images; selecting swaps image + 3 recommended services + a pre-filled WhatsApp CTA. Desktop: 4 tiles visible, hover lifts caption.
7. **Cobertura**: golden-hour landscape (I9/L4) as a 21:9 band with an SVG line map of all 8 islands on top (Natural Earth-accurate outlines, La Graciosa included). Tenerife HQ pulse; route lines to 7 islands. Tap island shows name.
8. **Reseñas**: big `4,3 / 5 · 51 reseñas en Google` with real star glyphs, then a snap rail (mobile) / 3-col masonry (desktop) of 6 real Google quotes, max 3 lines, attribution "Nombre · Reseña de Google", link "Ver todas en Google". No invented reviews, no hiding the score.
9. **FAQ**: native `<details>` list (justified: best mobile pattern, accessible, crawlable, FAQ schema). Desktop: 2 columns.
10. **Contacto + footer** in `--indigo-deep`: giant WhatsApp button, then call, email, address (opens Google Maps link; static map image, no iframe). No hours line until confirmed. Footer: legal links, CIF, privacy, "© 2011–2026".
**Privacidad page**: read mode, 68ch, sticky in-page index on desktop, same header/footer, no media.

Proposed structural changes (for copywriter): (a) sectors become the selector above; (b) ROESB shown without number until client supplies it; (c) no hours anywhere; (d) EN as `/en/` static page with hreflang rather than JS text swap (SEO + no flash); (e) every service has a pre-filled WhatsApp message string (need ES + EN copy).

## 5. Motion system
Easings: `--ease-out: cubic-bezier(0.16,1,0.3,1)` (arrivals) · `--ease-ui: cubic-bezier(0.23,1,0.32,1)` (controls) · `--ease-move: cubic-bezier(0.77,0,0.175,1)` (on-screen moves) · `--ease-drawer: cubic-bezier(0.32,0.72,0,1)` (dock/sheets). Durations: press 120ms (`scale(.97)`), hover 180ms, state 240ms, reveal 560ms, focal 900ms; exits ~70% of entry. Transform/opacity/clip-path only; IntersectionObserver, no scroll listeners; content visible without JS. [emil-design-eng; impeccable animate; high-end 6]

Signature moments:
1. **Hero calibration**: once on load, a green scan line sweeps the hero (900ms) while headline lines unmask via clip-path, 60ms stagger.
2. **Counters tick**: trust numerals count to real values once (600ms, tabular).
3. **Specimen draw**: service icons stroke-draw (480ms) when the rail enters; tapped card expands with `--ease-drawer`.
4. **Protocol swap** (desktop): sticky media crossfades with 2px blur as rows activate.
5. **Process line**: timeline path drawn by `animation-timeline: view()` with IO fallback; nodes flip to green.
6. **Sector selector**: indicator slides (transform), image + list crossfade 220ms.
7. **Map routes**: routes draw from Tenerife, 60ms stagger; HQ ring pulses 2.4s, paused offscreen.
8. **Dock arrival**: slides up 320ms drawer ease.
Hover effects gated by `(hover:hover) and (pointer:fine)`. Videos: muted, playsinline, loop, lazy, paused offscreen; skipped on `saveData` / 2G (poster only). **Reduced motion**: no sweeps, draws, pulses or video autoplay (posters shown), counters show final values, dock and reveals use 150ms opacity only; press feedback stays.

## 6. Magnific assets (10 images ≈1000 cr + 5 loops ≈700 cr)
**Shared style line** (append to every prompt): *"clinical macro photography, cool daylight studio light with soft lab-white falloff, deep indigo shadows, a single restrained emerald-green accent light, immaculate surfaces, shallow depth of field, crisp micro detail, matte finish, medium-format editorial, calm and precise, no people, no hands, no text, no letters, no logos, no labels, no signage, no screens, no certificates"*

| ID | Ratio | Use | Prompt (+ style line) |
|---|---|---|---|
| I1 | 16:9 | Hero poster desktop, LCP | Low-angle macro across a seamless brushed stainless-steel professional kitchen counter receding into soft darkness, fine condensation beads, a razor-thin emerald laser line skimming horizontally across the surface like an inspection scan, negative space on the left third |
| I2 | 9:16 | Hero poster mobile | Same scene recomposed vertically: stainless counter edge in lower third, laser line low, tall empty indigo-shadowed space above for headline |
| I3 | 4:5 | Pest bento feature | Single German cockroach specimen top-down on a frosted glass light table, backlit so the body turns translucent amber, faint hairline measurement graticule etched in the glass, museum entomology documentation |
| I4 | 4:5 | Salud pública sticky media | Row of clear glass sample vials and an empty petri dish on a stainless lab bench, cool window light, one vial catching an emerald rim light |
| I5 | 1:1 | Legionella row | Macro of crystal-clear water flowing from a polished chrome valve, frozen droplets, cool blue-white light, sterile stainless backdrop |
| I6 | 4:5 | Sector: Hostelería | Empty professional hotel kitchen at dawn, stainless worktops and extraction hoods, perfectly clean, long cool light, slight haze |
| I7 | 4:5 | Sector: Comunidades | White Canarian residential building with wooden balconies and a palm courtyard, empty, early golden light, clean architectural photography |
| I8 | 4:5 | Sector: Empresas | Empty clean logistics warehouse aisle with sealed pallets, polished concrete floor, cool overhead light, symmetrical |
| I9 | 4:5 | Sector: Hogares | Bright minimal living room with a volcanic stone wall and white linen, morning sun across a spotless floor, Canary Islands house |
| I10 | 21:9 | Cobertura band | Aerial golden-hour view over a sea of clouds with Teide volcano and distant islands (La Gomera, La Palma) on the horizon, Atlantic haze, calm |

Loops (image-to-video from the stills, 5s, seamless, slow, locked camera unless stated): **L1** from I1 (16:9) laser line glides across counter, condensation glints · **L2** from I2 (9:16) same motion vertical · **L3** from I3 (4:5) a soft light band passes under the glass, revealing translucent structure · **L4** from I10 (21:9→16:9 export) clouds drift slowly, light warms · **L5** from I4 (4:5) emerald rim light slowly travels along the vials. Exports: MP4 H.264 + WebM, 720p mobile ≤900KB, 1080p desktop ≤1.8MB; posters AVIF/WebP ≤70KB. Reject any output with text, logos, people, creepy insect swarms, or neon.

## 7. Banned
Neon glows, HUD/cyberpunk frames, glitch, gradients purple-to-blue, dark-mode gaming aesthetic · green text on white · stock technicians or AI "team" photos, fake certificates, fake client logos, invented counters ("1.000 clientes"), invented reviews or response times · three equal card columns, centered hero over card row, eyebrows on every section, split-header filler · Inter/Roboto/Montserrat/serif display · carousels with dots, autoplay sliders, cookie banner covering half the screen (use a slim bottom bar) · scroll-jacking, parallax on mobile, blur on scrolling content, AOS-style blank-until-JS sections · em dashes and "Elevate/Seamless/Next-gen" copy · Google Maps iframe on load.

## 8. QA checklist
1. Hero headline, subtext and both CTAs visible on a 375×667 viewport without scrolling.
2. Every text pair passes WCAG AA (check ink on signal, mist on deep indigo, text over hero scrim).
3. `--signal` never used as text on light surfaces.
4. WhatsApp links open `wa.me/34627525517` with service-specific pre-filled ES/EN text.
5. Mobile dock respects safe areas, never covers the footer legal links or form fields.
6. Mobile LCP < 2.5s on 4G throttle; first load ≤ 700KB; videos lazy and paused offscreen.
7. `prefers-reduced-motion` removes sweeps, draws, pulses and autoplay; page still complete.
8. All numbers and claims trace to facts.md (2011, 4,3/51, ROESB, 8 islas); nothing invented.
9. ES and EN pages have matching structure, `lang`, hreflang, and no untranslated strings.
10. Touch targets ≥ 44px; hover styles gated; tap highlight removed with visible `:active`.
11. No generated image contains text, people, logos or artifacts; all 10 share one light/colour grade.
12. Semantic HTML: one h1, LocalBusiness + FAQ schema, alt text, skip link, visible indigo focus ring.
