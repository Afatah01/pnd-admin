import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import { DEMO_OFFICERS } from "./officer-router";

const app = new Hono<{ Bindings: HttpBindings }>();

// Enable CORS for mobile app
app.use("*", cors({ origin: "*", allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowHeaders: ["*"] }));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// ─── PUBLIC REST API for Mobile App ───

// Get all active officers (for mobile login screen)
app.get("/api/officers", (c) => {
  const active = DEMO_OFFICERS.filter(o => o.status === "active").map(o => ({
    id: o.id,
    badgeNumber: o.badgeNumber,
    firstName: o.firstName,
    lastName: o.lastName,
    rank: o.rank,
    stationName: o.stationName,
    status: o.status,
  }));
  return c.json({ officers: active, total: active.length });
});

// Mobile officer login (POST with badge + authCode)
app.post("/api/auth/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { badgeNumber, authCode } = body;

  if (!badgeNumber || !authCode) {
    return c.json({ success: false, error: "Badge number and auth code required" }, 400);
  }

  const officer = DEMO_OFFICERS.find(
    o => o.badgeNumber === badgeNumber && o.authCode === authCode && o.status === "active"
  );

  if (!officer) {
    return c.json({ success: false, error: "Invalid badge number or auth code" }, 401);
  }

  return c.json({
    success: true,
    officer: {
      id: officer.id,
      badgeNumber: officer.badgeNumber,
      firstName: officer.firstName,
      lastName: officer.lastName,
      rank: officer.rank,
      stationName: officer.stationName,
    },
    token: `pnd_token_${officer.badgeNumber}_${Date.now()}`,
  });
});

// tRPC handler
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// 404 fallback
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
