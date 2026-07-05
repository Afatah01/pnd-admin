import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export const analyticsRouter = createRouter({
  executive: publicQuery.query(async () => {
    return {
      totalReports: 18,
      thisMonth: 7,
      changePercent: 12,
      pendingReview: 3,
      approved: 13,
      activeOfficers: 6,
      responseTime: 14,
      fatalities: 3,
    };
  }),

  timeSeries: publicQuery
    .input(z.object({
      period: z.string().default("30d"),
      groupBy: z.string().default("day"),
    }).optional())
    .query(async ({ input }) => {
      return [
        { date: "2026-06-07", count: 1, severity: "fatal" },
        { date: "2026-06-10", count: 1, severity: "moderate" },
        { date: "2026-06-13", count: 1, severity: "minor" },
        { date: "2026-06-17", count: 1, severity: "moderate" },
        { date: "2026-06-20", count: 1, severity: "serious" },
        { date: "2026-06-23", count: 1, severity: "moderate" },
        { date: "2026-06-25", count: 1, severity: "serious" },
        { date: "2026-06-27", count: 1, severity: "minor" },
        { date: "2026-06-28", count: 1, severity: "moderate" },
        { date: "2026-06-29", count: 1, severity: "fatal" },
        { date: "2026-06-30", count: 1, severity: "serious" },
        { date: "2026-07-01", count: 1, severity: "minor" },
        { date: "2026-07-02", count: 1, severity: "moderate" },
        { date: "2026-07-03", count: 2, severity: "serious" },
        { date: "2026-07-04", count: 2, severity: "fatal" },
        { date: "2026-07-05", count: 1, severity: "serious" },
      ];
    }),

  hotspots: publicQuery.query(async () => {
    return [
      { latitude: 11.5721, longitude: 43.1456, severity: "serious", count: 3, location: "Boulevard de la Republique" },
      { latitude: 11.5480, longitude: 43.1600, severity: "fatal", count: 2, location: "Route de l'Aeroport" },
      { latitude: 11.5900, longitude: 43.1200, severity: "moderate", count: 2, location: "Rue de Balbala" },
      { latitude: 11.5350, longitude: 43.1550, severity: "serious", count: 1, location: "Route d'Ambouli" },
      { latitude: 11.5800, longitude: 43.1480, severity: "moderate", count: 2, location: "Avenue 26 Juin" },
      { latitude: 11.5750, longitude: 43.1420, severity: "serious", count: 1, location: "Rue d'Ethiopie" },
      { latitude: 11.5850, longitude: 43.1500, severity: "moderate", count: 1, location: "Boulevard Hassan Gouled" },
    ];
  }),

  officerPerformance: publicQuery.query(async () => {
    return [
      { officerId: 1, name: "Mohamed Hassan", badgeNumber: "4521", reportsHandled: 4, avgResponseTime: 12 },
      { officerId: 2, name: "Ahmed Omar", badgeNumber: "3187", reportsHandled: 4, avgResponseTime: 15 },
      { officerId: 3, name: "Fatima Daher", badgeNumber: "7214", reportsHandled: 3, avgResponseTime: 18 },
      { officerId: 4, name: "Ismail Robleh", badgeNumber: "1845", reportsHandled: 2, avgResponseTime: 22 },
      { officerId: 6, name: "Yacin Bourhan", badgeNumber: "5103", reportsHandled: 2, avgResponseTime: 20 },
      { officerId: 7, name: "Hodan Kamil", badgeNumber: "2478", reportsHandled: 2, avgResponseTime: 25 },
      { officerId: 5, name: "Ayaan Guelleh", badgeNumber: "6392", reportsHandled: 1, avgResponseTime: 14 },
      { officerId: 8, name: "Said Egueh", badgeNumber: "8631", reportsHandled: 1, avgResponseTime: 30 },
    ];
  }),
});
