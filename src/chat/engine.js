/*
 * Motore della chat di SafeBot.
 *
 * Funziona senza servizi esterni e senza chiavi: legge il messaggio, lo
 * normalizza e cerca l'argomento più corrispondente tra quelli di intents.js.
 * Le regole di sicurezza sono in testa a tutto:
 *   1. crisi e pericolo immediato hanno sempre la precedenza;
 *   2. le richieste fuori tema ricevono una risposta esplicita;
 *   3. se non capisce, lo dice invece di inventare.
 *
 * Se in botpress.config.js sono presenti botId e clientId, al posto di questa
 * chat viene caricata la webchat di Botpress (vedi in fondo).
 */

const $ = (id) => document.getElementById(id);

const ui = {
  messages: $("messages"),
  composer: $("composer"),
  input: $("chat-input"),
  note: $("chat-note"),
  status: $("chat-status"),
  demo: $("chat-demo"),
  bp: $("chat-bp"),
  panel: document.querySelector(".chatpanel"),
};

/* ---------------------------------------------------------------- utilità */

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* Siti citati nelle risposte: dal telefono diventano link da toccare. */
const SITI = {
  "commissariatodips.it": "https://www.commissariatodips.it",
  "garanteprivacy.it": "https://www.garanteprivacy.it",
  "generazioniconnesse.it": "https://www.generazioniconnesse.it",
  "azzurro.it": "https://azzurro.it",
  "114.it": "https://114.it",
};

const SITI_RE = Object.keys(SITI)
  .map((sito) => sito.replace(/[.]/g, "[.]"))
  .join("|");

const LINKY = new RegExp(`(https?://[^\\s<]+|(?:www\\.)?(?:${SITI_RE}))`, "g");

/* Grassetto, numeri chiamabili e siti linkati, senza toccare i link già creati. */
function inline(value) {
  return escapeHtml(value)
    .split(LINKY)
    .map((part, index) => {
      if (index % 2) {
        const url = /^https?:/.test(part) ? part : SITI[part.replace(/^www\./, "")] || `https://${part}`;
        return `<a href="${url}" target="_blank" rel="noopener">${part}</a>`;
      }
      return part
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/1\.96\.96/g, '<a href="tel:19696">1.96.96</a>')
        .replace(/\b(112|114)\b/g, '<a href="tel:$1">$1</a>');
    })
    .join("");
}

/*
 * Impaginazione pensata per lo schermo del telefono: ogni riga diventa un
 * paragrafo, le righe con "•" o "1." diventano veri elenchi (puntati e
 * numerati), così le risposte lunghe non sono un muro di testo.
 */
function format(value) {
  const righe = inline(value).split("\n");
  const blocchi = [];
  let elenco = null;

  const chiudiElenco = () => {
    if (!elenco) return;
    const inizio = elenco.tag === "ol" && elenco.da !== 1 ? ` start="${elenco.da}"` : "";
    blocchi.push(
      `<${elenco.tag} class="msg__list"${inizio}>${elenco.voci.map((voce) => `<li>${voce}</li>`).join("")}</${elenco.tag}>`,
    );
    elenco = null;
  };

  for (const riga of righe) {
    const testo = riga.trim();
    if (!testo) {
      chiudiElenco();
      continue;
    }
    const punto = testo.match(/^[•·\-]\s+(.+)$/);
    const numero = testo.match(/^(\d{1,2})[.)]\s+(.+)$/);
    if (punto) {
      if (!elenco || elenco.tag !== "ul") {
        chiudiElenco();
        elenco = { tag: "ul", da: 1, voci: [] };
      }
      elenco.voci.push(punto[1]);
      continue;
    }
    if (numero) {
      const da = Number(numero[1]);
      if (!elenco || elenco.tag !== "ol" || elenco.da + elenco.voci.length !== da) {
        chiudiElenco();
        elenco = { tag: "ol", da, voci: [] };
      }
      elenco.voci.push(numero[2]);
      continue;
    }
    chiudiElenco();
    blocchi.push(`<span class="msg__p">${testo}</span>`);
  }
  chiudiElenco();
  return blocchi.join("");
}

/* minuscolo, senza accenti, apostrofi dritti, spazi compattati */
const normalize = (value) =>
  ` ${value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim()} `;

/* -------------------------------------------------------------- matching */

const CRISIS = INTENTS.find((intent) => intent.id === "crisis");

const isCrisis = (text) => CRISIS.patterns.some((pattern) => pattern.test(text));

const isOffTopic = (text) => OFF_TOPIC.patterns.some((pattern) => pattern.test(text));

/* L'argomento con più parole chiave trovate; a parità vince chi sta prima. */
function pickIntent(text) {
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const pattern of intent.patterns) if (pattern.test(text)) score += 1;
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best;
}

/* ---------------------------------------------------------------- rendering */

let busy = false;
let lastUnclear = false;

function addBubble(text, who, options = {}) {
  if (!ui.messages) return null;
  const node = document.createElement("div");
  node.className = `msg msg--${who}${options.urgent ? " msg--urgent" : ""}`;
  node.innerHTML = format(text);
  ui.messages.appendChild(node);
  ui.messages.scrollTop = ui.messages.scrollHeight;
  return node;
}

function addChips(labels) {
  if (!ui.messages || !labels || !labels.length) return;
  const wrap = document.createElement("div");
  wrap.className = "chips";
  for (const label of labels) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip chip--btn";
    button.textContent = label;
    wrap.appendChild(button);
  }
  ui.messages.appendChild(wrap);
  ui.messages.scrollTop = ui.messages.scrollHeight;
}

function addTyping() {
  if (!ui.messages) return null;
  const node = document.createElement("p");
  node.className = "msg msg--bot msg--typing";
  node.innerHTML = "<i></i><i></i><i></i>";
  node.setAttribute("aria-label", "SafeBot sta scrivendo");
  ui.messages.appendChild(node);
  ui.messages.scrollTop = ui.messages.scrollHeight;
  return node;
}

/* ------------------------------------------------------------ flusso guidato */

let flow = null;

function startFlow(name) {
  flow = { name, step: 0, data: {} };
}

function askFlowStep() {
  const current = FLOWS[flow.name];
  const step = current.steps[flow.step];
  if (step) {
    addBubble(step.question, "bot");
    addChips(step.chips || []);
    return;
  }
  const closing = current.finish(flow.data);
  flow = null;
  addBubble(closing, "bot");
  addChips(current.chips || []);
}

function answerFlowStep(value) {
  const step = FLOWS[flow.name].steps[flow.step];
  flow.data[step.key] = value.trim();
  flow.step += 1;
  askFlowStep();
}

/* ---------------------------------------------------------------- risposta */

function reply(rawText) {
  if (busy) return;
  busy = true;
  const typing = addTyping();
  const text = normalize(rawText);

  window.setTimeout(() => {
    typing?.remove();

    /* 1. crisi: sempre per prima, qualunque altra cosa ci sia scritta */
    if (isCrisis(text)) {
      flow = null;
      lastUnclear = false;
      addBubble(CRISIS.reply, "bot", { urgent: true });
      addChips(CRISIS.chips);
      busy = false;
      return;
    }

    /* 2. comandi di reset */
    if (/ (annulla|ricomincia|ricominciamo|stop|basta così|da capo) /.test(text)) {
      flow = null;
      lastUnclear = false;
      addBubble("Va bene, ripartiamo da zero. Di cosa vuoi parlare?", "bot");
      addChips(FALLBACK.chips);
      busy = false;
      return;
    }

    /* 3. se è in corso un flusso guidato, la risposta è il passo successivo */
    if (flow) {
      answerFlowStep(rawText);
      busy = false;
      return;
    }

    /* 4. argomento riconosciuto */
    const intent = pickIntent(text);
    if (intent) {
      lastUnclear = false;
      addBubble(intent.reply, "bot", { urgent: intent.urgent });
      addChips(intent.chips);
      if (intent.startFlow) {
        startFlow(intent.startFlow);
        askFlowStep();
      }
      busy = false;
      return;
    }

    /* 5. richiesta palesemente fuori tema */
    if (isOffTopic(text)) {
      lastUnclear = false;
      addBubble(OFF_TOPIC.reply, "bot");
      addChips(OFF_TOPIC.chips);
      busy = false;
      return;
    }

    /* 6. non ho capito: al secondo tentativo passo ai numeri veri */
    addBubble(FALLBACK.reply, "bot");
    addChips(FALLBACK.chips);
    if (lastUnclear) {
      addBubble(
        "Se preferisci parlare con una persona: **1.96.96** (Telefono Azzurro), **114** (Emergenza Infanzia, 24 ore), **112** (emergenze). Sono gratuiti e non serve spiegare tutto in anticipo.",
        "bot",
      );
    }
    lastUnclear = true;
    busy = false;
  }, 520);
}

function send(rawText) {
  const text = rawText.trim();
  if (!text) return;
  addBubble(text, "me");
  reply(text);
}

/* --------------------------------------------------------------- interfaccia */

ui.composer?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!ui.input) return;
  send(ui.input.value);
  ui.input.value = "";
  ui.input.focus();
});

ui.messages?.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip--btn");
  if (chip) send(chip.textContent);
});

/* ----------------------------------------------------- chat esterna (opzionale) */

const config = window.SAFEBOT_CONFIG || {};
const hasExternalChat = Boolean(config.embedScriptUrl) || Boolean(config.botId && config.clientId);
let loadingExternal = false;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Impossibile caricare ${src}`));
    document.head.appendChild(script);
  });
}

async function loadExternalChat() {
  if (loadingExternal || !hasExternalChat) return;
  loadingExternal = true;
  const version = config.injectVersion || "v3.6";
  try {
    await loadScript(`https://cdn.botpress.cloud/webchat/${version}/inject.js`);
    if (config.embedScriptUrl) {
      await loadScript(config.embedScriptUrl);
    } else {
      window.botpress.init({
        botId: config.botId,
        clientId: config.clientId,
        selector: config.selector || "#bp-embedded-webchat",
        configuration: {
          botName: "SafeBot",
          color: "#0f7a6c",
          variant: "soft",
          themeMode: "light",
          fontFamily: "inter",
          website: {},
          email: {},
          phone: {},
          termsOfService: {},
          privacyPolicy: {},
        },
      });
    }
    if (ui.demo) ui.demo.hidden = true;
    if (ui.bp) ui.bp.hidden = false;
    if (ui.status) {
      ui.status.textContent = "AI · online";
      ui.status.dataset.mode = "live";
    }
    if (ui.note) {
      ui.note.textContent =
        "Risposte generate da un'intelligenza artificiale: non sono consigli medici, psicologici o legali e non sostituiscono una persona. In caso di pericolo chiama il 112 o il 114.";
    }
  } catch (error) {
    loadingExternal = false;
    console.warn("[SafeBot] Botpress non disponibile:", error);
    if (ui.note) {
      ui.note.textContent =
        "In questo momento l'assistente non è raggiungibile. Se hai bisogno di aiuto subito chiama il 112, il 114 o il 1.96.96.";
    }
  }
}

/* ------------------------------------------------------- pulsante flottante */

if ("IntersectionObserver" in window) {
  const fab = document.querySelector(".fab");
  const watched = [ui.panel, $("segnala"), $("privacy")].filter(Boolean);
  const visible = new Set();

  if (fab && watched.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        fab.classList.toggle("is-hidden", visible.size > 0);
      },
      { threshold: 0.12 },
    );
    for (const target of watched) observer.observe(target);
  }
}

/* caricamento pigro della chat esterna quando la sezione entra in vista */
if (hasExternalChat && ui.panel && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        loadExternalChat();
      }
    },
    { rootMargin: "200px" },
  );
  observer.observe(ui.panel);
}

document.querySelectorAll('a[href="#chat"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    loadExternalChat();
    const panel = $("chat-panel");
    if (panel && window.matchMedia("(max-width: 980px)").matches) {
      event.preventDefault();
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.setTimeout(() => {
      if (ui.demo && !ui.demo.hidden) ui.input?.focus({ preventScroll: true });
    }, 550);
  });
});

/* ------------------------------------------- modulo di segnalazione (Netlify) */

const reportForm = $("report-form");
const anonymous = $("report-anonymous");
const contactField = $("contact-field");
const contactInput = $("report-contact");
const reportWhat = $("report-what");
const reportConsent = $("report-consent");
const reportStatus = $("report-status");
const reportSubmit = $("report-submit");

/*
 * Copia facoltativa della segnalazione in un foglio Google, tramite il
 * modulo Apps Script di src/google-apps-script.gs (indirizzo in
 * botpress.config.js → reportEndpoint). Il foglio non può rispondere al
 * browser, quindi la chiamata parte e non si aspetta la risposta: la
 * segnalazione resta comunque salvata da Netlify Forms.
 */
function copiaNelFoglio(dati) {
  const endpoint = config.reportEndpoint;
  if (!endpoint) return;
  try {
    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...dati, pagina: window.location.href }),
      keepalive: true,
    }).catch(() => {});
  } catch (errore) {
    console.warn("[SafeBot] foglio Google non raggiungibile:", errore);
  }
}

const setReportStatus = (message, kind = "") => {
  if (!reportStatus) return;
  reportStatus.textContent = message;
  reportStatus.dataset.kind = kind;
};

const syncContactField = () => {
  if (!anonymous || !contactField) return;
  contactField.hidden = anonymous.checked;
  if (anonymous.checked && contactInput) contactInput.value = "";
};

anonymous?.addEventListener("change", syncContactField);
syncContactField();

reportForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const what = reportWhat?.value.trim() ?? "";

  if (what.length < 20) {
    setReportStatus("Racconta cosa è successo con almeno qualche frase (20 caratteri).", "error");
    reportWhat?.focus();
    return;
  }
  if (reportConsent && !reportConsent.checked) {
    setReportStatus("Per inviare devi confermare di aver letto la privacy.", "error");
    reportConsent.focus();
    return;
  }

  /* I dati li raccoglie Netlify Forms (e, se attivo, il foglio Google). */
  const dati = {
    anonimo: anonymous?.checked ? "sì" : "no",
    contatto: anonymous?.checked ? "" : (contactInput?.value.trim() ?? ""),
    cosa: what,
    quando: $("report-when")?.value.trim() ?? "",
    dove: $("report-where")?.value.trim() ?? "",
    prove: $("report-proofs")?.value.trim() ?? "",
    website: $("report-website")?.value ?? "",
  };

  const body = new URLSearchParams({
    "form-name": "segnalazione",
    anonymous: dati.anonimo,
    contact: dati.contatto,
    what: dati.cosa,
    when: dati.quando,
    where: dati.dove,
    proofs: dati.prove,
    website: dati.website,
  });

  reportSubmit?.setAttribute("disabled", "disabled");
  setReportStatus("Invio in corso…");

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) throw new Error("Invio non riuscito");
    copiaNelFoglio(dati);
    const success = $("report-success");
    if (reportForm) reportForm.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus?.();
    }
    setReportStatus("");
  } catch (error) {
    setReportStatus(
      `${error instanceof Error ? error.message : "Invio non riuscito"}. Riprova tra poco o chiama il 1.96.96.`,
      "error",
    );
  } finally {
    reportSubmit?.removeAttribute("disabled");
  }
});
