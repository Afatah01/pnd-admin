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

// ─── OFFICER DATA (synced with officer-router.ts) ───
const OFFICERS = [
  { id: 1, badgeNumber: "4521", firstName: "Mohamed", lastName: "Hassan", rank: "colonel", stationId: 1, stationName: "Commissariat Central", phone: "+253 77 12 34 56", email: "m.hassan@pnd.gov.dj", status: "active", joinDate: "2015-03-15" },
  { id: 2, badgeNumber: "3187", firstName: "Ahmed", lastName: "Omar", rank: "brigadier", stationId: 1, stationName: "Commissariat Central", phone: "+253 77 23 45 67", email: "a.omar@pnd.gov.dj", status: "active", joinDate: "2018-07-22" },
  { id: 3, badgeNumber: "7214", firstName: "Fatima", lastName: "Daher", rank: "chief_inspector", stationId: 2, stationName: "Poste de Police Balbala", phone: "+253 77 34 56 78", email: "f.daher@pnd.gov.dj", status: "active", joinDate: "2016-11-08" },
  { id: 4, badgeNumber: "1845", firstName: "Ismail", lastName: "Robleh", rank: "inspector", stationId: 3, stationName: "Poste de Police Plateau", phone: "+253 77 45 67 89", email: "i.robleh@pnd.gov.dj", status: "active", joinDate: "2021-01-10" },
  { id: 5, badgeNumber: "6392", firstName: "Ayaan", lastName: "Guelleh", rank: "superintendent", stationId: 1, stationName: "Commissariat Central", phone: "+253 77 56 78 90", email: "a.guelleh@pnd.gov.dj", status: "on_leave", joinDate: "2017-05-30" },
  { id: 6, badgeNumber: "5103", firstName: "Yacin", lastName: "Bourhan", rank: "sergeant", stationId: 2, stationName: "Poste de Police Balbala", phone: "+253 77 67 89 01", email: "y.bourhan@pnd.gov.dj", status: "active", joinDate: "2019-09-14" },
  { id: 7, badgeNumber: "2478", firstName: "Hodan", lastName: "Kamil", rank: "inspector", stationId: 4, stationName: "Poste de Police Ali Sabieh", phone: "+253 77 78 90 12", email: "h.kamil@pnd.gov.dj", status: "active", joinDate: "2022-03-01" },
  { id: 8, badgeNumber: "8631", firstName: "Said", lastName: "Egueh", rank: "brigadier", stationId: 5, stationName: "Poste de Police Tadjourah", phone: "+253 77 89 01 23", email: "s.egueh@pnd.gov.dj", status: "suspended", joinDate: "2014-12-20" },
];

const app = new Hono<{ Bindings: HttpBindings }>();

// Enable CORS for mobile app
app.use("*", cors({ origin: "*", allowMethods: ["GET", "POST", "OPTIONS"], allowHeaders: ["*"] }));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// ─── PUBLIC REST API for Mobile App ───
app.get("/api/officers", (c) => {
  const active = OFFICERS.filter(o => o.status === "active");
  return c.json({ officers: active, total: active.length });
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
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
