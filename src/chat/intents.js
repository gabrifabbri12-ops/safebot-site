/*
 * Argomenti che SafeBot riconosce.
 *
 * Ogni argomento ha:
 *   id       — nome interno (unico)
 *   patterns — espressioni regolari cercate nel messaggio, già normalizzato
 *              (minuscolo, senza accenti, apostrofi dritti)
 *   reply    — testo della risposta: **grassetto** e gli URL diventano link da soli
 *   chips    — suggerimenti cliccabili mostrati sotto la risposta
 *   urgent   — se true la risposta viene evidenziata come urgente
 *   scope    — "core" (bullismo, aiuto, emergenze) oppure "extra"
 *
 * L'ordine conta: a parità di corrispondenze vince l'argomento scritto prima,
 * quindi i temi più delicati stanno in cima.
 */

const TEL_NOTE = "In caso di pericolo immediato chiama il 112.";

const INTENTS = [
  {
    id: "crisis",
    urgent: true,
    patterns: [
      /suicid/,
      /uccidermi|ammazzarmi|togliermi la vita/,
      /farmi del male|mi taglio|mi ferisco|autolesion/,
      /voglio morire|non voglio (piu )?vivere|non voglio (piu )?esserci/,
      /sparire per sempre|farla finita|non ha senso vivere/,
      /mi voglio buttare|buttarmi (di sotto|dal)/,
    ],
    reply: `Quello che provi adesso è importante e merita aiuto subito, non domani.\n**Chiama il 112** se sei in pericolo, oppure il **114** Emergenza Infanzia (24 ore) o il Telefono Azzurro **1.96.96**: parlano con ragazzi come te, gratis e senza giudicare.\nSe c'è una persona adulta vicino a te, in casa o a scuola, diglielo adesso. Non devi restare solo nemmeno un minuto.`,
    chips: ["Non so a chi parlare", "Chi può aiutarmi?"],
  },
  {
    id: "danger-now",
    urgent: true,
    patterns: [
      /mi stanno (aspettando|seguendo|cercando)/,
      /ho paura (adesso|ora|di uscire|di tornare)/,
      /mi (hanno )?minacciat[oi] (con|di morte)/,
      /sono in pericolo/,
      /mi picchiano|mi hanno picchiat|mi stanno picchiando/,
      /arma|coltello|pistola/,
    ],
    reply: `Se sei in pericolo **adesso**, la cosa giusta è chiamare il **112**: rispondono subito e mandano qualcuno. Non aspettare di essere sicuro, non è uno scherzo.\nSe puoi, allontanati da chi ti minaccia e cerca un posto con altre persone (un negozio, il portone di un palazzo, la scuola).\nIl **114** Emergenza Infanzia è attivo 24 ore su 24 per i minorenni.`,
    chips: ["Chi può aiutarmi?", "Voglio fare una segnalazione"],
  },
  {
    id: "threats-intimate",
    urgent: true,
    patterns: [
      /ricatt/,
      /minacciano di pubblicare|pubblicare (le |delle )?foto/,
      /foto (intima|nuda|nude|private)|video (intimo|hot)/,
      /sextortion/,
      /mi chiedono soldi/,
      /mi ha chiesto (una foto|un video)/,
    ],
    reply: `Se qualcuno ti minaccia di pubblicare foto o video, o ti chiede soldi, **non sei tu a essere in torto**: è un reato (si chiama sextortion).\n**Cosa fare:**\n1. **Non pagare** e non inviare altro materiale.\n2. **Non cancellare** la conversazione: sono prove.\n3. Chiedi subito aiuto a un **adulto di fiducia**.\n4. Segnala alla **Polizia Postale** (commissariatodips.it) e alla piattaforma.\nSe sei minorenne, puoi chiamare il **114** anche solo per capire come muoverti: è riservato.`,
    chips: ["Come salvo le prove?", "Chi può aiutarmi?"],
  },
  {
    id: "identity",
    patterns: [
      /sei (una persona|un bot|un ai|un robot|reale|vera|vero|umano)/,
      /chi sei|cosa sei/,
      /intelligenza artificiale/,
      /parlo con (una persona|qualcuno|un robot)/,
      /sei (vero|reale|vivo)/,
    ],
    reply: `Sono un'**intelligenza artificiale**, non una persona: sono un programma che risponde in modo automatico usando le informazioni con cui è stato preparato.\nNon ho emozioni e non capisco davvero come stai, quindi non posso sostituire un adulto, un insegnante o uno psicologo.\nSe vuoi parlare con una persona vera, chiama il Telefono Azzurro **1.96.96** o l'**114**. Posso però aiutarti a capire cosa dire e a chi rivolgerti.`,
    chips: ["Come parlo con un adulto?", "Chi può aiutarmi?"],
  },
  {
    id: "law",
    patterns: [
      /cosa dice la legge/,
      /e reato|reato|denunciare|legge sul bullismo/,
      /conseguenze (per|a) chi/,
      /cosa rischia/,
      /minorenne.*(legge|reato)/,
    ],
    reply: `Non sono un avvocato e non posso darti un parere legale, ma due cose utili da sapere:\n\n• In Italia esiste una legge specifica sul **cyberbullismo** (legge 71 del 2017): prevede che la scuola intervenga e che si possa chiedere la rimozione dei contenuti al gestore del sito o al Garante Privacy.\n• Minacce, diffamazione, molestie e diffusione di immagini intime sono **reati**: se ne occupano i Carabinieri, la Polizia e la Polizia Postale.\n\nSe sei minorenne, la denuncia la presenta un adulto con te. Un punto di partenza gratuito è la **Polizia Postale** (commissariatodips.it) o lo sportello d'ascolto della scuola.`,
    chips: ["Voglio fare una segnalazione", "Chi può aiutarmi?"],
  },
  {
    id: "block-report-platform",
    patterns: [
      /come (blocco|segnalo|elimino)/,
      /bloccare (una persona|qualcuno|un account)/,
      /far rimuovere (un video|una foto|un commento|il profilo)/,
      /segnalare (a|su) (instagram|tiktok|whatsapp|un social|facebook)/,
      /come si cancella (un commento|un video)/,
    ],
    reply: `**Bloccare e segnalare, piattaforma per piattaforma:**\n• **Instagram / Facebook**: tieni premuto sul messaggio o sul profilo → "Segnala" → scegli il motivo (molestie, bullismo). Per bloccare: profilo → "Blocca".\n• **TikTok / YouTube**: sul video o commento → "Segnala"; sul profilo → "Blocca".\n• **WhatsApp**: apri la chat → nome contatto → "Blocca" e "Segnala".\n• **Telegram**: profilo → "Blocca utente" e "Segnala".\n\nPrima di segnalare fai gli **screenshot**: dopo il blocco non vedi più i messaggi. Se la piattaforma non rimuove contenuti gravi, puoi scrivere alla **Polizia Postale** (commissariatodips.it) o al **Garante Privacy** (cyberbullismo@gpdp.it).`,
    chips: ["Come salvo le prove?", "Voglio fare una segnalazione"],
  },
  {
    id: "bullying-definition",
    patterns: [
      /cos.? (e|sono) (il |i )?bullism/,
      /bullismo che cos/,
      /e bullismo o no/,
      /differenza (tra )?(litigio|scherzo)/,
      /come capisco se e bullismo/,
      /quando (e|si chiama) bullismo/,
    ],
    reply: `Il bullismo è quando qualcuno fa del male a un'altra persona **in modo ripetuto**, con parole, gesti o esclusione, e c'è uno squilibrio: chi aggredisce è più "forte" (per numero, età o popolarità) e chi subisce resta solo.\nUn litigio è diverso: capita una volta, tra pari, e si può risolvere. Se invece succede spesso e ti fa stare male, è un problema serio e va affrontato.`,
    chips: ["E il cyberbullismo?", "Cosa devo fare?"],
  },
  {
    id: "cyberbullying-definition",
    patterns: [/cyberbull/, /bullismo online/, /cosa (e|significa) online/, /bullismo sui social/],
    reply: `Il cyberbullismo è bullismo fatto con internet: insulti in chat o nei gruppi, minacce, foto o video condivisi senza permesso, profili falsi, esclusione dai gruppi.\n\n**Cosa fare subito:**\n1. Salva **screenshot** con data e nome dell'account, senza cancellare i messaggi.\n2. **Blocca** la persona e segnala il contenuto alla piattaforma.\n3. Parlane con un **adulto di fiducia**.\n\nNon cancellare la chat: le prove servono se poi intervengono la scuola o la Polizia Postale.`,
    chips: ["Come salvo le prove?", "Mi insultano in un gruppo"],
  },
  {
    id: "harassment-online",
    patterns: [
      /insult/,
      /offend/,
      /minacc/,
      /pres[io] in giro/,
      /mi scrivono|mi scrive/,
      /gruppo (di )?(classe|whatsapp)/,
      /instagram|tiktok|whatsapp|snapchat|telegram|discord/,
      /commenti (cattivi|brutti|offensivi)/,
    ],
    reply: `Quello che descrivi è grave e va preso sul serio, che succeda in chat o in classe.\n\n**Cosa fare adesso:**\n1. **Non rispondere** e non cancellare i messaggi.\n2. Fai **screenshot** con data e nome dell'account.\n3. **Blocca e segnala** la persona sulla piattaforma.\n4. Parlane con un **adulto di fiducia** (genitore, insegnante, referente antibullismo).\n\nSe le minacce sono gravi o ti senti in pericolo, chiama il **112** o il **114**.`,
    chips: ["Come salvo le prove?", "Voglio fare una segnalazione"],
  },
  {
    id: "photos-reshared",
    patterns: [
      /foto (senza permesso|rubat|modificat)/,
      /hanno pubblicato (una mia foto|il mio video|la mia foto)/,
      /meme su di me|mi fanno i meme/,
      /deepfake|foto false|video falso/,
      /condiviso (la mia foto|i miei messaggi)/,
    ],
    reply: `Pubblicare una tua foto o un tuo video senza permesso, o modificarlo per ridicolizzarti, non è uno scherzo: viola la tua privacy e può essere un reato.\n\n**Cosa fare:**\n1. **Screenshot** di tutto (post, commenti, profilo di chi ha pubblicato).\n2. Chiedi la **rimozione** alla piattaforma: quasi tutte hanno un modulo per contenuti che ti riguardano.\n3. Parlane con un **adulto di fiducia**.\n4. Se la foto è intima, **non discuterne online** e chiama subito il **114** o la **Polizia Postale**.`,
    chips: ["Come salvo le prove?", "Voglio fare una segnalazione"],
  },
  {
    id: "group-exclusion",
    patterns: [
      /mi escludono|mi isolano|mi ignorano/,
      /non mi (fanno|invitano)/,
      /mi hanno (tolto|cacciato) dal gruppo/,
      /nessuno mi parla|sto sempre solo|sto sempre sola/,
    ],
    reply: `Essere esclusi fa male quanto un insulto, anche quando nessuno dice niente: si chiama **bullismo relazionale** e conta.\n\n**Cosa puoi fare:**\n1. Dillo a un **adulto di fiducia**: non è "una cosa da niente".\n2. Cerca almeno un posto dove stai bene (sport, gruppo, cugini, un amico di un'altra classe).\n3. Se succede in classe, la scuola può intervenire: chiedi aiuto al coordinatore o allo sportello d'ascolto.\n\nSe ti senti solo anche fuori da scuola, parlane con il tuo medico o chiama il **1.96.96**: stare male per questo è normale, restarci da solo no.`,
    chips: ["Come parlo con un adulto?", "Cosa fa lo sportello d'ascolto?"],
  },
  {
    id: "what-to-do",
    patterns: [
      /cosa (devo |posso )?fare/,
      /come mi difendo|come reagisco/,
      /mi trattano male|mi spingono/,
      /ho subito bullismo|subisco bullismo|mi bullizzano/,
      /mi danno (fastidio|spinte|calci)/,
    ],
    reply: `Mi dispiace che ti stia succedendo questo. Non è colpa tua e non devi affrontarlo da solo.\n\n**Tre passi concreti:**\n1. **Non reagire con la violenza** e non rispondere agli insulti.\n2. **Parlane con un adulto di fiducia**: un genitore, un insegnante, il referente antibullismo o lo sportello d'ascolto.\n3. **Se ti senti in pericolo**, chiama il 112 o il 114 Emergenza Infanzia.\n\nVuoi che ti aiuti a preparare cosa dire?`,
    chips: ["Come parlo con un adulto?", "Voglio fare una segnalazione"],
  },
  {
    id: "proofs",
    patterns: [
      /come salvo/,
      /screenshot/,
      /le prove|conservare le prove|salvare i messaggi/,
      /come faccio a dimostrare/,
    ],
    reply: `**Come salvare le prove** (servono davvero):\n1. Fai screenshot con data e ora visibili.\n2. Salva i messaggi in una cartella, oppure inviali a te stesso via email.\n3. Annota chi era presente e quando è successo.\n4. Non rispondere e non cancellare nulla.\n\nSe i contenuti sono online, segnalali anche alla piattaforma: chiedere la rimozione è un tuo diritto.`,
    chips: ["Voglio fare una segnalazione", "Chi può aiutarmi?"],
  },
  {
    id: "talk-to-adult",
    patterns: [
      /come parlo con un adulto|parlare con un adulto|dirlo ai miei|dirlo a un insegnante|adulto di fiducia/,
      /non so a chi parlare|mi vergogno|non riesco a dirlo/,
      /come dico ai miei genitori/,
    ],
    reply: `Puoi iniziare così, senza preparare un discorso:\n\n**"Mi sta succedendo una cosa a scuola e non riesco a gestirla da solo. Posso parlarti di una cosa personale?"**\n\nSe ti vergogni, va bene: puoi partire da una parte piccola e dire il resto dopo, scriverlo su un biglietto o chiedere a un amico di venire con te.\n\nLe persone adatte sono: un genitore, un insegnante di cui ti fidi, il coordinatore di classe, lo sportello d'ascolto, il referente antibullismo. Se in famiglia non puoi parlare, la scuola e il 114 ci sono comunque.`,
    chips: ["Cosa fa lo sportello d'ascolto?", "Ho paura che peggiori"],
  },
  {
    id: "school",
    patterns: [
      /sportello/,
      /referente antibullismo/,
      /in scuola|dalla scuola|parlare con la scuola|coordinatore|dirigente|preside/,
      /non voglio (piu )?andare a scuola/,
      /paura (di andare a scuola|del lunedi)/,
    ],
    reply: `In ogni scuola dovrebbe esserci uno **sportello d'ascolto** (spesso con uno psicologo) e un **referente antibullismo**. Puoi chiedere in segreteria come prenotare, oppure parlare con il tuo coordinatore di classe o con il dirigente.\n\nAnche se non sei sicuro che sia "abbastanza grave", puoi andare: serve a capire insieme cosa fare. La scuola ha il dovere di proteggere chi subisce.\n\nSe la paura di andare a scuola ti blocca, dillo a casa: non è pigrizia, e si può affrontare con lo sportello o con il medico.`,
    chips: ["Come parlo con un adulto?", "Voglio fare una segnalazione"],
  },
  {
    id: "report-flow",
    patterns: [/segnala/, /denunci/, /come faccio una segnalazione/, /voglio (farla|fare la) segnalazione/],
    reply: `Ti aiuto a preparare una segnalazione scritta. Non serve essere preciso e puoi restare anonimo: ti faccio quattro domande veloci.`,
    startFlow: "report",
  },
  {
    id: "police",
    patterns: [
      /polizia|carabinieri|postale|garante/,
      /sporta querela|denuncia vera|andare dai carabinieri/,
    ],
    reply: `**Come funziona dal lato ufficiale:**\n1. Raccogli fatti, date e prove (screenshot, messaggi).\n2. Un adulto può accompagnarti a presentare denuncia ai Carabinieri o alla Polizia.\n3. Per i reati online c'è la **Polizia Postale** (commissariatodips.it): si può segnalare anche online.\n4. Per contenuti offensivi che i social non rimuovono ci si può rivolgere al **Garante della Privacy** (cyberbullismo@gpdp.it).\n\nIo non invio segnalazioni al posto tuo: ti accompagno a prepararla, ma i fatti vanno portati a una persona vera.`,
    chips: ["Come salvo le prove?", "Voglio fare una segnalazione"],
  },
  {
    id: "friend",
    patterns: [
      /amico|amica|compagno|ho visto|testimone|guardavo|mia sorella|mio fratello/,
      /un mio amico|una mia amica/,
    ],
    reply: `Essere un testimone è importante: chi subisce spesso non parla per vergogna, e un amico che gli crede cambia tutto.\n\n**Cosa puoi fare:**\n1. **Ascolta** senza minimizzare ("ti credo" è già tanto).\n2. **Non filmare e non condividere** nulla: anche girare un video è violenza.\n3. **Aiutalo a parlarne con un adulto** e, se non se la sente, parlane tu con un insegnante.\n\nSe mi racconti cosa sta succedendo, posso aiutarti a capire a chi rivolgerti.`,
    chips: ["Come parlo con un adulto?", "Cosa devo fare?"],
  },
  {
    id: "distress",
    patterns: [
      /paura|ansia|sto male|non dormo|triste|piango|vergogna/,
      /mi sento solo|mi sento sola|depress|non ce la faccio|non ho voglia di niente/,
      /attacchi di panico|non riesco a respirare/,
    ],
    reply: `Quello che provi ha senso, e non è una debolezza.\n\n**Cose che aiutano adesso:** parlarne con un adulto di fiducia, scrivere quello che ti è successo, stare con persone che ti fanno sentire al sicuro, non isolarti a casa con il telefono.\n\nSe la tristezza o l'ansia non ti lasciano in pace, chiedi allo sportello d'ascolto o al tuo medico: puoi anche chiamare il Telefono Azzurro **1.96.96**, gratis e in anonimo.\n\nIo non posso fare diagnosi, ma posso aiutarti a preparare cosa dire.`,
    chips: ["Come parlo con un adulto?", "Chi può aiutarmi?"],
  },
  {
    id: "retaliation",
    patterns: [
      /ritorsion/,
      /peggiora|si vendica|diventa peggio/,
      /paura che (lo|la) scoprano|paura delle conseguenze/,
    ],
    reply: `La paura che peggiori è normale, ed è un motivo in più per non restare da solo: quando un adulto è informato, è lui a occuparsi della protezione, non tu.\n\nPuoi chiedere esplicitamente: **"Vorrei che questa cosa restasse riservata il più possibile e che mi aiutiate a gestirla"**. La scuola e i servizi devono tutelare la tua privacy e non esporti.`,
    chips: ["Come parlo con un adulto?", "Cosa fa lo sportello d'ascolto?"],
  },
  {
    id: "privacy",
    patterns: [
      /anonim/,
      /privacy/,
      /i miei dati|il mio nome|mi riconosc/,
      /qualcuno lo sa/,
      /dove finiscono (le |i )?(mie )?conversazioni|tenete traccia/,
    ],
    reply: `Puoi scrivermi **senza dire il tuo nome**: usa pure un soprannome. Non chiedo cognome, classe o indirizzo.\n\nDue cose oneste: io non faccio segnalazioni automatiche, e le conversazioni restano nel servizio che gestisce questa chat e in chi gestisce il sito; non vengono pubblicate. Se vuoi il massimo della riservatezza, non scrivere i nomi di altre persone.`,
    chips: ["Cosa devo fare?", "Voglio fare una segnalazione"],
  },
  {
    id: "contacts",
    patterns: [
      /chi (puo|mi puo) aiutare/,
      /a chi (mi )?rivolgo/,
      /numeri utili/,
      /telefono azzurro/,
      /114|1\.96\.96/,
    ],
    reply: `Ecco chi risponde davvero, gratis:\n\n• **112** — emergenze, se sei in pericolo adesso.\n• **114** — Emergenza Infanzia, attivo 24 ore su 24.\n• **1.96.96** — Telefono Azzurro, ascolto e supporto psicologico, anche in chat.\n• **Polizia Postale** — cyberbullismo e contenuti online illegali (commissariatodips.it).\n• **Garante Privacy** — per far rimuovere contenuti che i social non tolgono.\n\nE poi c'è la persona di cui ti fidi: un genitore, un insegnante, un allenatore.`,
    chips: ["Cosa devo fare?", "Come parlo con un adulto?"],
  },
  {
    id: "parent-teacher",
    patterns: [
      /sono un genitore|sono un insegnante|mio figlio|mia figlia|come genitore|come insegnante|in classe/,
      /mia madre|mio padre non (mi )?crede|i miei non capiscono/,
    ],
    reply: `Se sei un adulto che vuole aiutare un ragazzo:\n\n1. **Ascolta prima di intervenire**, senza colpevolizzare chi subisce.\n2. **Non togliere il telefono**: serve per le prove e per mantenere la fiducia.\n3. **Documenta** fatti, date e screenshot.\n4. **Coinvolgi la scuola** (coordinatore, referente antibullismo, dirigente) e, se serve, la **Polizia Postale**.\n5. Chiedi supporto psicologico se vedi ritiro, ansia o calo scolastico.\n\nPer i minorenni in pericolo il numero è il **114**, 24 ore su 24.\n\nSe invece sei tu il ragazzo e in casa non ti credono, parlane con un insegnante di cui ti fidi: la scuola può attivarsi anche senza i tuoi genitori.`,
    chips: ["Chi può aiutarmi?", "Come salvo le prove?"],
  },
  {
    id: "account-hacked",
    patterns: [
      /hackerat/,
      /profilo (falso|che usa il mio nome|con il mio nome)/,
      /qualcuno usa il mio account/,
      /mi hanno rubato (l'account|la password|il telefono)/,
    ],
    reply: `**Se qualcuno usa il tuo account o ha creato un profilo falso con il tuo nome:**\n1. Cambia la **password** e attiva la verifica in due passaggi.\n2. Segnala il profilo falso alla piattaforma (profilo → "Segnala" → "Finge di essere me").\n3. Fai **screenshot** del profilo falso e di cosa pubblica.\n4. Avvisa i tuoi contatti che non sei tu, e parlane con un adulto.\n\nSe dal profilo falso arrivano minacce o foto intime, è un reato: **Polizia Postale** (commissariatodips.it) o **114** se sei minorenne.`,
    chips: ["Come salvo le prove?", "Voglio fare una segnalazione"],
  },
  {
    id: "not-your-fault",
    patterns: [
      /e colpa mia|colpa mia/,
      /cosa (non )?devo fare|cosa sbaglio/,
      /mi sento in colpa/,
      /me la sono cercata/,
    ],
    reply: `**Non è colpa tua.** Nessuno merita di essere insultato, minacciato o escluso, qualunque cosa abbia detto o fatto prima.\n\n**Cose che non aiutano:** rispondere con la stessa violenza, cancellare i messaggi (sono prove), affrontare da solo chi ti molesta, o credere che "passerà da sé".\n\n**Cose che aiutano:** parlarne con un adulto, salvare le prove, e non isolarti. Se vuoi, dimmi cosa è successo e vediamo insieme da dove partire.`,
    chips: ["Cosa devo fare?", "Come parlo con un adulto?"],
  },
  {
    id: "how-it-works",
    patterns: [
      /come funziona (safebot|il sito|questa chat)/,
      /chi c e dietro|chi gestisce (il sito|safebot)/,
      /e gratis|quanto costa/,
      /per che eta|quanti anni hai/,
      /serve (un'iscrizione|registrarsi)/,
    ],
    reply: `SafeBot è **gratuito e senza registrazione**: nessun nome, nessuna email, nessun account.\n\nFunziona così: scrivi con parole tue, io riconosco l'argomento e ti do informazioni pratiche (cosa fare, come salvare le prove, come parlarne, a chi rivolgerti). Se la situazione è grave ti porto sempre verso una persona vera.\n\nNon sono una persona e non sostituisco uno psicologo o un insegnante: sono un programma che aiuta a orientarsi. Va bene per ragazzi delle medie e delle superiori, ma anche per genitori e insegnanti.`,
    chips: ["Chi sei?", "Cosa puoi fare?"],
  },
  {
    id: "help",
    patterns: [
      /non so (da dove|come) (iniziare|cominciare)/,
      /aiuto/,
      /^ ?cosa (puoi|sai) fare/,
      /di cosa (possiamo|posso) parlare/,
    ],
    reply: `Partiamo da qui, senza fretta. Puoi raccontarmi solo quello che ti va.\n\nPosso aiutarti su: cosa sono bullismo e cyberbullismo, cosa fare se succede a te o a un amico, come salvare le prove, come parlarne con un adulto, come preparare una segnalazione e quali numeri chiamare.`,
    chips: ["Mi insultano online", "Un mio amico sta male", "Voglio fare una segnalazione"],
  },
  {
    id: "thanks",
    patterns: [/grazie|ti ringrazio|sei stato utile/],
    reply: `Sono contento di essere stato utile. Ricorda la cosa più importante: **non devi affrontare questa cosa da solo**.\n\nSe vuoi, possiamo ancora vedere come dirlo a un adulto o cosa mettere in una segnalazione.`,
    chips: ["Come parlo con un adulto?", "Voglio fare una segnalazione"],
  },
  {
    id: "greeting",
    patterns: [/^ ?(ciao|salve|ehi|hey|buongiorno|buonasera)\b/, /come stai/],
    reply: `Ciao 👋 Sono contento che tu sia qui. Di cosa hai voglia di parlare?\n\nPuoi scrivermi anche solo "non so da dove iniziare": partiamo da lì.`,
    chips: ["Ho subito bullismo", "Mi insultano online", "Un mio amico sta male"],
  },
];

/* Risposta quando non si capisce l'argomento. */
const FALLBACK = {
  reply: `Non sono sicuro di aver capito bene, scusami. Puoi raccontarmelo con altre parole?\n\nPosso aiutarti su: bullismo e cyberbullismo, cosa fare, salvare le prove, parlarne con un adulto, preparare una segnalazione, numeri utili.`,
  chips: ["Cosa è il bullismo?", "Mi insultano online", "Voglio fare una segnalazione", "Chi può aiutarmi?"],
};

/* Richieste fuori tema: risposta chiara invece di un "non ho capito". */
const OFF_TOPIC = {
  patterns: [
    /ricetta|cucinare|calcio|partita di|oroscopo|meteo/,
    /scrivimi (un tema|una poesia|un codice|un programma)/,
    /traduci|calcola|equazione|compiti di matematica/,
    /fammi (ridere|una barzelletta)/,
  ],
  reply: `Su questo non ti posso aiutare: sono fatto per bullismo e cyberbullismo, non sono un assistente generico e non faccio i compiti.\n\nSe invece c'entra qualcosa con come stai o con quello che ti succede a scuola o online, scrivimelo pure: su quello so essere utile. ${TEL_NOTE}`,
  chips: ["Cosa è il bullismo?", "Mi insultano online", "Chi può aiutarmi?"],
};

/* Flusso guidato: prepara una segnalazione scritta in 4 domande. */
const FLOWS = {
  report: {
    steps: [
      {
        key: "anonimo",
        question: "**1 di 4 — Vuoi restare anonimo?**",
        chips: ["Sì, anonimo", "No, dico il mio nome"],
      },
      {
        key: "fatto",
        question: "**2 di 4 — Cosa è successo?** Scrivilo con parole tue, anche poche righe.",
      },
      {
        key: "quando",
        question: "**3 di 4 — Quando** è successo?",
        chips: ["Oggi", "Questa settimana", "Da mesi"],
      },
      {
        key: "prove",
        question: "**4 di 4 — Hai prove?** (screenshot, messaggi, testimoni)",
        chips: ["Sì, ho screenshot", "Non ho prove"],
      },
    ],
    finish: (data) =>
      `Ecco la tua segnalazione pronta da mostrare a un adulto:\n\n• **Anonima:** ${data.anonimo}\n• **Cosa è successo:** ${data.fatto}\n• **Quando:** ${data.quando}\n• **Prove:** ${data.prove}\n\n**Cosa fare adesso:** consegnala a un adulto di fiducia o al referente antibullismo della scuola. Se il fatto è grave o continua online, un adulto può accompagnarti alla Polizia Postale.\n\nPuoi anche usare il modulo **"Prepara una segnalazione"** più in basso nella pagina: arriva direttamente a chi gestisce SafeBot.`,
    chips: ["Come parlo con un adulto?", "Come salvo le prove?"],
  },
};
