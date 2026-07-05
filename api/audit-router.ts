import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

let DEMO_LOGS: any[] = [];

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
