/**
 * SafeBot — collegamento del modulo "Segnala un episodio" a un foglio Google.
 *
 * COME SI USA (dal telefono, con l'app Drive e l'app Fogli Google):
 * 1. Carica il file `Segnalazioni.csv` (è nella cartella del progetto) sul
 *    tuo Google Drive: app Drive → "+" → "Carica" → scegli il file.
 * 2. Tocca il file caricato → "Apri con" → "Fogli Google" → poi
 *    menu ⋮ → "Salva come Foglio Google". Ora è un vero foglio Google.
 * 3. Nel foglio: menu "Estensioni" → "Apps Script".
 * 4. Cancella il testo che c'è e incolla tutto questo file.
 * 5. Salva (icona del dischetto). La prima volta Google chiede
 *    l'autorizzazione: accettala ("Consenti").
 * 6. In alto a destra: "Esegui il deployment" → "Nuovo deployment" →
 *    tipo "App web" → "Esegui come: me" → "Chi ha accesso: chiunque" →
 *    "Esegui il deployment" → copia l'indirizzo che finisce con /exec.
 * 7. Incolla quell'indirizzo in src/botpress.config.js, nella riga
 *    `reportEndpoint: ""`, tra le virgolette. Salva e fai commit.
 *
 * Il foglio usa la scheda "Segnalazioni" se c'è, altrimenti la prima scheda
 * del file (quella che nasce dal CSV): in entrambi i casi la prima riga sono
 * le intestazioni qui sotto, scritte in automatico se mancano.
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
  // Scheda "Segnalazioni" se esiste, altrimenti la prima scheda del file
  // (cioè quella nata dal file Segnalazioni.csv caricato sul Drive).
  let foglio = file.getSheetByName(FOGLIO);
  if (!foglio) foglio = file.getSheets()[0];
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
