import { Elysia, t } from "elysia";
import { CloudflareService } from "../services/cloudflare-service";

export const domainsRoutes = new Elysia({ prefix: "/domains" }).get(
  "/check",
  async ({ query }) => {
    const { subdomain } = query;
    try {
      const isAvailable = await CloudflareService.checkSubdomain(subdomain);
      return { available: isAvailable };
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  {
    query: t.Object({
      subdomain: t.String({ minLength: 1 }),
    }),
  },
);
