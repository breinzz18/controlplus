// Builds the static pages from content/copy.json (ES + EN) and content/privacy-es.txt.
// Usage: node tools/build.mjs   ->  index.html, en/index.html, privacidad/index.html, en/privacy/index.html, 404.html
import fs from "fs";
const root = new URL("../", import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), "utf8");
const write = (p, s) => { const u = new URL(p, root); fs.mkdirSync(new URL(".", u), { recursive: true }); fs.writeFileSync(u, s); };
const COPY = JSON.parse(read("content/copy.json"));
const MAP = JSON.parse(read("img/islands.json"));
const SITE = "https://controlplus.comebientf.com";
const V = "1";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// line icons (24px, stroke) — pests then health, same order as copy.json cards
const IC = {
  bug: '<path d="M8 8a4 4 0 0 1 8 0"/><rect x="7" y="8" width="10" height="11" rx="5"/><path d="M12 8v11M4 12h3M17 12h3M4.5 17.5 7 16M19.5 17.5 17 16M5 7l2.5 2M19 7l-2.5 2"/>',
  rat: '<path d="M3 15c0-4 3.5-7 8-7 3 0 5.5 1.5 6.5 4l2.5.5-1 2.5H17"/><circle cx="7" cy="7.5" r="2"/><path d="M14 15c0 2-1 3.5-3 3.5H6M21 18c-2 0-3-1-3-3"/><circle cx="16" cy="12" r=".6" fill="currentColor"/>',
  spray: '<path d="M9 9h6v12H9zM10 9V6h4v3M14 6h3l2-2M17 9.5l2.5-1M17 12h3M17 14.5l2.5 1"/>',
  bird: '<path d="M3 12c3 0 5-2 6-5 1 3 3 5 6 5l6-1-3 3c-1 3-4 5-8 5-3 0-5-1.5-6-4z"/><path d="M15 9.5h.01"/>',
  wood: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10.5c1.5 0 3 .5 4.5 1.5M13 13.5c1.5 0 3-.5 4.5-1.5M6 7V5M18 19v-2"/>',
  cert: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13l2 2 4-4"/>',
  clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11l2 2 4-4M9 17h6"/>',
  school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
  drop: '<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  leaf: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  alert: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  stamp: '<path d="M9 13V9a3 3 0 1 1 6 0v4"/><path d="M5 13h14v4H5zM7 20h10"/>'
};
const PEST_IC = ["bug", "rat", "spray", "bird", "wood", "cert"];
const HEALTH_IC = ["clip", "school", "drop", "leaf", "alert", "chat", "stamp"];
const icon = k => '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + IC[k] + "</svg>";
const SECTOR_IMG = ["s-hosteleria", "water", "s-comunidades", "s-empresas", "s-hogares"];
const pic = (name, sizes, alt, cls = "", eager = false) =>
  `<img class="${cls}" src="/img/${name}-960.webp" srcset="/img/${name}-480.webp 480w, /img/${name}-960.webp 960w, /img/${name}-1600.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const vid = (name, cls = "") => `<video class="${cls}" muted playsinline loop preload="none" poster="/video/${name}.jpg" data-src="/video/${name}.mp4" aria-hidden="true"></video>`;
const WA = (c, topic) => "https://wa.me/" + c.ui.whatsappNumber + "?text=" + encodeURIComponent(c.ui.whatsappMessage + topic);

function page(lang) {
  const c = COPY[lang], other = lang === "es" ? "en" : "es", base = lang === "es" ? "/" : "/en/";
  const privacyHref = lang === "es" ? "/privacidad/" : "/en/privacy/";
  const waIc = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.3-4.3a8.5 8.5 0 1 1 15.7-4.4z"/><path d="M9 8.5c.2 2.6 3.2 5.8 6.4 6.3l1.1-1.4-1.9-1-.9.8c-1-.4-2.2-1.6-2.7-2.7l.8-.9-1-1.9z" fill="currentColor" stroke="none"/></svg>';
  const phIc = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
  const ldjson = [{
    "@context": "https://schema.org", "@type": "LocalBusiness", "@id": SITE + "/#business", name: "Control Plus Canarias", legalName: c.footer.legalName,
    url: SITE + base, telephone: "+34627525517", email: c.ui.emailAddress, foundingDate: "2011", image: SITE + "/img/hero-desk-1600.webp",
    address: { "@type": "PostalAddress", streetAddress: "Av. Claudio Delgado Díaz, 73, 1.ª planta", postalCode: "38639", addressLocality: "Las Chafiras, San Miguel de Abona", addressRegion: "Santa Cruz de Tenerife", addressCountry: "ES" },
    areaServed: c.coverage.islands, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.3", reviewCount: "51", bestRating: "5" }
  }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.items.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }];
  const islandsSvg = `<svg class="map" viewBox="0 0 ${MAP.w} ${MAP.h}" role="img" aria-label="${esc(c.coverage.title)}: ${esc(c.coverage.islands.join(", "))}">
    <g class="map__routes">${MAP.islands.filter(i => i.name !== "Tenerife").map((i, k) => `<path style="--k:${k}" d="M${MAP.hq.x} ${MAP.hq.y} Q ${((MAP.hq.x + i.x) / 2).toFixed(1)} ${(Math.min(MAP.hq.y, i.y) - 60).toFixed(1)} ${i.x} ${i.y}" pathLength="1"/>`).join("")}</g>
    ${MAP.islands.map(i => `<g class="isle"><path d="${i.d}"/><text x="${i.x}" y="${i.name === "La Graciosa" ? i.y - 18 : i.y + (i.name === "El Hierro" || i.name === "Gran Canaria" ? 44 : -16)}">${esc(i.name)}</text></g>`).join("")}
    <g class="map__hq"><circle class="map__ping" cx="${MAP.hq.x}" cy="${MAP.hq.y}" r="7"/><circle cx="${MAP.hq.x}" cy="${MAP.hq.y}" r="6"/></g></svg>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.seo.title)}</title>
<meta name="description" content="${esc(c.seo.description)}">
<link rel="canonical" href="${SITE}${base}">
<link rel="alternate" hreflang="es" href="${SITE}/"><link rel="alternate" hreflang="en" href="${SITE}/en/"><link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta name="theme-color" content="#0B1026">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(c.seo.title)}"><meta property="og:description" content="${esc(c.seo.description)}"><meta property="og:image" content="${SITE}/img/hero-desk-1600.webp"><meta property="og:locale" content="${lang === "es" ? "es_ES" : "en_GB"}">
<link rel="icon" href="/img/emblem.png" type="image/png"><link rel="apple-touch-icon" href="/img/emblem.png">
<link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="/video/hero-mob.jpg" media="(max-aspect-ratio: 1/1)" fetchpriority="high">
<link rel="preload" as="image" href="/video/hero-desk.jpg" media="(min-aspect-ratio: 1/1)" fetchpriority="high">
<link rel="stylesheet" href="/assets/site.css?v=${V}">
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify(ldjson)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(c.ui.skipToContent)}</a>
<header class="hdr" id="hdr">
  <div class="hdr__in">
    <a class="brand" href="${base}" aria-label="${esc(c.ui.brand)}"><span class="emblem" aria-hidden="true"></span><span class="brand__name">Control Plus<small>Canarias</small></span></a>
    <nav class="hdr__nav" aria-label="Main"><a href="#plagas">${esc(c.ui.nav.pests)}</a><a href="#salud">${esc(c.ui.nav.health)}</a><a href="#proceso">${esc(c.ui.nav.how)}</a><a href="#faq">${esc(c.ui.nav.faq)}</a><a href="#contacto">${esc(c.ui.nav.contact)}</a></nav>
    <div class="hdr__act">
      <div class="lang" role="group" aria-label="Language"><a href="/" ${lang === "es" ? 'aria-current="true"' : ""} hreflang="es" lang="es">ES</a><a href="/en/" ${lang === "en" ? 'aria-current="true"' : ""} hreflang="en" lang="en">EN</a></div>
      <a class="btn btn--wa btn--sm hide-m" href="${WA(c, c.ui.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.ui.whatsapp)}</span></a>
      <a class="iconbtn" href="${c.ui.phoneHref}" aria-label="${esc(c.ui.call)} ${esc(c.ui.phoneDisplay)}">${phIc}</a>
    </div>
  </div>
</header>

<main id="main">
<section class="hero" id="top" aria-labelledby="h1">
  <div class="hero__media">
    <picture><source media="(max-aspect-ratio: 1/1)" srcset="/video/hero-mob.jpg"><img class="hero__poster" src="/video/hero-desk.jpg" alt="" fetchpriority="high"></picture>
    <video class="hero__video" muted playsinline loop preload="none" data-src-m="/video/hero-mob.mp4" data-src-d="/video/hero-desk.mp4" aria-hidden="true"></video>
  </div>
  <i class="scan" aria-hidden="true"></i>
  <div class="wrap hero__body">
    <h1 id="h1" class="hero__title">${esc(c.hero.headline)}</h1>
    <p class="hero__sub">${esc(c.hero.sub)}</p>
    <div class="hero__ctas" id="heroCtas">
      <a class="btn btn--wa" href="${WA(c, c.ui.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.hero.ctaWhatsapp)}</span></a>
      <a class="btn btn--ghost" href="${c.ui.phoneHref}">${phIc}<span>${esc(c.hero.ctaCall)}</span></a>
    </div>
  </div>
</section>

<section class="trust" aria-label="${esc(c.ui.brand)}">
  <ul class="wrap trust__grid">${c.trust.map((t, i) => `<li><strong class="mono" data-count="${i === 0 ? 2011 : i === 3 ? 8 : ""}">${esc(t.value)}</strong><span>${esc(t.label)}</span></li>`).join("")}</ul>
</section>

<section class="sec" id="plagas" aria-labelledby="t-pests">
  <div class="wrap sec__head reveal"><h2 id="t-pests">${esc(c.pests.title)}</h2><p class="lead">${esc(c.pests.intro)}</p></div>
  <div class="pests">
    <figure class="pests__media reveal">${vid("pest")}<figcaption class="mono">PC · ${c.pests.cards.length} ${lang === "es" ? "servicios" : "services"}</figcaption></figure>
    <ul class="cards" role="list">${c.pests.cards.map((k, i) => `
      <li class="card reveal" style="--i:${i}"><span class="mono code">PC-0${i + 1}</span>${icon(PEST_IC[i])}<h3>${esc(k.name)}</h3><p>${esc(k.text)}</p>
        <a class="card__cta" href="${WA(c, k.name)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.ui.sendWhatsapp)}</span></a></li>`).join("")}
    </ul>
  </div>
</section>

<section class="sec sec--alt" id="salud" aria-labelledby="t-health">
  <div class="wrap health">
    <div class="health__side">
      <div class="sec__head reveal"><h2 id="t-health">${esc(c.health.title)}</h2><p class="lead">${esc(c.health.intro)}</p></div>
      <figure class="health__media">${vid("lab", "health__lab")}${pic("water", "(min-width:1024px) 40vw, 92vw", "", "health__water")}</figure>
    </div>
    <div class="acc" role="list">${c.health.cards.map((k, i) => `
      <details class="acc__item reveal" style="--i:${i}" role="listitem" ${i === 2 ? 'data-water' : ""}><summary><span class="mono code">SP-0${i + 1}</span>${icon(HEALTH_IC[i])}<h3>${esc(k.name)}</h3><i class="acc__plus" aria-hidden="true"></i></summary>
        <div class="acc__body"><p>${esc(k.text)}</p><a class="card__cta" href="${WA(c, k.name)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.ui.sendWhatsapp)}</span></a></div></details>`).join("")}
    </div>
  </div>
</section>

<section class="sec" id="proceso" aria-labelledby="t-how">
  <div class="wrap">
    <div class="sec__head reveal"><h2 id="t-how">${esc(c.how.title)}</h2></div>
    <ol class="steps" id="steps"><i class="steps__line" aria-hidden="true"><i></i></i>${c.how.steps.map((s, i) => `
      <li class="step reveal" style="--i:${i}"><span class="step__dot mono">0${i + 1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${i === 1 ? `<img class="step__van" src="/img/van.webp" width="700" height="316" alt="${lang === "es" ? "Furgoneta de Control Plus Canarias" : "Control Plus Canarias van"}" loading="lazy">` : ""}</div></li>`).join("")}
    </ol>
  </div>
</section>

<section class="sec sec--alt" id="sectores" aria-labelledby="t-sectors">
  <div class="wrap">
    <div class="sec__head reveal"><h2 id="t-sectors">${esc(c.sectors.title)}</h2></div>
    <div class="sectors">
      <div class="tabs" role="tablist" aria-label="${esc(c.sectors.title)}">${c.sectors.items.map((s, i) => `<button role="tab" id="tab-${i}" aria-controls="pan-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(s.name)}</button>`).join("")}<i class="tabs__ind" aria-hidden="true"></i></div>
      ${c.sectors.items.map((s, i) => `<div class="pan" role="tabpanel" id="pan-${i}" aria-labelledby="tab-${i}" ${i ? "hidden" : ""}>
        <figure class="pan__img">${pic(SECTOR_IMG[i], "(min-width:1024px) 50vw, 92vw", "")}</figure>
        <div class="pan__txt"><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p><a class="btn btn--wa" href="${WA(c, s.name)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.ui.sendWhatsapp)}</span></a></div></div>`).join("")}
    </div>
  </div>
</section>

<section class="coverage" id="cobertura" aria-labelledby="t-cov">
  <div class="coverage__media">${vid("coverage")}</div>
  <div class="wrap coverage__body">
    <div class="sec__head reveal"><h2 id="t-cov">${esc(c.coverage.title)}</h2><p class="lead">${esc(c.coverage.text)}</p></div>
    ${islandsSvg}
  </div>
</section>

<section class="sec" id="opiniones" aria-labelledby="t-rev">
  <div class="wrap">
    <div class="sec__head reveal"><h2 id="t-rev">${esc(c.reviews.title)}</h2><p class="rating"><span class="mono rating__n">4,3</span><span class="stars" aria-hidden="true">★★★★<span>★</span></span><span>${esc(c.reviews.rating)}</span></p></div>
    <ul class="reviews" role="list">${c.reviews.items.map((r, i) => `
      <li class="review reveal" style="--i:${i}"><blockquote><p lang="${r.lang}">“${esc(r.text)}”</p>${r.lang !== lang && r.translation ? `<p class="review__tr"><span class="mono">${esc(c.ui.reviewTranslationLabel)}</span> ${esc(r.translation)}</p>` : ""}</blockquote><cite>${esc(r.author)} · ${esc(c.ui.reviewSource)}</cite></li>`).join("")}
    </ul>
  </div>
</section>

<section class="sec sec--alt" id="faq" aria-labelledby="t-faq">
  <div class="wrap">
    <div class="sec__head reveal"><h2 id="t-faq">${esc(c.faq.title)}</h2></div>
    <div class="faq">${c.faq.items.map(f => `<details class="faq__item"><summary>${esc(f.q)}<i class="acc__plus" aria-hidden="true"></i></summary><p>${esc(f.a)}</p></details>`).join("")}</div>
  </div>
</section>

<section class="contact" id="contacto" aria-labelledby="t-contact">
  <div class="wrap contact__in">
    <h2 id="t-contact">${esc(c.contact.title)}</h2>
    <p class="lead">${esc(c.contact.text)}</p>
    <a class="btn btn--wa btn--xl" href="${WA(c, c.ui.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.hero.ctaWhatsapp)}</span></a>
    <dl class="contact__list">
      <div><dt>${esc(c.contact.labels.phone)}</dt><dd><a href="${c.ui.phoneHref}">${esc(c.ui.phoneDisplay)}</a></dd></div>
      <div><dt>${esc(c.contact.labels.email)}</dt><dd><a href="mailto:${c.ui.emailAddress}">${esc(c.ui.emailAddress)}</a></dd></div>
      <div><dt>${esc(c.contact.labels.address)}</dt><dd><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent("Control Plus Canarias, Av. Claudio Delgado Díaz 73, Las Chafiras")}" target="_blank" rel="noopener">${esc(c.contact.address)}</a></dd></div>
    </dl>
  </div>
</section>
</main>

<footer class="ftr">
  <div class="wrap ftr__in">
    <img class="ftr__logo" src="/img/logo-original.webp" width="600" height="251" alt="Control Plus Canarias" loading="lazy">
    <p>${esc(c.footer.legalName)} · ${esc(c.footer.cif)}<br>${esc(c.footer.address)}</p>
    <p><a href="${privacyHref}">${esc(c.footer.privacy)}</a> · <a href="/${other === "es" ? "" : "en/"}" hreflang="${other}" lang="${other}">${esc(c.ui.languages[other])}</a></p>
    <p class="ftr__small">© ${new Date().getFullYear()} ${esc(c.footer.legalName)}. ${esc(c.footer.rights)}.</p>
  </div>
</footer>

<nav class="bar" id="bar" aria-label="${esc(c.ui.nav.contact)}">
  <a class="btn btn--wa" href="${WA(c, c.ui.brand)}" target="_blank" rel="noopener">${waIc}<span>${esc(c.ui.whatsapp)}</span></a>
  <a class="btn btn--line" href="${c.ui.phoneHref}">${phIc}<span>${esc(c.ui.call)}</span></a>
</nav>
<script src="/assets/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

function privacy(lang) {
  const c = COPY[lang], txt = read("content/privacy-es.txt").trim().split(/\n+/);
  const body = txt.map(l => /^[¿A-ZÁÉÍÓÚÑ ?]{8,}$/.test(l) || /^¿.*\?$/.test(l) ? `<h2>${esc(l)}</h2>` : `<p>${esc(l)}</p>`).join("\n");
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.footer.privacy)} · Control Plus Canarias</title><meta name="robots" content="noindex"><link rel="icon" href="/img/emblem.png" type="image/png"><link rel="stylesheet" href="/assets/site.css?v=${V}"></head>
<body class="legal"><header class="legal__hdr wrap"><a class="brand" href="${lang === "es" ? "/" : "/en/"}"><span class="emblem" aria-hidden="true"></span><span class="brand__name">Control Plus<small>Canarias</small></span></a></header>
<main class="wrap legal__body">${lang === "en" ? '<p class="legal__note">This privacy policy is published in Spanish, the legally binding version.</p>' : ""}<h1>${esc(txt[0])}</h1>${body.split("\n").slice(1).join("\n")}</main></body></html>`;
}

write("index.html", page("es"));
write("en/index.html", page("en"));
write("privacidad/index.html", privacy("es"));
write("en/privacy/index.html", privacy("en"));
write("404.html", page("es").replace("<title>", '<meta name="robots" content="noindex"><title>404 · '));
console.log("built: /, /en/, /privacidad/, /en/privacy/, /404.html");
