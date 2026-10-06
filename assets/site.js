/* Control Plus Canarias · interactions (progressive: everything is readable without this file) */
(function () {
  "use strict";
  var d = document, html = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var desk = matchMedia("(min-width: 900px)");
  var c = navigator.connection, lite = c && (c.saveData || /2g/.test(c.effectiveType || ""));

  /* hero: intro sequence, then the video loop fades in over the poster */
  requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.add("loaded"); }); });
  var hv = $(".hero__video");
  if (hv && !reduced && !lite) {
    hv.addEventListener("playing", function () { hv.classList.add("on"); }, { once: true });
    addEventListener("load", function () { hv.src = desk.matches ? hv.dataset.srcD : hv.dataset.srcM; hv.play().catch(function () {}); });
    new IntersectionObserver(function (es) { if (hv.src) es[0].isIntersecting ? hv.play().catch(function () {}) : hv.pause(); }).observe(hv);
  } else if (hv) hv.remove();

  /* showreel story bars: follow the clip, click to jump */
  var REEL = [0, 4.15, 7.95], segs = $$(".reel__seg");
  if (hv && segs.length) {
    (function tick() {
      if (hv.duration) {
        var t = hv.currentTime, end = [REEL[1], REEL[2], hv.duration];
        segs.forEach(function (s, i) { var f = Math.min(1, Math.max(0, (t - REEL[i]) / (end[i] - REEL[i]))); s.style.setProperty("--f", f.toFixed(3)); s.classList.toggle("on", t >= REEL[i] && t < end[i]); });
      }
      requestAnimationFrame(tick);
    })();
    segs.forEach(function (s, i) { s.addEventListener("click", function () { if (hv.duration) hv.currentTime = REEL[i] + 0.3; }); });
  }

  /* rotating audience word */
  var rw = $$(".rot span"), ri = 0;
  if (rw.length > 1 && !reduced) setInterval(function () {
    var cur = rw[ri]; ri = (ri + 1) % rw.length; cur.classList.remove("on"); cur.classList.add("out");
    setTimeout(function () { cur.classList.remove("out"); }, 700); rw[ri].classList.add("on");
  }, 2200);

  /* section videos: load + play only while visible */
  var vo = new IntersectionObserver(function (es) {
    es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { if (!v.src) { v.src = v.dataset.src; v.addEventListener("playing", function () { v.classList.add("on"); }, { once: true }); } v.play().catch(function () {}); } else v.pause(); });
  }, { rootMargin: "200px" });
  $$("video[data-src]").forEach(function (v) { if (reduced || lite) v.remove(); else vo.observe(v); });

  /* reveal on scroll */
  var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }); }, { rootMargin: "0px 0px -12% 0px" });
  $$(".reveal, .map, .svc__card").forEach(function (el) { ro.observe(el); });

  /* WhatsApp bar (phone) / floating button (desktop): after the hero buttons, hidden at the contact card */
  var bar = $("#bar"), fl = $("#waFloat"), pastHero = false, atContact = false;
  function dock() { var on = pastHero && !atContact; bar.classList.toggle("on", on); fl.classList.toggle("on", on); }
  new IntersectionObserver(function (es) { pastHero = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; dock(); }).observe($("#heroCtas"));
  new IntersectionObserver(function (es) { atContact = es[0].isIntersecting; dock(); }, { threshold: .25 }).observe($(".cta"));

  /* scroll-linked: progress, header, steps line, stacking cards, parallax, quote, active nav */
  var steps = $("#steps"), stepEls = $$(".step"), cards = $$(".svc__card"), pars = $$(".par img"), toTop = $("#toTop"), covx = $(".covx");
  var navLinks = $$(".hdr__nav a"), navSecs = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  var ticking = false;
  function onScroll() {
    ticking = false;
    var vh = innerHeight, max = html.scrollHeight - vh;
    html.style.setProperty("--sp", (scrollY / max).toFixed(4));
    html.classList.toggle("is-scrolled", scrollY > 40);
    if (steps) {
      var r = steps.getBoundingClientRect(), p = reduced ? 1 : clamp((vh * 0.62 - r.top) / (r.height * 0.85));
      steps.style.setProperty("--p", p.toFixed(3));
      stepEls.forEach(function (s, i) { s.classList.toggle("done", p >= i / stepEls.length + 0.04); });
    }
    if (!desk.matches && !reduced) cards.forEach(function (card, i) {
      var next = cards[i + 1], btn = card.firstElementChild;
      if (!next) return;
      var top = 84 + (i + 1) * 10, k = clamp(1 - (next.getBoundingClientRect().top - top) / (vh - top));
      btn.style.setProperty("--s", (1 - k * 0.07).toFixed(4));
      btn.style.setProperty("--b", (1 - k * 0.4).toFixed(3));
    });
    if (!reduced) pars.forEach(function (img) {
      var r2 = img.parentNode.getBoundingClientRect();
      if (r2.bottom < 0 || r2.top > vh) return;
      img.style.setProperty("--py", ((r2.top + r2.height / 2 - vh / 2) * -0.08).toFixed(1) + "px");
    });
    toTop.classList.toggle("on", scrollY > vh * 1.2);
    if (covx && !reduced) { var cr = covx.getBoundingClientRect(); if (cr.bottom > 0 && cr.top < vh) covx.style.setProperty("--cz", (1.18 - 0.18 * clamp((vh - cr.top) / (vh + cr.height))).toFixed(4)); }
    var cur = -1;
    navSecs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.4) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  desk.addEventListener("change", function () { cards.forEach(function (card) { card.firstElementChild.removeAttribute("style"); }); onScroll(); });
  onScroll();

  /* trust counters: count up once to the real value */
  if (!reduced) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, txt = el.textContent, to = +el.dataset.count, from = to > 100 ? to - 15 : 0, t0 = performance.now();
        (function f(t) { var k = Math.min(1, (t - t0) / 1100), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = txt.replace(String(to), String(v)); if (k < 1) requestAnimationFrame(f); })(t0);
      });
    }, { threshold: .6 });
    $$("[data-count]").forEach(function (el) { if (el.dataset.count) co.observe(el); });
  }

  /* desktop: spotlight border + magnetic main buttons */
  if (fine && !reduced) {
    $$(".spot").forEach(function (el) {
      el.addEventListener("pointermove", function (e) { var r = el.getBoundingClientRect(); el.style.setProperty("--mx", e.clientX - r.left + "px"); el.style.setProperty("--my", e.clientY - r.top + "px"); });
    });
    $$(".mag").forEach(function (el) {
      el.addEventListener("pointermove", function (e) { var r = el.getBoundingClientRect(); el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px)"; });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* sector tabs with sliding indicator */
  var tabs = $$('.tabs [role="tab"]'), ind = $(".tabs__ind");
  function place(t) { ind.style.width = t.offsetWidth + "px"; ind.style.transform = "translateX(" + (t.offsetLeft - 5) + "px)"; }
  function select(t, focus) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; d.getElementById(x.getAttribute("aria-controls")).hidden = !on; });
    place(t); if (focus) t.focus();
    var bar2 = t.parentNode; bar2.scrollTo({ left: t.offsetLeft - (bar2.clientWidth - t.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) { var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); } });
  });
  if (tabs[0]) { requestAnimationFrame(function () { place(tabs[0]); }); addEventListener("resize", function () { place($('.tabs [aria-selected="true"]')); }); }

  /* service detail sheet: one dialog filled from the JSON list */
  var sheet = $("#sheet"), data = {}, last = null;
  JSON.parse($("#svcData").textContent).forEach(function (x) { data[x.id] = x; });
  if (sheet && sheet.showModal) {
    var img = $(".sheet__img img", sheet);
    function open(id) {
      var x = data[id]; if (!x) return;
      var w = x.img.indexOf("p-") === 0 ? [480, 960, 1400] : [480, 960, 1600];
      img.srcset = w.map(function (n) { return "/img/" + x.img + "-" + n + ".webp?v=" + x.v + " " + n + "w"; }).join(", ");
      img.src = "/img/" + x.img + "-960.webp?v=" + x.v; img.alt = x.name;
      $("#sheetK").textContent = x.tag; $("#sheetT").textContent = x.name; $("#sheetP").textContent = x.text; $("#sheetWa").href = x.wa;
      last = d.activeElement; sheet.classList.remove("closing"); sheet.showModal(); sheet.scrollTop = 0; html.classList.add("modal");
    }
    function close() {
      if (!sheet.open || sheet.classList.contains("closing")) return;
      if (reduced) { sheet.close(); return; }
      sheet.classList.add("closing");
      setTimeout(function () { sheet.close(); sheet.classList.remove("closing"); }, 260);
    }
    sheet.addEventListener("close", function () { html.classList.remove("modal"); if (last) last.focus({ preventScroll: true }); });
    sheet.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
    sheet.addEventListener("click", function (e) { if (e.target === sheet || e.target.closest("[data-close]")) close(); });
    d.addEventListener("click", function (e) { var t = e.target.closest("[data-open]"); if (t) { e.preventDefault(); open(t.dataset.open); } });
  }
})();
