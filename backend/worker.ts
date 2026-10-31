// Cloudflare Worker per AI Lead Finder
// Salva lead, traccia aperture email con pixel, prepara invio

export interface Env {
  LEADS?: KVNamespace;
}

type Lead = {
  id: string;
  nome: string;
  zona: string;
  settore: string;
  email?: string;
  status: string;
  createdAt: string;
  openedAt?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Tracking pixel per "ha visto"
    if (url.pathname.startsWith("/track/")) {
      const id = url.pathname.split("/")[2];
      if (id && env.LEADS) {
        const raw = await env.LEADS.get("lead:" + id);
        if (raw) {
          const lead = JSON.parse(raw) as Lead;
          if (!lead.openedAt) {
            lead.openedAt = new Date().toISOString();
            lead.status = "visto";
            await env.LEADS.put("lead:" + id, JSON.stringify(lead));
          }
        }
      }
      // Pixel trasparente 1x1
      const pixel = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b]);
      return new Response(pixel, {
        headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" }
      });
    }

    // Salva o aggiorna un lead
    if (request.method === "POST" && url.pathname === "/lead") {
      if (!env.LEADS) return json({ error: "KV non configurato" }, 500);
      const body = await request.json() as Partial<Lead>;
      const id = body.id || crypto.randomUUID();
      const lead: Lead = {
        id,
        nome: body.nome || "Senza nome",
        zona: body.zona || "",
        settore: body.settore || "",
        email: body.email,
        status: body.status || "da-contattare",
        createdAt: new Date().toISOString()
      };
      await env.LEADS.put("lead:" + id, JSON.stringify(lead));
      return json({ ok: true, id, trackingUrl: url.origin + "/track/" + id });
    }

    // Lista lead
    if (request.method === "GET" && url.pathname === "/leads") {
      if (!env.LEADS) return json({ leads: [] });
      const list = await env.LEADS.list({ prefix: "lead:" });
      const leads: Lead[] = [];
      for (const key of list.keys) {
        const raw = await env.LEADS.get(key.name);
        if (raw) leads.push(JSON.parse(raw));
      }
      return json({ leads });
    }

    return json({ ok: true, service: "AI Lead Finder Worker", endpoints: ["/lead", "/leads", "/track/{id}"] });
  }
};
