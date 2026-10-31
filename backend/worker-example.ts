// Esempio base di Worker per cercare lead (da estendere con API reali)
// Usa Google Places o altre fonti pubbliche

export interface Env {
  // Aggiungi bindings se necessario (es. KV per salvare lead)
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/search") {
      const settore = url.searchParams.get("settore") || "agenzia marketing";
      const zona = url.searchParams.get("zona") || "Milano";

      // Qui in futuro: chiamata a Google Places API o scraping etico
      const esempioLead = [
        {
          nome: "Agenzia Esempio SRL",
          settore: settore,
          zona: zona,
          motivo: "Gestisce molti clienti e contenuti → potrebbe aver bisogno di AI per automatizzare",
          contatti: "email@esempio.it (da arricchire)"
        }
      ];

      return new Response(JSON.stringify({ leads: esempioLead, nota: "Prototipo: sostituisci con ricerca reale" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("AI Lead Finder - usa /search?settore=...&zona=...");
  }
};
