import {
  mysqlTable,
  mysqlEnum,
  serial,
  bigint,
  varchar,
  text,
  timestamp,
  double,
  json,
  boolean,
  index,
} from "drizzle-orm/mysql-core";

// ─── USERS & RBAC ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin", "super_admin"]).default("user").notNull(),
  status: mysqlEnum("status", ["active", "suspended", "deleted"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const roles = mysqlTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const permissions = mysqlTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  resource: varchar("resource", { length: 100 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const rolePermissions = mysqlTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: bigint("roleId", { mode: "number", unsigned: true }).notNull(),
  permissionId: bigint("permissionId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── DISTRICTS & STATIONS ───
export const districts = mysqlTable("districts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const policeStations = mysqlTable("police_stations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  districtId: bigint("districtId", { mode: "number", unsigned: true }),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  latitude: double("latitude"),
  longitude: double("longitude"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── OFFICERS ───
export const officers = mysqlTable("officers", {
  id: serial("id").primaryKey(),
  badgeNumber: varchar("badgeNumber", { length: 50 }).notNull().unique(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  rank: mysqlEnum("rank", [
    "constable", "corporal", "sergeant", "inspector",
    "chief_inspector", "superintendent", "chief_superintendent",
    "commissioner", "brigadier", "colonel", "general"
  ]).notNull(),
  stationId: bigint("stationId", { mode: "number", unsigned: true }),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  status: mysqlEnum("status", ["active", "on_leave", "suspended", "retired", "deleted"])
    .default("active").notNull(),
  joinDate: varchar("joinDate", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("officer_station_idx").on(table.stationId),
  index("officer_badge_idx").on(table.badgeNumber),
]);

// ─── ACCIDENT REPORTS ───
export const accidentReports = mysqlTable("accident_reports", {
  id: serial("id").primaryKey(),
  reportId: varchar("reportId", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "submitted", "under_review", "approved", "rejected", "archived"])
    .default("draft").notNull(),
  officerId: bigint("officerId", { mode: "number", unsigned: true }).notNull(),
  stationId: bigint("stationId", { mode: "number", unsigned: true }),
  location: text("location").notNull(),
  latitude: double("latitude"),
  longitude: double("longitude"),
  accidentDate: varchar("accidentDate", { length: 20 }).notNull(),
  accidentTime: varchar("accidentTime", { length: 10 }),
  accidentType: mysqlEnum("accidentType", [
    "head_on_collision", "rear_end_collision", "side_impact_collision",
    "rollover", "pedestrian_strike", "cyclist_strike",
    "single_vehicle_crash", "multi_vehicle_pile_up",
    "property_damage_only", "other"
  ]).notNull(),
  severity: mysqlEnum("severity", ["minor", "moderate", "serious", "fatal"]).notNull(),
  weather: varchar("weather", { length: 100 }),
  roadCondition: varchar("roadCondition", { length: 100 }),
  lighting: varchar("lighting", { length: 100 }),
  description: text("description"),
  damageDescription: text("damageDescription"),
  officerObservations: text("officerObservations"),
  evidenceNotes: text("evidenceNotes"),
  certified: boolean("certified").default(false),
  certificationText: text("certificationText"),
  approvedBy: bigint("approvedBy", { mode: "number", unsigned: true }),
  approvedAt: timestamp("approvedAt"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  deletedAt: timestamp("deletedAt"),
}, (table) => [
  index("report_officer_idx").on(table.officerId),
  index("report_status_idx").on(table.status),
  index("report_date_idx").on(table.accidentDate),
  index("report_station_idx").on(table.stationId),
]);

// ─── VEHICLES ───
export const vehicles = mysqlTable("vehicles", {
  id: serial("id").primaryKey(),
  reportId: bigint("reportId", { mode: "number", unsigned: true }).notNull(),
  plateNumber: varchar("plateNumber", { length: 50 }).notNull(),
  brand: varchar("brand", { length: 255 }),
  model: varchar("model", { length: 255 }),
  color: varchar("color", { length: 100 }),
  vehicleType: mysqlEnum("vehicleType", [
    "motorcycle", "tricycle_bajaj", "passenger_car", "taxi",
    "light_utility", "truck", "minibus", "bus",
    "articulated_trailer", "construction_machinery",
    "police", "military", "ambulance", "fire_rescue", "government_other"
  ]).notNull(),
  vehicleCategory: mysqlEnum("vehicleCategory", ["private", "government"]).default("private").notNull(),
  insuranceCategory: mysqlEnum("insuranceCategory", ["local", "cross_border"]).default("local").notNull(),
  insuranceCompany: varchar("insuranceCompany", { length: 255 }),
  insurancePolicy: varchar("insurancePolicy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── DRIVERS ───
export const drivers = mysqlTable("drivers", {
  id: serial("id").primaryKey(),
  reportId: bigint("reportId", { mode: "number", unsigned: true }).notNull(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  idNumber: varchar("idNumber", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  licenseNumber: varchar("licenseNumber", { length: 100 }),
  licenseCategory: varchar("licenseCategory", { length: 100 }),
  licenseType: mysqlEnum("licenseType", ["local", "cross_border"]).default("local").notNull(),
  injuries: mysqlEnum("injuries", ["none", "minor", "serious", "critical"]).default("none").notNull(),
  isAtFault: boolean("isAtFault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── VICTIMS ───
export const victims = mysqlTable("victims", {
  id: serial("id").primaryKey(),
  reportId: bigint("reportId", { mode: "number", unsigned: true }).notNull(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  idNumber: varchar("idNumber", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  type: mysqlEnum("type", ["driver", "passenger", "pedestrian", "cyclist"]).notNull(),
  injuries: mysqlEnum("injuries", ["none", "minor", "serious", "critical", "fatal"]).default("none").notNull(),
  hospitalName: varchar("hospitalName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── WITNESSES ───
export const witnesses = mysqlTable("witnesses", {
  id: serial("id").primaryKey(),
  reportId: bigint("reportId", { mode: "number", unsigned: true }).notNull(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  statement: text("statement"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── EVIDENCE ───
export const evidence = mysqlTable("evidence", {
  id: serial("id").primaryKey(),
  reportId: bigint("reportId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["photo", "video", "document", "audio"]).notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  videoType: mysqlEnum("videoType", ["land", "drone", "cctv"]),
  cctvLocation: text("cctvLocation"),
  cctvOwner: text("cctvOwner"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── MEASUREMENTS ───
export const measurements = mysqlTable("measurements", {
  id: serial("id").primaryKey(),
  reportId: bigint("reportId", { mode: "number", unsigned: true }).notNull(),
  item: varchar("item", { length: 255 }).notNull(),
  distance: varchar("distance", { length: 50 }),
  unit: mysqlEnum("unit", ["meters", "centimeters", "feet", "inches"]).default("meters").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── NOTIFICATIONS ───
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["report_submitted", "report_approved", "report_rejected", "alert", "system"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  reportId: bigint("reportId", { mode: "number", unsigned: true }),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── AUDIT LOGS ───
export const auditLogs = mysqlTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  userName: varchar("userName", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }).notNull(),
  resourceId: varchar("resourceId", { length: 100 }),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("audit_user_idx").on(table.userId),
  index("audit_action_idx").on(table.action),
  index("audit_created_idx").on(table.createdAt),
]);

// ─── SYSTEM SETTINGS ───
export const systemSettings = mysqlTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  updatedBy: bigint("updatedBy", { mode: "number", unsigned: true }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── ANALYTICS CACHE ───
export const analyticsCache = mysqlTable("analytics_cache", {
  id: serial("id").primaryKey(),
  metric: varchar("metric", { length: 100 }).notNull(),
  period: varchar("period", { length: 50 }).notNull(),
  value: json("value"),
  computedAt: timestamp("computedAt").defaultNow().notNull(),
});

// ─── EXPORTS ───
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Officer = typeof officers.$inferSelect;
export type AccidentReport = typeof accidentReports.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type Driver = typeof drivers.$inferSelect;
export type Victim = typeof victims.$inferSelect;
export type Witness = typeof witnesses.$inferSelect;
export type Evidence = typeof evidence.$inferSelect;
export type Measurement = typeof measurements.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type PoliceStation = typeof policeStations.$inferSelect;
export type District = typeof districts.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
