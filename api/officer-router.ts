import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

// ─── STATIONS & DISTRICTS ───
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

// ─── OFFICER DATA — starts empty, officers created via dashboard ───
let DEMO_OFFICERS: any[] = [];

// Generate random auth code
function generateAuthCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

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
      const authCode = generateAuthCode();
      const newOfficer = {
        id: DEMO_OFFICERS.length + 1,
        ...input,
        authCode,
        status: "active" as const,
        stationName: station?.name || "Unknown",
        createdAt: new Date(),
      };
      DEMO_OFFICERS.push(newOfficer);
      return { ...newOfficer, message: `Officer created. Auth code: ${authCode}` };
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

// Export for boot.ts
export { DEMO_OFFICERS, DEMO_STATIONS };
