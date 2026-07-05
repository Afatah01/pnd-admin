import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

// ─── REPORT DATA — starts empty, reports created via mobile app ───
export let DEMO_REPORTS: any[] = [];

export const reportRouter = createRouter({
  list: publicQuery
    .input(z.object({
      status: z.string().optional(),
      severity: z.string().optional(),
      search: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      let reports = [...DEMO_REPORTS];
      if (input?.status) reports = reports.filter(r => r.status === input.status);
      if (input?.severity) reports = reports.filter(r => r.severity === input.severity);
      if (input?.search) reports = reports.filter(r => r.location.toLowerCase().includes(input.search.toLowerCase()) || r.reportId.toLowerCase().includes(input.search.toLowerCase()));
      return { reports, total: reports.length };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const report = DEMO_REPORTS.find(r => r.id === input.id);
      if (!report) throw new Error("Report not found");
      return { ...report, vehicles: [], drivers: [], victims: [], witnesses: [], evidence: [], measurements: [] };
    }),

  stats: publicQuery.query(async () => {
    const total = DEMO_REPORTS.length;
    const submitted = DEMO_REPORTS.filter(r => r.status === "submitted").length;
    const underReview = DEMO_REPORTS.filter(r => r.status === "under_review").length;
    const approved = DEMO_REPORTS.filter(r => r.status === "approved").length;
    const rejected = DEMO_REPORTS.filter(r => r.status === "rejected").length;
    const fatal = DEMO_REPORTS.filter(r => r.severity === "fatal").length;
    const serious = DEMO_REPORTS.filter(r => r.severity === "serious").length;
    const moderate = DEMO_REPORTS.filter(r => r.severity === "moderate").length;
    const minor = DEMO_REPORTS.filter(r => r.severity === "minor").length;
    const today = DEMO_REPORTS.filter(r => r.accidentDate === "2026-07-05").length;
    const thisMonth = DEMO_REPORTS.filter(r => r.accidentDate >= "2026-07-01").length;
    return {
      total,
      today,
      thisMonth,
      byStatus: [
        { status: "submitted", count: submitted },
        { status: "under_review", count: underReview },
        { status: "approved", count: approved },
        { status: "rejected", count: rejected },
        { status: "draft", count: 0 },
      ],
      bySeverity: [
        { severity: "fatal", count: fatal },
        { severity: "serious", count: serious },
        { severity: "moderate", count: moderate },
        { severity: "minor", count: minor },
      ],
    };
  }),

  create: publicQuery
    .input(z.object({
      reportId: z.string(),
      location: z.string(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      accidentDate: z.string(),
      accidentTime: z.string(),
      severity: z.string(),
      accidentType: z.string(),
      weather: z.string().optional(),
      roadCondition: z.string().optional(),
      description: z.string().optional(),
      officerId: z.number(),
      stationId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const newReport = {
        id: DEMO_REPORTS.length + 1,
        ...input,
        status: "submitted",
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      DEMO_REPORTS.unshift(newReport);
      return newReport;
    }),

  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      const report = DEMO_REPORTS.find(r => r.id === input.id);
      if (report) report.status = input.status as any;
      return report;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const idx = DEMO_REPORTS.findIndex(r => r.id === input.id);
      if (idx > -1) DEMO_REPORTS.splice(idx, 1);
      return { success: true };
    }),
});
