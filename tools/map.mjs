// Builds img/islands.json: simplified SVG paths of the 8 Canary Islands from open province outlines
// (codeforgermany/click_that_hood spain-provinces.geojson). Usage: node tools/map.mjs <geojson>
import fs from "fs";
const g = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const polys = [];
g.features.filter(f => /palmas|tenerife/i.test(f.properties.name)).forEach(f => f.geometry.coordinates.forEach(p => polys.push(p[0])));
const area = r => Math.abs(r.reduce((a, [x, y], i) => { const [x2, y2] = r[(i + 1) % r.length]; return a + x * y2 - x2 * y; }, 0) / 2);
const top = polys.map(r => ({ r, a: area(r) })).sort((a, b) => b.a - a.a).slice(0, 8);
const NAMES = [["La Palma", -17.85, 28.65], ["El Hierro", -18.0, 27.75], ["La Gomera", -17.23, 28.1], ["Tenerife", -16.6, 28.27], ["Gran Canaria", -15.6, 27.95], ["Fuerteventura", -14.0, 28.4], ["Lanzarote", -13.65, 29.05], ["La Graciosa", -13.5, 29.25]];
const lon0 = -18.2, lon1 = -13.3, lat0 = 27.6, lat1 = 29.35, k = Math.cos(28.4 * Math.PI / 180);
const W = 1000, H = Math.round(W * (lat1 - lat0) / ((lon1 - lon0) * k));
const P = ([x, y]) => [((x - lon0) / (lon1 - lon0)) * W, ((lat1 - y) / (lat1 - lat0)) * H];
function dp(pts, eps) { // Douglas-Peucker
  if (pts.length < 3) return pts; let dmax = 0, idx = 0; const [a, b] = [pts[0], pts[pts.length - 1]];
  for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i], num = Math.abs((b[1] - a[1]) * x - (b[0] - a[0]) * y + b[0] * a[1] - b[1] * a[0]), den = Math.hypot(b[1] - a[1], b[0] - a[0]) || 1, d = num / den; if (d > dmax) { dmax = d; idx = i; } }
  return dmax > eps ? dp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(dp(pts.slice(idx), eps)) : [a, b];
}
const islands = top.map(({ r }) => {
  const ring = r.map(P), half = Math.floor(ring.length / 2), pts = dp(ring.slice(0, half + 1), 0.9).slice(0, -1).concat(dp(ring.slice(half), 0.9)), cx = r.reduce((s, p) => s + p[0], 0) / r.length, cy = r.reduce((s, p) => s + p[1], 0) / r.length;
  const name = NAMES.slice().sort((A, B) => Math.hypot(A[1] - cx, A[2] - cy) - Math.hypot(B[1] - cx, B[2] - cy))[0][0];
  const [px, py] = P([cx, cy]);
  return { name, d: "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z", x: +px.toFixed(1), y: +py.toFixed(1) };
});
const hq = P([-16.62, 28.05]);
fs.writeFileSync(new URL("../img/islands.json", import.meta.url), JSON.stringify({ w: W, h: H, hq: { x: +hq[0].toFixed(1), y: +hq[1].toFixed(1) }, islands }));
console.log("viewBox 0 0", W, H, "|", islands.map(i => i.name + "(" + i.d.split("L").length + "pts)").join(", "));
