/* Control Plus Canarias · interactions (progressive: everything is readable without this file) */
(function () {
  "use strict";
  var d = document, html = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var c = navigator.connection, lite = c && (c.saveData || /2g/.test(c.effectiveType || ""));

  /* hero video: phone or desktop loop, after first paint */
  var hv = $(".hero__video");
  if (hv && !reduced && !lite) {
    var src = matchMedia("(max-aspect-ratio: 1/1)").matches ? hv.dataset.srcM : hv.dataset.srcD;
    addEventListener("load", function () { hv.src = src; hv.play().catch(function () {}); });
  } else if (hv) hv.remove();

  /* other videos: play only while visible */
  var vo = new IntersectionObserver(function (es) {
    es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(function () {}); } else v.pause(); });
  }, { rootMargin: "100px" });
  $$("video[data-src]").forEach(function (v) { if (reduced || lite) v.remove(); else vo.observe(v); });

  /* reveal on scroll */
  var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
  $$(".reveal, .map").forEach(function (el) { ro.observe(el); });

  /* header + mobile action bar */
  var heroCtas = $("#heroCtas"), bar = $("#bar");
  new IntersectionObserver(function (es) { bar.classList.toggle("on", !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe(heroCtas);
  var ticking = false;
  function onScroll() {
    ticking = false;
    html.classList.toggle("is-scrolled", scrollY > innerHeight * 0.55);
    var steps = $("#steps"); if (steps) {
      var r = steps.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
      steps.style.setProperty("--p", reduced ? 1 : p.toFixed(3));
      $$(".step", steps).forEach(function (s, i, all) { s.classList.toggle("done", p >= (i + 0.35) / all.length); });
    }
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* trust counters: count up once to the real value */
  if (!reduced) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, txt = el.textContent, to = +el.dataset.count, from = to > 100 ? to - 15 : 0, t0 = performance.now();
        (function f(t) { var k = Math.min(1, (t - t0) / 900), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = txt.replace(String(to), String(v)); if (k < 1) requestAnimationFrame(f); })(t0);
      });
    }, { threshold: .6 });
    $$("[data-count]").forEach(function (el) { if (el.dataset.count) co.observe(el); });
  }

  /* public health: image follows the open row (water image for Legionella) */
  var health = $(".health");
  $$(".acc__item").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) $$(".acc__item").forEach(function (o) { if (o !== item) o.open = false; });
      health.classList.toggle("water", item.open && item.hasAttribute("data-water"));
    });
  });

  /* sector tabs with sliding indicator */
  var tabs = $$('.tabs [role="tab"]'), ind = $(".tabs__ind");
  function place(t) { ind.style.width = t.offsetWidth + "px"; ind.style.transform = "translateX(" + t.offsetLeft + "px)"; }
  function select(t, focus) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; d.getElementById(x.getAttribute("aria-controls")).hidden = !on; });
    place(t); if (focus) t.focus(); t.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) { var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); } });
  });
  if (tabs[0]) { requestAnimationFrame(function () { place(tabs[0]); }); addEventListener("resize", function () { place($('.tabs [aria-selected="true"]')); }); }
})();
