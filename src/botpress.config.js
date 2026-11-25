/*
 * Configurazione della chat Botpress.
 *
 * Come collegare l'AI:
 * 1. Crea/apri il bot su https://botpress.com (es. "SafeBot")
 * 2. Nel pannello del bot vai su Webchat > Deploy Settings e copia "botId" e "clientId"
 * 3. Incollali qui sotto tra le virgolette, salva e ricarica il sito.
 *
 * La chat dimostrativa sparisce da sola e al suo posto risponde il bot Botpress.
 */
window.SAFEBOT_CONFIG = {
  botId: "",
  clientId: "",

  // Indirizzo del modulo Apps Script che salva le segnalazioni in un foglio
  // Google (vedi src/google-apps-script.gs). Se lo compili, ogni segnalazione
  // viene copiata anche lì, oltre che in Netlify Forms.
  // Deve finire con /exec — esempio:
  //   reportEndpoint: "https://script.google.com/macros/s/AKfycb.../exec"
  reportEndpoint: "",

  // Versione della Webchat indicata da Botpress nell'embed code (es. "v3.6").
  injectVersion: "v3.6",

  // Id del contenitore in pagina: la chat viene montata dentro questo elemento.
  selector: "#bp-embedded-webchat",

  // Opzionale: URL completo dello script di configurazione generato da Botpress
  // (quello che compare come secondo <script> nell'embed code).
  // Se lo compili, ha la precedenza su botId/clientId.
  embedScriptUrl: "",
};
