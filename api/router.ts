import { authRouter } from "./auth-router";
import { reportRouter } from "./report-router";
import { officerRouter } from "./officer-router";
import { analyticsRouter } from "./analytics-router";
import { auditRouter } from "./audit-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  report: reportRouter,
  officer: officerRouter,
  analytics: analyticsRouter,
  audit: auditRouter,
});

export type AppRouter = typeof appRouter;
