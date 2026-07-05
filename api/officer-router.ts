import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

const DEMO_OFFICERS = [
  { id: 1, badgeNumber: "4521", firstName: "Mohamed", lastName: "Hassan", rank: "colonel", stationId: 1, stationName: "Commissariat Central", phone: "+253 77 12 34 56", email: "m.hassan@pnd.gov.dj", status: "active", joinDate: "2015-03-15", createdAt: new Date("2015-03-15") },
  { id: 2, badgeNumber: "3187", firstName: "Ahmed", lastName: "Omar", rank: "brigadier", stationId: 1, stationName: "Commissariat Central", phone: "+253 77 23 45 67", email: "a.omar@pnd.gov.dj", status: "active", joinDate: "2018-07-22", createdAt: new Date("2018-07-22") },
  { id: 3, badgeNumber: "7214", firstName: "Fatima", lastName: "Daher", rank: "chief_inspector", stationId: 2, stationName: "Poste de Police Balbala", phone: "+253 77 34 56 78", email: "f.daher@pnd.gov.dj", status: "active", joinDate: "2016-11-08", createdAt: new Date("2016-11-08") },
  { id: 4, badgeNumber: "1845", firstName: "Ismail", lastName: "Robleh", rank: "inspector", stationId: 3, stationName: "Poste de Police Plateau", phone: "+253 77 45 67 89", email: "i.robleh@pnd.gov.dj", status: "active", joinDate: "2021-01-10", createdAt: new Date("2021-01-10") },
  { id: 5, badgeNumber: "6392", firstName: "Ayaan", lastName: "Guelleh", rank: "superintendent", stationId: 1, stationName: "Commissariat Central", phone: "+253 77 56 78 90", email: "a.guelleh@pnd.gov.dj", status: "on_leave", joinDate: "2017-05-30", createdAt: new Date("2017-05-30") },
  { id: 6, badgeNumber: "5103", firstName: "Yacin", lastName: "Bourhan", rank: "sergeant", stationId: 2, stationName: "Poste de Police Balbala", phone: "+253 77 67 89 01", email: "y.bourhan@pnd.gov.dj", status: "active", joinDate: "2019-09-14", createdAt: new Date("2019-09-14") },
  { id: 7, badgeNumber: "2478", firstName: "Hodan", lastName: "Kamil", rank: "inspector", stationId: 4, stationName: "Poste de Police Ali Sabieh", phone: "+253 77 78 90 12", email: "h.kamil@pnd.gov.dj", status: "active", joinDate: "2022-03-01", createdAt: new Date("2022-03-01") },
  { id: 8, badgeNumber: "8631", firstName: "Said", lastName: "Egueh", rank: "brigadier", stationId: 5, stationName: "Poste de Police Tadjourah", phone: "+253 77 89 01 23", email: "s.egueh@pnd.gov.dj", status: "suspended", joinDate: "2014-12-20", createdAt: new Date("2014-12-20") },
];

const DEMO_STATIONS = [
  { id: 1, name: "Commissariat Central", code: "CC-01", districtId: 1, address: "Boulevard de la Republique, Djibouti City", phone: "+253 21 35 20 00", type: "central", isActive: true },
  { id: 2, name: "Poste de Police Balbala", code: "PB-02", districtId: 1, address: "Rue de Balbala, Djibouti City", phone: "+253 21 35 21 00", type: "station", isActive: true },
  { id: 3, name: "Poste de Police Plateau", code: "PP-03", districtId: 1, address: "Plateau du Serpent, Djibouti City", phone: "+253 21 35 22 00", type: "station", isActive: true },
  { id: 4, name: "Poste de Police Ali Sabieh", code: "PAS-04", districtId: 2, address: "Centre Ville, Ali Sabieh", phone: "+253 21 35 23 00", type: "station", isActive: true },
  { id: 5, name: "Poste de Police Tadjourah", code: "PT-05", districtId: 3, address: "Port de Tadjourah, Tadjourah", phone: "+253 21 35 24 00", type: "station", isActive: true },
];

const DEMO_DISTRICTS = [
  { id: 1, name: "Djibouti City", code: "DJ-CEN", region: "Djibouti Region", description: "Capital district covering central urban area" },
  { id: 2, name: "Ali Sabieh", code: "AS-SUD", region: "Ali Sabieh Region", description: "Southern region border district" },
  { id: 3, name: "Tadjourah", code: "TD-NOR", region: "Tadjourah Region", description: "Northern coastal district" },
  { id: 4, name: "Obock", code: "OB-NOR", region: "Obock Region", description: "Northern gulf district" },
];

export const officerRouter = createRouter({
  list: publicQuery
    .input(z.object({
      search: z.string().optional(),
      status: z.string().optional(),
      rank: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      let officers = [...DEMO_OFFICERS];
      if (input?.search) officers = officers.filter(o => `${o.firstName} ${o.lastName}`.toLowerCase().includes(input.search!.toLowerCase()) || o.badgeNumber.includes(input.search!));
      if (input?.status) officers = officers.filter(o => o.status === input.status);
      if (input?.rank) officers = officers.filter(o => o.rank === input.rank);
      return { officers, total: officers.length };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return DEMO_OFFICERS.find(o => o.id === input.id) || null;
    }),

  create: publicQuery
    .input(z.object({
      badgeNumber: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      rank: z.string(),
      stationId: z.number(),
      phone: z.string().optional(),
      email: z.string().optional(),
      joinDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      const station = DEMO_STATIONS.find(s => s.id === input.stationId);
      const newOfficer = {
        id: DEMO_OFFICERS.length + 1,
        ...input,
        status: "active",
        stationName: station?.name || "Unknown",
        createdAt: new Date(),
      };
      DEMO_OFFICERS.push(newOfficer);
      return newOfficer;
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      badgeNumber: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      rank: z.string().optional(),
      stationId: z.number().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      status: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const officer = DEMO_OFFICERS.find(o => o.id === input.id);
      if (!officer) throw new Error("Officer not found");
      if (input.badgeNumber) officer.badgeNumber = input.badgeNumber;
      if (input.firstName) officer.firstName = input.firstName;
      if (input.lastName) officer.lastName = input.lastName;
      if (input.rank) officer.rank = input.rank;
      if (input.stationId) { officer.stationId = input.stationId; officer.stationName = DEMO_STATIONS.find(s => s.id === input.stationId)?.name || "Unknown"; }
      if (input.phone) officer.phone = input.phone;
      if (input.email) officer.email = input.email;
      if (input.status) officer.status = input.status;
      return officer;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const idx = DEMO_OFFICERS.findIndex(o => o.id === input.id);
      if (idx > -1) DEMO_OFFICERS.splice(idx, 1);
      return { success: true };
    }),

  stations: publicQuery.query(async () => DEMO_STATIONS),
  districts: publicQuery.query(async () => DEMO_DISTRICTS),

  stats: publicQuery.query(async () => {
    const total = DEMO_OFFICERS.length;
    const active = DEMO_OFFICERS.filter(o => o.status === "active").length;
    const onLeave = DEMO_OFFICERS.filter(o => o.status === "on_leave").length;
    const suspended = DEMO_OFFICERS.filter(o => o.status === "suspended").length;
    return { total, active, onLeave, suspended };
  }),
});
