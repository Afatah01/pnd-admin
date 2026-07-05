import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

const DEMO_LOGS = [
  { id: 1, userId: 1, action: "LOGIN", resource: "system", resourceId: "1", details: "Admin login successful", ipAddress: "196.201.7.12", createdAt: new Date("2026-07-05T06:30:00") },
  { id: 2, userId: 2, action: "REPORT_SUBMIT", resource: "report", resourceId: "RPT-2025-0038", details: "New accident report submitted via mobile app", ipAddress: "196.201.7.45", createdAt: new Date("2026-07-05T08:45:00") },
  { id: 3, userId: 1, action: "REPORT_APPROVE", resource: "report", resourceId: "RPT-2025-0037", details: "Report approved by Col. Hassan", ipAddress: "196.201.7.12", createdAt: new Date("2026-07-04T16:00:00") },
  { id: 4, userId: 3, action: "REPORT_SUBMIT", resource: "report", resourceId: "RPT-2025-0036", details: "New accident report from Balbala market", ipAddress: "196.201.7.88", createdAt: new Date("2026-07-04T12:00:00") },
  { id: 5, userId: 1, action: "OFFICER_UPDATE", resource: "officer", resourceId: "4521", details: "Updated officer assignment for Col. Hassan", ipAddress: "196.201.7.12", createdAt: new Date("2026-07-03T14:20:00") },
  { id: 6, userId: 4, action: "REPORT_SUBMIT", resource: "report", resourceId: "RPT-2025-0035", details: "Roundabout collision report filed", ipAddress: "196.201.7.33", createdAt: new Date("2026-07-03T19:35:00") },
  { id: 7, userId: 1, action: "EXPORT", resource: "analytics", resourceId: "monthly", details: "Monthly analytics report exported to PDF", ipAddress: "196.201.7.12", createdAt: new Date("2026-07-02T10:00:00") },
  { id: 8, userId: 2, action: "REPORT_APPROVE", resource: "report", resourceId: "RPT-2025-0034", details: "Ambouli multi-vehicle crash approved", ipAddress: "196.201.7.45", createdAt: new Date("2026-07-03T10:00:00") },
  { id: 9, userId: 1, action: "SETTINGS_UPDATE", resource: "settings", resourceId: "notifications", details: "Updated notification preferences", ipAddress: "196.201.7.12", createdAt: new Date("2026-07-01T09:15:00") },
  { id: 10, userId: 5, action: "LOGIN", resource: "system", resourceId: "5", details: "Officer Guelleh logged in", ipAddress: "196.201.7.67", createdAt: new Date("2026-06-30T08:00:00") },
];

export const auditRouter = createRouter({
  list: publicQuery
    .input(z.object({
      action: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      let logs = [...DEMO_LOGS];
      if (input?.action) logs = logs.filter(l => l.action === input.action);
      if (input?.search) logs = logs.filter(l => l.details.toLowerCase().includes(input.search!.toLowerCase()) || l.resourceId.toLowerCase().includes(input.search!.toLowerCase()));
      return { logs, total: logs.length };
    }),

  create: publicQuery
    .input(z.object({
      action: z.string(),
      resource: z.string(),
      resourceId: z.string(),
      details: z.string(),
    }))
    .mutation(async ({ input }) => {
      const newLog = {
        id: DEMO_LOGS.length + 1,
        userId: 1,
        ...input,
        ipAddress: "196.201.7.12",
        createdAt: new Date(),
      };
      DEMO_LOGS.unshift(newLog);
      return newLog;
    }),
});
