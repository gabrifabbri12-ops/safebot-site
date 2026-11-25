/*
 * Prepara la cartella dist/ da pubblicare su Netlify.
 *
 * Cosa fa:
 *  1. ricompone index.html dalle due parti in src/ (head + body);
 *  2. unisce intents.js e engine.js in un unico script della chat;
 *  3. copia robots.txt, sitemap.xml e botpress.config.js;
 *  4. recupera i file grafici (CSS, og.png, favicon.ico) dal sito attuale, se
 *     non sono già presenti nella cartella static/.
 *
 * Per averli versionati basta mettere i file in static/ con lo stesso nome:
 *   static/index-xSUd54VX.css, static/og.png, static/favicon.ico
 * Lo script usa quelli e non scarica nulla.
 *
 * Uso: node build.mjs      (ASSETS_SOURCE per cambiare sito di provenienza)
 */

import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, "dist");
const STATIC = path.join(ROOT, "static");
const SORGENTI = (process.env.ASSETS_SOURCE ? [process.env.ASSETS_SOURCE] : ["https://botsafe.netlify.app"]).map((s) =>
  s.replace(/\/+$/, ""),
);

const esiste = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

async function scrivi(relativo, contenuto) {
  const destinazione = path.join(DIST, relativo);
  await mkdir(path.dirname(destinazione), { recursive: true });
  await writeFile(destinazione, contenuto);
  console.log(`  ${relativo} (${Buffer.byteLength(contenuto)} byte)`);
}

/*
 * File grafico: prima si cerca in static/, poi come testo base64 sempre in
 * static/ (anche spezzato in più parti: static/og.png.base64.part1, .part2, ...),
 * infine si scarica dal sito attuale.
 */
async function risorsa(nome, percorsoWeb) {
  const locale = path.join(STATIC, nome);
  if (await esiste(locale)) {
    const dati = await readFile(locale);
    console.log(`  ${nome} (${dati.length} byte, da static/)`);
    return scrivi(nome, dati);
  }

  const parti = [];
  for (let i = 1; ; i += 1) {
    const parte = path.join(STATIC, `${nome}.base64.part${i}`);
    if (!(await esiste(parte))) break;
    parti.push(await readFile(parte, "utf8"));
  }
  if (!parti.length) {
    const intero = path.join(STATIC, `${nome}.base64`);
    if (await esiste(intero)) parti.push(await readFile(intero, "utf8"));
  }
  if (parti.length) {
    const dati = Buffer.from(parti.join("").replace(/\s+/g, ""), "base64");
    console.log(`  ${nome} (${dati.length} byte, da static/ base64 in ${parti.length} parti)`);
    return scrivi(nome, dati);
  }
  for (const base of SORGENTI) {
    const risposta = await fetch(base + percorsoWeb);
    if (risposta.ok) {
      const dati = Buffer.from(await risposta.arrayBuffer());
      console.log(`  ${nome} (${dati.length} byte, da ${base})`);
      return scrivi(nome, dati);
    }
    console.log(`  ${base}${percorsoWeb}: HTTP ${risposta.status}`);
  }
  throw new Error(
    `Manca ${nome}: mettilo in static/ oppure controlla che ${SORGENTI.join(" o ")} sia raggiungibile.`,
  );
}

console.log("Build SafeBot");

/* 1. pagina: le parti in src/page/ vengono riunite in ordine */
const pageDir = path.join(ROOT, "src", "page");
const partiPagina = (await readdir(pageDir))
  .filter((file) => /^part\d+\.html$/.test(file))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
const pagina = (await Promise.all(partiPagina.map((file) => readFile(path.join(pageDir, file), "utf8")))).join("");
await scrivi("index.html", pagina);

/* 2. chat: un solo script, come si aspetta la pagina */
const intents = await readFile(path.join(ROOT, "src", "chat", "intents.js"), "utf8");
const engine = await readFile(path.join(ROOT, "src", "chat", "engine.js"), "utf8");
const chat = `(function () {\n"use strict";\n\n${intents}\n\n${engine}\n})();\n`;
await scrivi("assets/index-Dd5nKMTV.js", chat);

/* 3. file di testo */
for (const file of ["robots.txt", "sitemap.xml", "botpress.config.js"]) {
  await scrivi(file, await readFile(path.join(ROOT, "src", file), "utf8"));
}

/* 4. grafica */
await risorsa("assets/index-xSUd54VX.css", "/assets/index-xSUd54VX.css");
await risorsa("og.png", "/og.png");
await risorsa("favicon.ico", "/favicon.ico");

console.log("Fatto: dist/ è pronta.");
