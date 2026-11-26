/*
 * Argomenti in più per la chat di SafeBot.
 *
 * Il build mette questo file subito dopo intents.js e prima di engine.js:
 * quindi può aggiungere argomenti a INTENTS e definire PAROLE, le parole
 * chiave che il motore usa per riconoscere anche i refusi ("bullsmo",
 * "insultono", "discriminazioone").
 *
 * Regola: qui dentro solo argomenti specifici, con risposte verificate.
 * I numeri utili sono sempre gli stessi del resto del sito:
 * 112 (emergenze), 114 (Emergenza Infanzia), 1.96.96 (Telefono Azzurro).
 */

INTENTS.push(
  {
    id: "body-shaming",
    patterns: [
      /grass[oa]|obes|sovrappeso/,
      /brutt[oa]|cess[oa]|schif[oa]/,
      /aspetto fisico|il mio corpo|come sono fatto/,
      /nan[oa]|bass[oa] di statura/,
      /acne|brufoli|occhiali|apparecchio/,
      /mi chiamano (grasso|grassa|brutto|brutta|balena|scheletro)/,
    ],
    reply: `Prendere in giro qualcuno per il suo corpo ha un nome, **body shaming**, ed è bullismo: non è "solo uno scherzo" e non è colpa di chi lo subisce.\n\n**Cosa puoi fare:**\n1. **Non rispondere** e non giustificarti: il problema è di chi insulta, non del tuo corpo.\n2. Fai gli **screenshot** dei messaggi o dei commenti.\n3. **Blocca e segnala** chi lo fa.\n4. Parlane con un **adulto di fiducia**: a scuola c'è il referente antibullismo.\n\nSe ti guardi allo specchio e ti sembra che vada tutto storto, dillo a un adulto o al tuo medico: nessuno deve convincerti che devi cambiare per valere qualcosa.`,
    chips: ["Come salvo le prove?", "Come parlo con un adulto?", "Voglio fare una segnalazione"],
  },
  {
    id: "discrimination",
    patterns: [
      /razzis|negr|extracomunitari|stranier/,
      /omofob|gay|lesbica|trans|gender/,
      /religio|musulman|ebreo|cristian/,
      /disabil|handicap|autistic|sord[oa]|ciec[oa]/,
      /sessis|maschilist/,
    ],
    reply: `Insulti e minacce per il colore della pelle, la religione, l'orientamento sessuale, una disabilità o il genere sono **discriminazione**, e sono una forma di bullismo particolarmente grave.\n\n**Cosa puoi fare:**\n1. **Screenshot** di tutto, con data e nome dell'account.\n2. **Segnala** il contenuto alla piattaforma scegliendo "odio o discriminazione".\n3. Parlane con un **adulto di fiducia** e, se succede a scuola, con il referente antibullismo.\n4. Se le minacce continuano o i contenuti restano online, un adulto può rivolgersi alla **Polizia Postale** (commissariatodips.it).\n\nNon devi dimostrare niente a nessuno: è chi offende a essere nel torto.`,
    chips: ["Come salvo le prove?", "Come parlo con un adulto?", "Voglio fare una segnalazione"],
  },
  {
    id: "bully-me",
    patterns: [
      /sono io (il|a|quello|quella) (bullo|che)/,
      /ho bullizzato|ho preso in giro|ho insultato|ho partecipato|ho riso/,
      /un mio amico (bullizza|fa il bullo|prende in giro)/,
      /come smetto di (bullizzare|fare il bullo)/,
      /mi sento in colpa per come ho trattato/,
    ],
    reply: `Il fatto che tu lo stia dicendo conta, e non ti sto giudicando.\n\n**Cosa puoi fare adesso:**\n1. **Fermati**: anche "solo ridere" con gli altri fa male a chi lo riceve.\n2. **Togli** i contenuti che hai pubblicato o girato ad altri (foto, video, messaggi nei gruppi).\n3. **Chiedi scusa** davvero, senza "ma" e senza pretendere che l'altro ti perdoni subito.\n4. Parlane con un **adulto**: un insegnante o un genitore può aiutarti a sistemare le cose.\n\nSe quello che è successo è grave (minacce, foto intime, violenza), è meglio dirlo a un adulto prima che lo scopra qualcun altro: da lì si può ancora rimediare.`,
    chips: ["Come parlo con un adulto?", "Cosa devo fare?"],
  },
  {
    id: "module-info",
    patterns: [
      /come funziona (il modulo|la segnalazione|il form)/,
      /chi (legge|riceve) (la|le) segnalazion/,
      /segnalazione anonima|modulo anonimo/,
      /dove finisce(no)? (la segnalazione|i dati del modulo)/,
      /cosa (scrivo|metto) nel modulo/,
    ],
    reply: `In fondo alla pagina c'è il modulo **"Prepara una segnalazione"**. Ti chiede solo:\n\n• cosa è successo (con parole tue);\n• quando e dove;\n• se hai prove (screenshot, messaggi, testimoni);\n• se vuoi restare **anonimo** o lasciare un contatto.\n\nLa legge solo chi gestisce SafeBot: non viene pubblicata né condivisa. Serve a capire cosa sta succedendo e a indirizzarti verso la persona giusta (scuola, famiglia, Polizia Postale).\n\nIl modulo non è una denuncia e non è un servizio di emergenza: se sei in pericolo **adesso**, chiama il 112 o il 114.`,
    chips: ["Voglio fare una segnalazione", "Chi può aiutarmi?", "Cosa devo fare?"],
  },
  {
    id: "sexting-regret",
    patterns: [
      /ho (mandato|inviato) (una foto|un video|le mie foto|delle foto)/,
      /mi sono pentit[oa]|me ne pento|ho fatto una stupidaggine/,
      /sexting/,
    ],
    reply: `Non sei nei guai con me, e non hai rovinato niente per sempre: si può fare qualcosa.\n\n**Cosa fare subito:**\n1. **Chiedi** a chi l'ha ricevuta di cancellarla e di non inoltrarla.\n2. **Non mandare altro**, nemmeno se ti promettono che poi smettono.\n3. **Salva** la conversazione: se le foto vengono condivise, servono le prove.\n4. **Parlane con un adulto di fiducia** (un genitore, un insegnante, il tuo medico): prima lo dici, più è facile intervenire.\n\nSe qualcuno diffonde o minaccia di diffondere immagini intime è un **reato**: servono la Polizia Postale (commissariatodips.it) e, se sei minorenne, il 114. E non pagare nessuno.`,
    chips: ["Come salvo le prove?", "Chi può aiutarmi?", "Voglio fare una segnalazione"],
  },
  {
    id: "gaming",
    patterns: [
      /videogioc|fortnite|roblox|minecraft|call of duty|gta|fifa/,
      /mentre gioco|in partita|chat di gioco|voce in chat/,
      /discord|twitch|steam/,
    ],
    reply: `Anche nei giochi e nelle chat vocali vale la stessa regola: insulti e minacce non sono "parte del gioco".\n\n**Cosa fare:**\n1. **Muta e blocca** il giocatore (quasi tutti i giochi hanno "segnala" e "silenzia" nella schermata della partita).\n2. **Segnala** il giocatore e, se puoi, salva lo **screenshot** della chat.\n3. **Non condividere** dati personali: nome vero, scuola, città, numero di telefono.\n4. Se ti minacciano o dicono di sapere dove abiti, **dillo a un adulto** e valuta la Polizia Postale (commissariatodips.it).\n\nSe il gioco ti prende troppo (non dormi, salti scuola, non esci più), parlane con un adulto: è una cosa normale da sistemare, non una colpa.`,
    chips: ["Come salvo le prove?", "Come parlo con un adulto?"],
  },
  {
    id: "return-school",
    patterns: [
      /tornare a scuola|rientro a scuola|non voglio (tornare|piu andare) in classe/,
      /cambiare classe|cambiare scuola|nessuno mi vuole in classe/,
      /paura del (primo giorno|lunedi)/,
    ],
    reply: `Tornare in classe dopo quello che è successo è dura, e la paura è normale: non significa che sei debole.\n\n**Cose che aiutano:**\n1. **Un adulto alleato** a scuola: coordinatore, referente antibullismo, sportello d'ascolto. Chiedi un incontro, anche via email.\n2. **Un piano piccolo**: entrare con un amico, un posto dove sentirti al sicuro, a chi rivolgerti se succede di nuovo.\n3. **Scrivi** cosa è successo e quando: aiuta la scuola a intervenire.\n\nSe l'ansia è così forte che non riesci a entrare, dillo a casa e al tuo medico: non sono "capricci", e si può affrontare. Il Telefono Azzurro **1.96.96** risponde anche per questo, gratis e in anonimo.`,
    chips: ["Cosa fa lo sportello d'ascolto?", "Come parlo con un adulto?"],
  },
);

/*
 * Parole chiave per argomento: contano come una parola chiave trovata, ma il
 * motore le riconosce anche con una lettera sbagliata. Servono a capire i
 * messaggi scritti di fretta dal telefono.
 */
const PAROLE = {
  crisis: ["suicidio", "morire", "ammazzarmi", "uccidermi", "autolesionismo"],
  "danger-now": ["minaccia", "minacce", "minacciato", "picchiato", "coltello"],
  "threats-intimate": ["ricatto", "ricattato", "ricattano", "sextortion"],
  identity: ["robot", "programma", "umano"],
  law: ["reato", "denuncia", "legge", "querela"],
  "block-report-platform": ["bloccare", "blocco", "rimuovere"],
  "bullying-definition": ["bullismo", "bulli", "prepotenza"],
  "cyberbullying-definition": ["cyberbullismo"],
  "harassment-online": ["insulti", "insultano", "insultare", "offese", "offendono"],
  "photos-reshared": ["meme", "deepfake", "pubblicato"],
  "group-exclusion": ["escludono", "isolano", "ignorano"],
  "what-to-do": ["reagire", "difendermi", "spintoni"],
  proofs: ["screenshot", "prove", "testimoni"],
  "talk-to-adult": ["adulto", "genitori", "vergogna", "professore", "professoressa"],
  school: ["scuola", "sportello", "preside", "coordinatore", "dirigente"],
  "report-flow": ["segnalazione", "segnalare", "denunciare"],
  police: ["polizia", "carabinieri", "postale", "garante"],
  friend: ["amico", "amica", "compagno", "compagna", "testimone"],
  distress: ["ansia", "triste", "tristezza", "piango", "depressione", "panico"],
  retaliation: ["ritorsione", "vendetta", "peggiora"],
  privacy: ["anonimo", "anonima", "privacy"],
  contacts: ["numeri", "azzurro"],
  "parent-teacher": ["genitore", "insegnante", "figlio", "figlia"],
  "account-hacked": ["hackerato", "hackerata", "rubato"],
  "not-your-fault": ["colpa"],
  "how-it-works": ["gratis", "registrazione", "iscrizione"],
  thanks: ["grazie"],
  greeting: ["ciao", "salve", "buongiorno", "buonasera"],
  "body-shaming": ["grasso", "grassa", "brutto", "brutta", "brufoli", "corpo"],
  discrimination: ["razzismo", "omofobia", "disabile", "religione", "discriminazione"],
  "bully-me": ["bullizzato", "insultato", "pentito", "pentita"],
  "module-info": ["modulo"],
  "sexting-regret": ["sexting", "pentito", "pentita"],
  gaming: ["videogioco", "gioco", "discord", "twitch"],
  "return-school": ["rientro", "tornare"],
};

/*
 * Modi di dire che mancavano agli argomenti già esistenti: "mi prendono in
 * giro", "mi dicono parolacce", "mi sfottono". Stanno qui per non toccare
 * intents.js, che è già lungo.
 */
const aggiungiEspressioni = (id, espressioni) => {
  const argomento = INTENTS.find((intent) => intent.id === id);
  if (argomento) argomento.patterns.push(...espressioni);
};

aggiungiEspressioni("harassment-online", [
  /prend(e|ono) in giro|sfott|derid|parolacce|parole brutte/,
  /mi chiamano (con )?(un )?soprannome|mi danno (della|del)/,
]);

aggiungiEspressioni("group-exclusion", [/mi lasciano (fuori|da parte)|non mi calcolano/]);

/*
 * Richieste fuori tema riconosciute anche con verbi diversi
 * ("scrivimi" / "scrivi" / "compiti"). Restano in coda alle regole della chat.
 */
OFF_TOPIC.patterns.push(
  /scriv(i|imi) (un|una) (tema|poesia|codice|programma|lettera|relazione|storia)/,
  /compiti|equazion|analisi grammaticale|verbo|radice quadrata|esercizi di/,
);
