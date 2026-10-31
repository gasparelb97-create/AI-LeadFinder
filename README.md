# AI Lead Finder

Prototipo generico per trovare clienti reali interessati a servizi di Intelligenza Artificiale.

## Obiettivo
Cercare aziende e professionisti da fonti pubbliche, filtrarli in base a segnali di bisogno di AI, salvarli e preparare messaggi personalizzati per contattarli in modo controllato e legale.

## Struttura prevista
- `backend/` — Logica di ricerca lead (Cloudflare Worker o Node)
- `frontend/` — Interfaccia semplice (web o Android)
- `data/` — Esempi di lead e template messaggi

## Fonti di lead (legali)
- Google Places API (negozi, aziende locali)
- Directory pubbliche
- Siti web aziendali (scraping etico con limiti)
- LinkedIn (solo dati pubblici + rispetto ToS)

## Flusso
1. Definisci settore + zona
2. L'app cerca lead
3. Filtra quelli con segnali di bisogno AI (es. e-commerce, customer service, content)
4. Salva contatti
5. Genera messaggio personalizzato
6. Contatto controllato (con opt-out e limiti)

## Stato
Prototipo iniziale. Prossimi passi: implementare ricerca base e interfaccia.
