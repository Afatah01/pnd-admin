import { z } from "zod";
import { eq, desc, and, gte, lte, like, count } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  accidentReports, vehicles, drivers, victims, witnesses, evidence, measurements,
} from "../db/schema";

// ─── REALISTIC DEMO DATA ───
const DEMO_REPORTS = [
  { id: 1, reportId: "RPT-2025-0038", location: "Boulevard de la Republique, near Total station", latitude: 11.5721, longitude: 43.1456, accidentDate: "2026-07-05", accidentTime: "08:30", severity: "serious", status: "submitted", weather: "Clear", roadCondition: "Dry", accidentType: "head_on_collision", description: "Head-on collision between two taxis at intersection. Both vehicles sustained heavy damage.", officerId: 1, stationId: 1, createdBy: 1, createdAt: new Date("2026-07-05T08:45:00"), updatedAt: new Date("2026-07-05T08:45:00") },
  { id: 2, reportId: "RPT-2025-0037", location: "Route de l'Aeroport, km 5", latitude: 11.5480, longitude: 43.1600, accidentDate: "2026-07-04", accidentTime: "14:15", severity: "fatal", status: "approved", weather: "Khamsin Wind", roadCondition: "Sand Dust Debris", accidentType: "rollover", description: "Truck rollover due to strong crosswinds. Cargo spilled across roadway. One fatality confirmed.", officerId: 2, stationId: 1, createdBy: 1, createdAt: new Date("2026-07-04T14:30:00"), updatedAt: new Date("2026-07-04T16:00:00") },
  { id: 3, reportId: "RPT-2025-0036", location: "Rue de Balbala, market entrance", latitude: 11.5900, longitude: 43.1200, accidentDate: "2026-07-04", accidentTime: "11:45", severity: "moderate", status: "under_review", weather: "Clear", roadCondition: "Dry", accidentType: "pedestrian_strike", description: "Pedestrian struck by motorcycle in market area. Victim transported to Peltier Hospital.", officerId: 3, stationId: 2, createdBy: 1, createdAt: new Date("2026-07-04T12:00:00"), updatedAt: new Date("2026-07-04T12:00:00") },
  { id: 4, reportId: "RPT-2025-0035", location: "Plateau du Serpent, roundabout", latitude: 11.5780, longitude: 43.1520, accidentDate: "2026-07-03", accidentTime: "19:20", severity: "minor", status: "approved", weather: "Night — Illuminated", roadCondition: "Wet", accidentType: "side_impact_collision", description: "Sideswipe collision at roundabout. Minor damage to both vehicles. No injuries.", officerId: 4, stationId: 3, createdBy: 1, createdAt: new Date("2026-07-03T19:35:00"), updatedAt: new Date("2026-07-03T20:00:00") },
  { id: 5, reportId: "RPT-2025-0034", location: "Route d'Ambouli, near Camp Lemonnier gate", latitude: 11.5350, longitude: 43.1550, accidentDate: "2026-07-03", accidentTime: "07:00", severity: "serious", status: "approved", weather: "Fog/Mist", roadCondition: "Slippery", accidentType: "multi_vehicle_pile_up", description: "Multi-vehicle pile-up (4 cars) in foggy conditions. Three people injured, road closed 3 hours.", officerId: 1, stationId: 1, createdBy: 1, createdAt: new Date("2026-07-03T07:15:00"), updatedAt: new Date("2026-07-03T10:00:00") },
  { id: 6, reportId: "RPT-2025-0033", location: "Avenue 26 Juin, central district", latitude: 11.5800, longitude: 43.1480, accidentDate: "2026-07-02", accidentTime: "16:45", severity: "moderate", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "rear_end_collision", description: "Rear-end collision at traffic light. Second vehicle failed to stop. Whiplash injuries reported.", officerId: 2, stationId: 1, createdBy: 1, createdAt: new Date("2026-07-02T17:00:00"), updatedAt: new Date("2026-07-02T18:00:00") },
  { id: 7, reportId: "RPT-2025-0032", location: "Route de Doraleh, port access road", latitude: 11.5100, longitude: 43.1300, accidentDate: "2026-07-01", accidentTime: "09:10", severity: "minor", status: "submitted", weather: "Saba Wind", roadCondition: "Dry", accidentType: "side_impact_collision", description: "Minor collision between private car and port truck. Fender damage only.", officerId: 6, stationId: 2, createdBy: 1, createdAt: new Date("2026-07-01T09:25:00"), updatedAt: new Date("2026-07-01T09:25:00") },
  { id: 8, reportId: "RPT-2025-0031", location: "Rue d'Ethiopie, commercial district", latitude: 11.5750, longitude: 43.1420, accidentDate: "2026-06-30", accidentTime: "13:30", severity: "serious", status: "approved", weather: "Clear", roadCondition: "Under Repair", accidentType: "single_vehicle_crash", description: "Motorcyclist lost control on uneven road surface. Severe injuries, victim in critical condition.", officerId: 3, stationId: 1, createdBy: 1, createdAt: new Date("2026-06-30T13:45:00"), updatedAt: new Date("2026-06-30T15:00:00") },
  { id: 9, reportId: "RPT-2025-0030", location: "Route de l'Arta, km 12", latitude: 11.5200, longitude: 42.8500, accidentDate: "2026-06-29", accidentTime: "22:00", severity: "fatal", status: "approved", weather: "Night — Unlit", roadCondition: "Dry", accidentType: "rollover", description: "Single vehicle rollover on rural road. Driver ejected, pronounced dead at scene.", officerId: 7, stationId: 4, createdBy: 1, createdAt: new Date("2026-06-29T22:15:00"), updatedAt: new Date("2026-06-30T08:00:00") },
  { id: 10, reportId: "RPT-2025-0029", location: "Boulevard Hassan Gouled, bank quarter", latitude: 11.5850, longitude: 43.1500, accidentDate: "2026-06-28", accidentTime: "10:45", severity: "moderate", status: "under_review", weather: "Dust Haboobs", roadCondition: "Sand Dust Debris", accidentType: "head_on_collision", description: "Two-car collision during dust storm. Reduced visibility reported. Both drivers injured.", officerId: 2, stationId: 1, createdBy: 1, createdAt: new Date("2026-06-28T11:00:00"), updatedAt: new Date("2026-06-28T11:00:00") },
  { id: 11, reportId: "RPT-2025-0028", location: "Rue de Yemen, residential area", latitude: 11.5700, longitude: 43.1380, accidentDate: "2026-06-27", accidentTime: "15:00", severity: "minor", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "property_damage_only", description: "Parking lot sideswipe. Both parties exchanged insurance information.", officerId: 4, stationId: 3, createdBy: 1, createdAt: new Date("2026-06-27T15:15:00"), updatedAt: new Date("2026-06-27T16:00:00") },
  { id: 12, reportId: "RPT-2025-0027", location: "Route de Tadjourah, coastal highway km 25", latitude: 11.4800, longitude: 42.5000, accidentDate: "2026-06-25", accidentTime: "11:20", severity: "serious", status: "approved", weather: "Storm", roadCondition: "Flooded", accidentType: "rollover", description: "Bus overturned on flooded coastal road. 12 passengers injured, emergency services deployed.", officerId: 5, stationId: 5, createdBy: 1, createdAt: new Date("2026-06-25T11:35:00"), updatedAt: new Date("2026-06-25T14:00:00") },
  { id: 13, reportId: "RPT-2025-0026", location: "Avenue Bender, industrial zone", latitude: 11.5600, longitude: 43.1650, accidentDate: "2026-06-23", accidentTime: "06:45", severity: "moderate", status: "submitted", weather: "Overcast", roadCondition: "Wet", accidentType: "rear_end_collision", description: "Delivery van rear-ended truck at loading zone. Driver sustained moderate injuries.", officerId: 6, stationId: 2, createdBy: 1, createdAt: new Date("2026-06-23T07:00:00"), updatedAt: new Date("2026-06-23T07:00:00") },
  { id: 14, reportId: "RPT-2025-0025", location: "Boulevard de la Gauloise, school zone", latitude: 11.5880, longitude: 43.1400, accidentDate: "2026-06-20", accidentTime: "07:30", severity: "serious", status: "approved", weather: "Rain", roadCondition: "Slippery", accidentType: "pedestrian_strike", description: "Child struck by car in school zone. Transported to hospital with fractures.", officerId: 3, stationId: 1, createdBy: 1, createdAt: new Date("2026-06-20T07:45:00"), updatedAt: new Date("2026-06-20T09:00:00") },
  { id: 15, reportId: "RPT-2025-0024", location: "Route d'Ali Sabieh, km 45", latitude: 11.1500, longitude: 42.7000, accidentDate: "2026-06-17", accidentTime: "14:00", severity: "moderate", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "head_on_collision", description: "Head-on collision on desert highway. Both drivers injured. Road blocked 2 hours.", officerId: 7, stationId: 4, createdBy: 1, createdAt: new Date("2026-06-17T14:15:00"), updatedAt: new Date("2026-06-17T16:00:00") },
  { id: 16, reportId: "RPT-2025-0023", location: "Port de Djibouti, container terminal", latitude: 11.6050, longitude: 43.1400, accidentDate: "2026-06-13", accidentTime: "03:00", severity: "minor", status: "approved", weather: "Night — Illuminated", roadCondition: "Dry", accidentType: "property_damage_only", description: "Forklift collision with container truck. Equipment damage only.", officerId: 8, stationId: 1, createdBy: 1, createdAt: new Date("2026-06-13T03:15:00"), updatedAt: new Date("2026-06-13T06:00:00") },
  { id: 17, reportId: "RPT-2025-0022", location: "Rue de la Liberte, downtown", latitude: 11.5820, longitude: 43.1470, accidentDate: "2026-06-10", accidentTime: "17:15", severity: "moderate", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "cyclist_strike", description: "Motorcycle vs taxi collision at junction. Motorcyclist injured with broken leg.", officerId: 1, stationId: 1, createdBy: 1, createdAt: new Date("2026-06-10T17:30:00"), updatedAt: new Date("2026-06-10T19:00:00") },
  { id: 18, reportId: "RPT-2025-0021", location: "Route de Dikhil, km 30", latitude: 11.3500, longitude: 42.4500, accidentDate: "2026-06-07", accidentTime: "12:30", severity: "fatal", status: "approved", weather: "Khamsin Wind", roadCondition: "Sand Dust Debris", accidentType: "rollover", description: "Fatal rollover of cattle transport truck. Driver deceased. Livestock scattered.", officerId: 2, stationId: 1, createdBy: 1, createdAt: new Date("2026-06-07T12:45:00"), updatedAt: new Date("2026-06-07T15:00:00") },
];

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
});
