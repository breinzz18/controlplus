import subsetFont from "subset-font"; import fs from "fs";
const site = "C:/Users/cioba/Desktop/VS Code/sites/controlplus/";
const text = ["index.html", "en/index.html", "privacidad/index.html", "content/copy.json"].map(f => fs.readFileSync(site + f, "utf8")).join("")
  + " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ¡¿ÁÉÍÓÚÜÑáéíóúüñªº€–—‘’“”«»•…·★";
const chars = [...new Set(text)].filter(c => c.codePointAt(0) >= 32).join("");
const fonts = { "archivo.woff2": "archivo/files/archivo-latin-standard-normal.woff2", "geist.woff2": "geist/files/geist-latin-wght-normal.woff2", "geist-mono.woff2": "geist-mono/files/geist-mono-latin-wght-normal.woff2" };
for (const [out, src] of Object.entries(fonts)) {
  const buf = fs.readFileSync("node_modules/@fontsource-variable/" + src);
  const o = await subsetFont(buf, chars, { targetFormat: "woff2" });
  fs.writeFileSync(site + "fonts/" + out, o); console.log(out, Math.round(buf.length / 1024) + "KB ->", Math.round(o.length / 1024) + "KB");
}
