import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const KEY = "trip-items";

export default async (req: Request, context: Context) => {
  const store = getStore("trip-planner");

  if (req.method === "GET") {
    const data = await store.get(KEY, { type: "text" });
    return new Response(data ?? "", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const body = await req.text();
    try {
      JSON.parse(body);
    } catch {
      return new Response(JSON.stringify({ error: "invalid json" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    await store.set(KEY, body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/trip-data",
};
