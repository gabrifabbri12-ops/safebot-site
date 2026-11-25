# SafeBot — sito ufficiale

Sito one-page di **SafeBot**, supporto online contro bullismo e cyberbullismo, con la
chat AI che aiuta a capire cosa fare, come salvare le prove e a chi rivolgersi.

Indirizzo del sito: **https://botsafe.netlify.app/**

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
| `src/chat/intents.js` | gli argomenti che la chat riconosce: parole chiave, risposte, suggerimenti |
| `src/chat/engine.js` | il motore della chat: riconoscimento, priorità delle emergenze, modulo di segnalazione |
| `src/robots.txt`, `src/sitemap.xml` | file per i motori di ricerca |
| `src/botpress.config.js` | configurazione della chat esterna (spenta: vedi sotto) |
| `static/` | immagine Open Graph (og.png) in formato testo base64 |
| `build.mjs` | mette insieme tutto dentro `dist/` |

## Modificare una risposta della chat

Apri `src/chat/intents.js`, cerca l'argomento (per esempio `"proofs"`), cambia il testo
dentro `reply` e salva. Il grassetto si scrive con `**due asterischi**`, gli a capo con
`\n`. Se aggiungi un argomento nuovo, mettilo **dopo** `crisis` e `danger-now` ma prima
degli argomenti generici: l'ordine conta.

Il motore controlla sempre prima le frasi di emergenza (autolesionismo, pericolo
immediato, ricatti), poi riconosce l'argomento con più parole chiave, poi le richieste
fuori tema e solo alla fine dice "non ho capito".

## Segnalazioni

Il modulo "Prepara una segnalazione" usa **Netlify Forms**: le segnalazioni arrivano
nella dashboard di Netlify del proprietario del sito, senza server e senza chiavi.

Per riceverle via email: Netlify → **Forms** → **segnalazione** → **Notifications** →
*Add notification* → *Email notification*.

## Immagini e stile

`og.png` sta in `static/` come testo base64 (due parti), il build lo trasforma in
immagine. Il CSS e la favicon vengono presi dal sito attuale durante il build; per
averli nel repository basta copiarli in `static/` con lo stesso nome
(`index-xSUd54VX.css`, `favicon.ico`).

## Collegare una chat con AI generativa (opzionale)

Il sito è già pronto: `src/botpress.config.js` contiene gli spazi `botId` e `clientId`.
Se li compili, la chat a regole viene sostituita dalla webchat di Botpress.

1. Crea il bot su botpress.com e carica le informazioni su bullismo, numeri utili e
   procedure di segnalazione come knowledge base.
2. Nel pannello del bot: **Webchat → Deploy settings** → copia `botId` e `clientId`.
3. Incollali in `src/botpress.config.js`, salva, fai commit: Netlify ripubblica.

I due codici sono identificatori pubblici (finiscono nella pagina), non sono chiavi
segrete.
