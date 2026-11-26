# SafeBot — sito ufficiale

Sito one-page di **SafeBot**, supporto online contro bullismo e cyberbullismo, con la
chat che aiuta a capire cosa fare, come salvare le prove e a chi rivolgersi.

Indirizzo del sito: **https://botsafe.netlify.app/**
Sitemap: **https://botsafe.netlify.app/sitemap.xml**

## Comandi

```bash
node build.mjs     # prepara la cartella dist/
```

Non serve installare niente: il progetto non ha dipendenze.

## Deploy

Netlify: build `node build.mjs`, publish directory `dist` (già scritti in `netlify.toml`).

## Come è fatto

| Percorso | Cosa contiene |
| --- | --- |
| `src/page/part1-3.html` | la pagina, divisa in tre parti che il build riunisce in `index.html` |
| `src/chat/intents.js` | gli argomenti principali della chat: parole chiave, risposte, suggerimenti |
| `src/chat/intents-extra.js` | altri argomenti e le parole chiave usate per capire anche i refusi |
| `src/chat/engine.js` | il motore della chat: riconoscimento, priorità delle emergenze, modulo di segnalazione |
| `src/styles/chat.css` | ritocchi di stile per leggere la chat dal telefono |
| `src/robots.txt`, `src/sitemap.xml` | file per i motori di ricerca |
| `src/botpress.config.js` | configurazione della chat esterna (facoltativa) |
| `SEGNALAZIONI.txt` | registro delle segnalazioni ricevute, in formato testo |
| `static/` | immagine Open Graph (og.png) in formato testo base64 |
| `build.mjs` | mette insieme tutto dentro `dist/` |

## Modificare una risposta della chat

Apri `src/chat/intents.js` (o `intents-extra.js`), cerca l'argomento (per esempio
`"proofs"`), cambia il testo dentro `reply` e salva. Il grassetto si scrive con
`**due asterischi**`, gli a capo con `\n`. Se aggiungi un argomento nuovo, mettilo
**dopo** `crisis` e `danger-now` ma prima degli argomenti generici: a parità di
corrispondenze vince quello scritto prima. Ogni argomento nuovo va aggiunto anche a
`PAROLE` in `intents-extra.js` con le sue parole chiave.

Il motore controlla sempre prima le frasi di emergenza (autolesionismo, pericolo
immediato, ricatti), poi riconosce l'argomento con più segnali (espressioni regolari e
parole chiave, anche con una lettera sbagliata), poi le richieste fuori tema e solo
alla fine dice "non ho capito". Se non capisce al primo colpo resta sull'argomento
precedente; al secondo propone i numeri utili.

Righe che iniziano con `•` o con `1.` diventano elenchi veri nella chat: è il modo più
leggibile per le risposte lunghe sul telefono.

## Segnalazioni

Il modulo "Prepara una segnalazione" invia a **Netlify Forms**: le segnalazioni sono
conservate nella dashboard di Netlify del proprietario del sito, senza server e senza
chiavi. Non esiste alcun collegamento a fogli di lavoro o servizi esterni.

Per riceverle via email: Netlify → **Forms** → **segnalazione** → **Notifications** →
*Add notification* → *Email notification*.

Per averle in un file di testo: Netlify → **Forms** → **segnalazione** →
**Download as CSV** (è un file di testo) e incolla il contenuto in `SEGNALAZIONI.txt`,
dove ogni segnalazione ha il suo blocco con data, contatto, testo, prove e stato.
Il sito è statico e non può scrivere file da solo: quel file è la copia locale.

## Immagini e stile

`og.png` sta in `static/` come testo base64 (quattro parti: `.part1` … `.part4`),
il build lo trasforma in immagine. Il CSS e la favicon vengono presi dal sito
attuale durante il build; per averli nel repository basta copiarli in `static/`
con lo stesso nome (`index-xSUd54VX.css`, `favicon.ico`).

## Collegare una chat con AI generativa (opzionale)

Il sito è già pronto: `src/botpress.config.js` contiene gli spazi `botId` e `clientId`.
Se li compili, la chat a regole viene sostituita dalla webchat di Botpress.

1. Crea il bot su botpress.com e carica le informazioni su bullismo, numeri utili e
   procedure di segnalazione come knowledge base.
2. Nel pannello del bot: **Webchat → Deploy settings** → copia `botId` e `clientId`.
3. Incollali in `src/botpress.config.js`, salva, fai commit: Netlify ripubblica.

I due codici sono identificatori pubblici (finiscono nella pagina), non sono chiavi
segrete.
