// Builds the static pages from content/copy.json (ES + EN) and content/privacy-es.txt.
// Usage: node tools/build.mjs   ->  index.html, en/index.html, privacidad/index.html, en/privacy/index.html, 404.html
import fs from "fs";
const root = new URL("../", import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), "utf8");
const write = (p, s) => { const u = new URL(p, root); fs.mkdirSync(new URL(".", u), { recursive: true }); fs.writeFileSync(u, s); };
const COPY = JSON.parse(read("content/copy.json"));
const MAP = JSON.parse(read("img/islands.json"));
const SITE = "https://controlplus.comebientf.com";
const V = "3";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// photos: p-* = 480/960/1400, s-* = 480/960/1600
const PEST_IMG = ["p-insectos", "p-roedores", "p-desinfeccion", "p-aves", "p-carcoma", "p-certificados"];
const HEALTH_IMG = ["p-appcc", "p-formacion", "p-legionella", "p-appcc", "p-certificados", "p-appcc", "p-certificados"];
const SECTOR_IMG = ["p-formacion", "p-hotel", "s-comunidades", "p-roedores", "s-hogares"];
const POS = { "p-insectos": "82% 50%", "p-carcoma": "38% 40%", "p-desinfeccion": "62% 30%", "p-aves": "40% 50%", "p-certificados": "45% 30%", "p-contacto": "50% 18%", "p-formacion": "60% 40%", "p-appcc": "55% 40%", "p-legionella": "60% 50%" };
const W = n => n.startsWith("p-") ? [480, 960, 1400] : [480, 960, 1600];
const pic = (name, sizes, alt, cls = "", eager = false) => {
  const [a, b, c] = W(name);
  return `<img class="${cls}" src="/img/${name}-${b}.webp?v=${V}" srcset="/img/${name}-${a}.webp?v=${V} ${a}w, /img/${name}-${b}.webp?v=${V} ${b}w, /img/${name}-${c}.webp?v=${V} ${c}w" sizes="${sizes}" alt="${esc(alt)}"${POS[name] ? ` style="object-position:${POS[name]}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
};
// headings: every word in a mask so it can rise into place
const words = s => esc(s).split(" ").map((w, i) => `<span class="w"><span style="--w:${i}">${w}</span></span>`).join(" ");
const WA = (c, topic) => "https://wa.me/" + c.ui.whatsappNumber + "?text=" + encodeURIComponent(c.ui.whatsappMessage + topic);
const G = '<svg class="g" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z"/></svg>';
const waIc = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.3-4.3a8.5 8.5 0 1 1 15.7-4.4z"/><path d="M9 8.5c.2 2.6 3.2 5.8 6.4 6.3l1.1-1.4-1.9-1-.9.8c-1-.4-2.2-1.6-2.7-2.7l.8-.9-1-1.9z" fill="currentColor" stroke="none"/></svg>';
const phIc = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
const arIc = '<svg class="ic ic--ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ckIc = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const stars = '<span class="stars" aria-hidden="true"><span>★★★★★</span><span class="stars__on" style="width:86%">★★★★★</span></span>';
const GMAPS = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Control Plus Canarias, Av. Claudio Delgado Díaz 73, Las Chafiras");

function page(lang) {
  const c = COPY[lang], u = c.ui, other = lang === "es" ? "en" : "es", base = lang === "es" ? "/" : "/en/";
  const privacyHref = lang === "es" ? "/privacidad/" : "/en/privacy/";
  const kick = (k, dark) => `<p class="kick${dark ? " kick--d" : ""}">${esc(u.kick[k])}</p>`;
  // one data list for the detail sheet (pests p0..p5, health h0..h6)
  const items = [
    ...c.pests.cards.map((k, i) => ({ id: "p" + i, name: k.name, text: k.text, img: PEST_IMG[i], tag: c.pests.title })),
    ...c.health.cards.map((k, i) => ({ id: "h" + i, name: k.name, text: k.text, img: HEALTH_IMG[i], tag: c.health.title }))
  ].map(x => ({ ...x, v: V, wa: WA(c, x.name) }));
  const ldjson = [{
    "@context": "https://schema.org", "@type": "LocalBusiness", "@id": SITE + "/#business", name: "Control Plus Canarias", legalName: c.footer.legalName,
    url: SITE + base, telephone: "+34627525517", email: u.emailAddress, foundingDate: "2011", image: SITE + "/img/og.jpg", logo: SITE + "/img/logo-original.webp?v=${V}",
    address: { "@type": "PostalAddress", streetAddress: "Av. Claudio Delgado Díaz, 73, 1.ª planta", postalCode: "38639", addressLocality: "Las Chafiras, San Miguel de Abona", addressRegion: "Santa Cruz de Tenerife", addressCountry: "ES" },
    areaServed: c.coverage.islands, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.3", reviewCount: "51", bestRating: "5" }
  }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.items.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }];
  const islandsSvg = `<svg class="map" viewBox="0 0 ${MAP.w} ${MAP.h}" role="img" aria-label="${esc(c.coverage.title)}: ${esc(c.coverage.islands.join(", "))}">
    <g class="map__routes">${MAP.islands.filter(i => i.name !== "Tenerife").map((i, k) => `<path style="--k:${k}" d="M${MAP.hq.x} ${MAP.hq.y} Q ${((MAP.hq.x + i.x) / 2).toFixed(1)} ${(Math.min(MAP.hq.y, i.y) - 60).toFixed(1)} ${i.x} ${i.y}" pathLength="1"/>`).join("")}</g>
    ${MAP.islands.map((i, k) => `<g class="isle" style="--k:${k}"><path d="${i.d}"/><text x="${i.x}" y="${i.name === "La Graciosa" ? i.y - 18 : i.y + (i.name === "El Hierro" || i.name === "Gran Canaria" ? 44 : -16)}">${esc(i.name)}</text></g>`).join("")}
    <g class="map__hq"><circle class="map__ping" cx="${MAP.hq.x}" cy="${MAP.hq.y}" r="7"/><circle cx="${MAP.hq.x}" cy="${MAP.hq.y}" r="6"/></g></svg>`;
  const AV = [152, 228, 12, 268];
  const review = (r, i, cls) => `<figure class="rv reveal ${cls}" style="--i:${i}"><span class="rv__q" aria-hidden="true">“</span>
      <blockquote><p lang="${r.lang}">${esc(r.text)}</p>${r.lang !== lang && r.translation ? `<p class="rv__tr"><span>${esc(u.reviewTranslationLabel)}</span>${esc(r.translation)}</p>` : ""}</blockquote>
      <figcaption><span class="rv__av" style="--h:${AV[i]}">${esc(r.author[0])}</span><span><strong>${esc(r.author)}</strong><small>${G}${esc(u.reviewSource)}</small></span></figcaption></figure>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.seo.title)}</title>
<meta name="description" content="${esc(c.seo.description)}">
<link rel="canonical" href="${SITE}${base}">
<link rel="alternate" hreflang="es" href="${SITE}/"><link rel="alternate" hreflang="en" href="${SITE}/en/"><link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta name="theme-color" content="#FFFFFF">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(c.seo.title)}"><meta property="og:description" content="${esc(c.seo.description)}"><meta property="og:image" content="${SITE}/img/og.jpg"><meta property="og:locale" content="${lang === "es" ? "es_ES" : "en_GB"}">
<link rel="icon" href="/img/favicon-48.png?v=${V}" type="image/png"><link rel="apple-touch-icon" href="/img/favicon.png?v=${V}">
<link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="/video/hero-m.jpg?v=${V}" media="(max-width: 899px)" fetchpriority="high">
<link rel="preload" as="image" href="/video/hero-d.jpg?v=${V}" media="(min-width: 900px)" fetchpriority="high">
<link rel="stylesheet" href="/assets/site.css?v=${V}">
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify(ldjson)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(u.skipToContent)}</a>
<i class="progress" aria-hidden="true"></i>
<header class="hdr" id="hdr">
  <div class="hdr__in">
    <a class="brand" href="${base}"><img src="/img/logo-hdr.webp?v=${V}" width="287" height="120" alt="${esc(u.brand)}"></a>
    <nav class="hdr__nav" aria-label="Main"><a href="#plagas">${esc(u.nav.pests)}</a><a href="#salud">${esc(u.nav.health)}</a><a href="#proceso">${esc(u.nav.how)}</a><a href="#opiniones">${esc(u.nav.reviews)}</a><a href="#contacto">${esc(u.nav.contact)}</a></nav>
    <div class="hdr__act">
      <div class="lang" role="group" aria-label="Language"><a href="/" ${lang === "es" ? 'aria-current="true"' : ""} hreflang="es" lang="es">ES</a><a href="/en/" ${lang === "en" ? 'aria-current="true"' : ""} hreflang="en" lang="en">EN</a></div>
      <a class="hdr__tel" href="${u.phoneHref}" aria-label="${esc(u.call)} ${esc(u.phoneDisplay)}">${phIc}<span>627 52 55 17</span></a>
    </div>
  </div>
</header>

<main id="main">
<section class="hero" id="top" aria-labelledby="h1">
  <div class="hero__media">
    <picture><source media="(min-width: 900px)" srcset="/video/hero-d.jpg?v=${V}"><img class="hero__poster" src="/video/hero-m.jpg?v=${V}" width="720" height="720" alt="${lang === "es" ? "Técnico de control de plagas tratando el zócalo de una cocina" : "Pest control technician treating a kitchen skirting board"}" fetchpriority="high"></picture>
    <video class="hero__video" muted playsinline loop preload="none" data-src-m="/video/hero-m.mp4?v=${V}" data-src-d="/video/hero-d.mp4?v=${V}" aria-hidden="true"></video>
    <span class="hero__badge"><i></i>${esc(u.heroBadge)}</span>
  </div>
  <div class="wrap hero__body">
    <a class="chip-rating hero__in" style="--d:0" href="#opiniones">${G}<strong>4,3</strong>${stars}<span>${esc(u.reviewsCount)}</span></a>
    <h1 id="h1" class="hero__title">${words(c.hero.headline)}</h1>
    <p class="hero__sub hero__in" style="--d:5">${esc(c.hero.sub)}</p>
    <div class="hero__ctas hero__in" style="--d:6" id="heroCtas">
      <a class="btn btn--wa btn--lg mag" href="${WA(c, u.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.hero.ctaWhatsapp)}</span></a>
      <a class="btn btn--glass btn--lg" href="${u.phoneHref}">${phIc}<span>${esc(c.hero.ctaCall)}</span></a>
    </div>
    <div class="picker hero__in" style="--d:7"><p>${esc(u.picker)}</p><ul role="list">${u.pickerItems.map(([l, id], i) => `<li><a href="#${id}" data-open="${id}" style="--i:${i}">${esc(l)}</a></li>`).join("")}</ul></div>
  </div>
  <a class="hero__scroll" href="#plagas" aria-label="${esc(u.scroll)}"><i></i></a>
</section>

<section class="trust" aria-label="${esc(u.brand)}">
  <ul class="wrap trust__grid">${c.trust.map((t, i) => `<li class="reveal" style="--i:${i}"><strong data-count="${i === 0 ? 2011 : i === 3 ? 8 : ""}">${esc(t.value)}</strong><span>${esc(t.label)}</span></li>`).join("")}</ul>
</section>

<div class="ticker" aria-hidden="true"><div class="ticker__row">${[0, 1].map(() => `<span>${[...c.pests.cards, ...c.health.cards.slice(0, 3)].map(k => esc(k.name)).join('<i></i>')}<i></i></span>`).join("")}</div></div>

<section class="sec" id="plagas" aria-labelledby="t-pests">
  <div class="wrap sec__head reveal">${kick("pests")}<h2 id="t-pests">${words(c.pests.title)}</h2><p class="lead">${esc(c.pests.intro)}</p></div>
  <ul class="wrap svc" role="list">${c.pests.cards.map((k, i) => `
    <li class="svc__card" id="p${i}" style="--i:${i}"><button class="svc__btn spot" type="button" data-open="p${i}" aria-haspopup="dialog">
      <span class="svc__img">${pic(PEST_IMG[i], i === 0 ? "(min-width:1024px) 50vw, 92vw" : i === 5 ? "(min-width:1024px) 100vw, 92vw" : "(min-width:1024px) 25vw, 92vw", k.name)}</span>
      <span class="svc__txt"><span class="svc__name">${esc(k.name)}</span><span class="svc__desc">${esc(k.text)}</span><span class="svc__more">${esc(u.detail)} ${arIc}</span></span></button></li>`).join("")}
  </ul>
</section>

<section class="sec sec--tint" id="salud" aria-labelledby="t-health">
  <div class="wrap">
    <div class="sec__head reveal">${kick("health")}<h2 id="t-health">${words(c.health.title)}</h2><p class="lead">${esc(c.health.intro)}</p></div>
    <ul class="hl" role="list">${c.health.cards.slice(0, 3).map((k, i) => `
      <li class="hl__card reveal" id="h${i}" style="--i:${i}"><button class="spot" type="button" data-open="h${i}" aria-haspopup="dialog">
        <span class="hl__img par">${pic(HEALTH_IMG[i], "(min-width:1024px) 33vw, 92vw", k.name)}</span>
        <span class="hl__txt"><span class="hl__name">${esc(k.name)}</span><span class="hl__desc">${esc(k.text)}</span><span class="svc__more">${esc(u.detail)} ${arIc}</span></span></button></li>`).join("")}
    </ul>
    <div class="more reveal"><p class="more__t">${esc(u.healthMore)}</p><ul role="list">${c.health.cards.slice(3).map((k, i) => `<li id="h${i + 3}"><button type="button" data-open="h${i + 3}" aria-haspopup="dialog">${ckIc}<span>${esc(k.name)}</span>${arIc}</button></li>`).join("")}</ul></div>
  </div>
</section>

<section class="sec" id="proceso" aria-labelledby="t-how">
  <div class="wrap how">
    <div class="how__side">
      <div class="sec__head reveal">${kick("how")}<h2 id="t-how">${words(c.how.title)}</h2></div>
      <figure class="how__van reveal"><img src="/img/van.webp?v=${V}" width="700" height="316" alt="${lang === "es" ? "Furgoneta de Control Plus Canarias" : "Control Plus Canarias van"}" loading="lazy"><figcaption>${esc(u.brand)} · Las Chafiras, Tenerife</figcaption></figure>
    </div>
    <ol class="steps" id="steps"><i class="steps__line" aria-hidden="true"><i></i></i>${c.how.steps.map((s, i) => `
      <li class="step" style="--i:${i}"><span class="step__n">${i + 1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join("")}
    </ol>
  </div>
</section>

<section class="sec sec--tint" id="sectores" aria-labelledby="t-sectors">
  <div class="wrap">
    <div class="sec__head reveal">${kick("sectors")}<h2 id="t-sectors">${words(c.sectors.title)}</h2></div>
    <div class="sectors reveal">
      <div class="tabs" role="tablist" aria-label="${esc(c.sectors.title)}">${c.sectors.items.map((s, i) => `<button role="tab" id="tab-${i}" aria-controls="pan-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(s.name)}</button>`).join("")}<i class="tabs__ind" aria-hidden="true"></i></div>
      <div class="pans">${c.sectors.items.map((s, i) => `<div class="pan" role="tabpanel" id="pan-${i}" aria-labelledby="tab-${i}" ${i ? "hidden" : ""}>
        <figure class="pan__img">${pic(SECTOR_IMG[i], "(min-width:1024px) 60vw, 92vw", s.name)}</figure>
        <div class="pan__txt"><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></div></div>`).join("")}</div>
    </div>
  </div>
</section>

<section class="sec" id="cobertura" aria-labelledby="t-cov">
  <div class="wrap cov">
    <div class="sec__head reveal">${kick("cov")}<h2 id="t-cov">${words(c.coverage.title)}</h2><p class="lead">${esc(c.coverage.text)}</p>
      <ul class="cov__list" role="list">${c.coverage.islands.map((n, i) => `<li style="--i:${i}">${esc(n)}</li>`).join("")}</ul></div>
    <div class="cov__map">${islandsSvg}</div>
  </div>
</section>

<section class="sec sec--tint" id="opiniones" aria-labelledby="t-rev">
  <div class="wrap">
    <div class="sec__head reveal">${kick("reviews")}<h2 id="t-rev">${words(c.reviews.title)}</h2></div>
    <div class="rvg">
      <aside class="score reveal"><p class="score__g">${G}<span>Google</span></p><p class="score__n">4,3<small>/5</small></p>${stars}<p class="score__t">${esc(c.reviews.rating)}</p>
        <p class="score__faces" aria-hidden="true">${c.reviews.items.map((r, i) => `<span class="rv__av" style="--h:${AV[i]}">${esc(r.author[0])}</span>`).join("")}</p>
        <a class="btn btn--white" href="${GMAPS}" target="_blank" rel="noopener">${esc(u.reviewsAll)} ${arIc}</a></aside>
      ${review(c.reviews.items[2], 2, "rv--big")}${review(c.reviews.items[0], 0, "")}${review(c.reviews.items[1], 1, "")}${review(c.reviews.items[3], 3, "rv--wide")}
    </div>
  </div>
</section>

<section class="sec" id="faq" aria-labelledby="t-faq">
  <div class="wrap faqw">
    <div class="faqw__side">
      <div class="sec__head reveal">${kick("faq")}<h2 id="t-faq">${words(c.faq.title)}</h2></div>
      <div class="ask reveal"><p class="ask__t">${esc(u.faqSideTitle)}</p><p>${esc(u.faqSideText)}</p><a class="link" href="${WA(c, u.brand)}" target="_blank" rel="noopener">${esc(u.faqSideLink)} ${arIc}</a></div>
    </div>
    <div class="faq">${c.faq.items.map((f, i) => `<details class="faq__item reveal" style="--i:${i}"><summary>${esc(f.q)}<i class="plus" aria-hidden="true"></i></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join("")}</div>
  </div>
</section>

<section class="sec" id="contacto" aria-labelledby="t-contact">
  <div class="wrap">
    <div class="cta reveal">
      <div class="cta__img">${pic("p-contacto", "(min-width:1024px) 40vw, 92vw", lang === "es" ? "Técnico de control de plagas sonriendo junto a su furgoneta" : "Smiling pest control technician next to his van")}</div>
      <div class="cta__body">
        ${kick("contact", true)}<h2 id="t-contact">${words(c.contact.title)}</h2>
        <p class="lead">${esc(c.contact.text)}</p>
        <a class="btn btn--wa btn--xl mag" href="${WA(c, u.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.hero.ctaWhatsapp)}</span></a>
        <dl class="cta__list">
          <div><dt>${esc(c.contact.labels.phone)}</dt><dd><a href="${u.phoneHref}">${esc(u.phoneDisplay)}</a></dd></div>
          <div><dt>${esc(c.contact.labels.email)}</dt><dd><a href="mailto:${u.emailAddress}">${esc(u.emailAddress)}</a></dd></div>
          <div><dt>${esc(c.contact.labels.address)}</dt><dd><a href="${GMAPS}" target="_blank" rel="noopener">${esc(c.contact.address)}</a></dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>
</main>

<footer class="ftr">
  <div class="wrap ftr__in">
    <img class="ftr__logo" src="/img/logo-original.webp?v=${V}" width="600" height="251" alt="Control Plus Canarias" loading="lazy">
    <nav class="ftr__nav" aria-label="Footer"><a href="#plagas">${esc(u.nav.pests)}</a><a href="#salud">${esc(u.nav.health)}</a><a href="#faq">${esc(u.nav.faq)}</a><a href="#contacto">${esc(u.nav.contact)}</a></nav>
    <p>${esc(c.footer.legalName)} · ${esc(c.footer.cif)}<br>${esc(c.footer.address)}</p>
    <p><a href="${privacyHref}">${esc(c.footer.privacy)}</a> · <a href="/${other === "es" ? "" : "en/"}" hreflang="${other}" lang="${other}">${esc(u.languages[other])}</a></p>
    <p class="ftr__small">© ${new Date().getFullYear()} ${esc(c.footer.legalName)}. ${esc(c.footer.rights)}.</p>
  </div>
</footer>

<a class="totop" id="toTop" href="#top" aria-label="${esc(u.toTop)}"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="totop__track" cx="24" cy="24" r="22"/><circle class="totop__ring" cx="24" cy="24" r="22" pathLength="1"/><path class="totop__ar" d="M24 31V17M18 23l6-6 6 6"/></svg></a>
<a class="wa-float" id="waFloat" href="${WA(c, u.brand)}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIc}<span>${esc(u.waFloat)}</span></a>
<nav class="bar" id="bar" aria-label="${esc(u.nav.contact)}">
  <a class="btn btn--wa" href="${WA(c, u.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(u.whatsapp)}</span></a>
  <a class="btn btn--line" href="${u.phoneHref}">${phIc}<span>${esc(u.call)}</span></a>
</nav>

<dialog class="sheet" id="sheet" aria-labelledby="sheetT">
  <div class="sheet__in">
    <button class="sheet__x" type="button" data-close aria-label="${esc(u.close)}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    <figure class="sheet__img"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" sizes="(min-width:760px) 640px, 100vw"></figure>
    <div class="sheet__body"><p class="kick" id="sheetK"></p><h2 id="sheetT"></h2><p id="sheetP"></p>
      <div class="sheet__ctas"><a class="btn btn--wa btn--lg" id="sheetWa" href="${WA(c, u.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(u.askWa)}</span></a><a class="btn btn--line btn--lg" href="${u.phoneHref}">${phIc}<span>${esc(u.call)}</span></a></div></div>
  </div>
</dialog>
<script type="application/json" id="svcData">${JSON.stringify(items).replace(/</g, "\\u003c")}</script>
<script src="/assets/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

function privacy(lang) {
  const c = COPY[lang], txt = read("content/privacy-es.txt").trim().split(/\n+/);
  const body = txt.map(l => /^[¿A-ZÁÉÍÓÚÑ ?]{8,}$/.test(l) || /^¿.*\?$/.test(l) ? `<h2>${esc(l)}</h2>` : `<p>${esc(l)}</p>`).join("\n");
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.footer.privacy)} · Control Plus Canarias</title><meta name="robots" content="noindex"><link rel="icon" href="/img/favicon-48.png?v=${V}" type="image/png"><link rel="stylesheet" href="/assets/site.css?v=${V}"></head>
<body class="legal"><header class="legal__hdr wrap"><a class="brand" href="${lang === "es" ? "/" : "/en/"}"><img src="/img/logo-hdr.webp?v=${V}" width="287" height="120" alt="Control Plus Canarias"></a></header>
<main class="wrap legal__body">${lang === "en" ? '<p class="legal__note">This privacy policy is published in Spanish, the legally binding version.</p>' : ""}<h1>${esc(txt[0])}</h1>${body.split("\n").slice(1).join("\n")}</main></body></html>`;
}

write("index.html", page("es"));
write("en/index.html", page("en"));
write("privacidad/index.html", privacy("es"));
write("en/privacy/index.html", privacy("en"));
write("404.html", page("es").replace("<title>", '<meta name="robots" content="noindex"><title>404 · '));
console.log("built: /, /en/, /privacidad/, /en/privacy/, /404.html");
