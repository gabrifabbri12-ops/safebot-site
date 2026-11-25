/**
 * SafeBot — collegamento del modulo "Segnala un episodio" a un foglio Google.
 *
 * COME SI USA (dal telefono, con l'app Fogli Google o da browser):
 * 1. Apri un foglio Google nuovo e chiamalo come vuoi (es. "SafeBot segnalazioni").
 * 2. Nel foglio: menu "Estensioni" → "Apps Script".
 * 3. Cancella il testo che c'è e incolla tutto questo file.
 * 4. Salva (icona del dischetto), poi "Esegui" scegliendo la funzione
 *    `eseguiIntestazioni`: crea il foglio "Segnalazioni" con la prima riga
 *    di intestazioni (la prima volta Google chiede l'autorizzazione: accettala).
 * 5. "Esegui" di nuovo → scegli `prova`: scrive una riga di esempio, che poi
 *    puoi cancellare.
 * 6. In alto a destra: "Esegui il deployment" → "Nuovo deployment" →
 *    tipo "App web" → "Esegui come: me" → "Chi ha accesso: chiunque" →
 *    "Esegui il deployment" → copia l'indirizzo che finisce con /exec.
 * 7. Incolla quell'indirizzo in src/botpress.config.js, nella riga
 *    `reportEndpoint: ""`, tra le virgolette. Salva e fai commit.
 *
 * Dopo di che ogni segnalazione inviata dal sito compare come nuova riga.
 * La segnalazione resta comunque salvata anche in Netlify Forms: se il foglio
 * si rompe, non si perde niente.
 *
 * Le colonne sono queste, nell'ordine:
 *   Data | Anonimo | Contatto | Cosa è successo | Quando | Dove | Prove | Pagina
 */

const FOGLIO = "Segnalazioni";

const INTESTAZIONI = [
  "Data",
  "Anonimo",
  "Contatto",
  "Cosa è successo",
  "Quando",
  "Dove",
  "Prove",
  "Pagina",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const dati = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Campo nascosto anti-spam: se è compilato non salviamo nulla.
    if (String(dati.website || "").trim()) return risposta({ ok: true });

    const foglio = prendiFoglio();
    foglio.appendRow([
      new Date(),
      dati.anonimo || "",
      dati.contatto || "",
      dati.cosa || "",
      dati.quando || "",
      dati.dove || "",
      dati.prove || "",
      dati.pagina || "",
    ]);

    return risposta({ ok: true });
  } catch (errore) {
    return risposta({ ok: false, errore: String(errore) });
  } finally {
    lock.releaseLock();
  }
}

function prendiFoglio() {
  const file = SpreadsheetApp.getActiveSpreadsheet();
  let foglio = file.getSheetByName(FOGLIO);
  if (!foglio) foglio = file.insertSheet(FOGLIO);
  if (foglio.getLastRow() === 0) {
    foglio.appendRow(INTESTAZIONI);
    foglio.getRange(1, 1, 1, INTESTAZIONI.length).setFontWeight("bold");
    foglio.setFrozenRows(1);
  }
  return foglio;
}

function risposta(oggetto) {
  return ContentService.createTextOutput(JSON.stringify(oggetto)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/* Crea il foglio e le intestazioni (eseguila una volta). */
function eseguiIntestazioni() {
  prendiFoglio();
}

/* Scrive una riga di esempio, per controllare che tutto funzioni. */
function prova() {
  prendiFoglio().appendRow([
    new Date(),
    "sì",
    "",
    "Questa è una riga di prova: puoi cancellarla.",
    "oggi",
    "",
    "",
    "https://botsafe.netlify.app/",
  ]);
}
