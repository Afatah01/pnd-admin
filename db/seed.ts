import { getDb } from "../api/queries/connection";
import {
  districts, policeStations, officers, accidentReports, vehicles, drivers,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  try {
    // Seed districts one by one
    for (const d of [
      { name: "Djibouti-Ville", code: "DJ-01", description: "Capital district" },
      { name: "Ali Sabieh", code: "AS-02", description: "Southern district" },
      { name: "Dikhil", code: "DK-03", description: "Western district" },
      { name: "Tadjourah", code: "TJ-04", description: "Northern district" },
      { name: "Obock", code: "OB-05", description: "Northeastern district" },
      { name: "Arta", code: "AR-06", description: "Central district" },
    ]) {
      await db.insert(districts).values(d).onDuplicateKeyUpdate({ set: { name: d.name } });
    }
    console.log("Districts seeded");

    // Seed police stations
    for (const s of [
      { name: "Commissariat Central", code: "CC-001", districtId: 1, address: "Place Lagarde, Djibouti-Ville", phone: "+253-21-35-20-00", latitude: 11.5721, longitude: 43.1456 },
      { name: "Poste de Police Heron", code: "PH-002", districtId: 1, address: "Boulevard de la Republique", phone: "+253-21-35-21-00", latitude: 11.5800, longitude: 43.1500 },
      { name: "Poste de Police Balbala", code: "PB-003", districtId: 1, address: "Balbala, Djibouti", phone: "+253-21-35-22-00", latitude: 11.5500, longitude: 43.1200 },
      { name: "Commissariat Ali Sabieh", code: "CAS-004", districtId: 2, address: "Ali Sabieh Centre", phone: "+253-21-35-23-00", latitude: 11.1380, longitude: 42.7120 },
    ]) {
      await db.insert(policeStations).values(s).onDuplicateKeyUpdate({ set: { name: s.name } });
    }
    console.log("Stations seeded");

    // Seed officers
    for (const o of [
      { badgeNumber: "UR-4521", firstName: "Ahmed", lastName: "Hassan Omar", rank: "brigadier" as const, stationId: 1, phone: "+253-77-12-34-56", email: "ahmed.hassan@police.dj", joinDate: "2015-03-15" },
      { badgeNumber: "UR-3187", firstName: "Fatima", lastName: "Ali Bourhan", rank: "inspector" as const, stationId: 1, phone: "+253-77-23-45-67", email: "fatima.ali@police.dj", joinDate: "2018-07-22" },
      { badgeNumber: "UR-7214", firstName: "Omar", lastName: "Moussa Dirieh", rank: "sergeant" as const, stationId: 2, phone: "+253-77-34-56-78", email: "omar.moussa@police.dj", joinDate: "2020-01-10" },
      { badgeNumber: "UR-1234", firstName: "Kadra", lastName: "Daoud Ali", rank: "constable" as const, stationId: 1, phone: "+253-77-45-67-89", email: "kadra.daoud@police.dj", joinDate: "2022-06-01" },
      { badgeNumber: "UR-5678", firstName: "Mohamed", lastName: "Ali Hassan", rank: "chief_inspector" as const, stationId: 1, phone: "+253-77-56-78-90", email: "mohamed.ali@police.dj", joinDate: "2010-09-12" },
    ]) {
      await db.insert(officers).values(o).onDuplicateKeyUpdate({ set: { badgeNumber: o.badgeNumber } });
    }
    console.log("Officers seeded");

    // Seed sample reports
    for (const r of [
      {
        reportId: "RPT-2025-0042", officerId: 1, stationId: 1,
        location: "Boulevard de la Republique, pres du marche Heron",
        latitude: 11.5721, longitude: 43.1456,
        accidentDate: "2025-01-15", accidentTime: "09:23",
        accidentType: "head_on_collision" as const, severity: "serious" as const,
        weather: "Clear", roadCondition: "Dry", lighting: "Daylight",
        description: "Vehicle A northbound, Vehicle B southbound. Vehicle B crossed double line causing frontal collision.",
        damageDescription: "Vehicle A: severe front damage. Vehicle B: front damage, front axle broken.",
        officerObservations: "Apparent cause: double line crossing. Contributing factor: suspected excessive speed.",
        certified: true, certificationText: "I hereby certify...",
        status: "approved" as const, approvedBy: 5, approvedAt: new Date(),
      },
      {
        reportId: "RPT-2025-0041", officerId: 2, stationId: 1,
        location: "Route de l'Aeroport Ambouli, km 3",
        latitude: 11.5500, longitude: 43.1600,
        accidentDate: "2025-01-14", accidentTime: "14:10",
        accidentType: "rear_end_collision" as const, severity: "moderate" as const,
        weather: "Clear", roadCondition: "Dry", lighting: "Daylight",
        description: "Vehicle A stopped at traffic light. Vehicle B failed to stop in time.",
        certified: true, certificationText: "I hereby certify...",
        status: "submitted" as const,
      },
      {
        reportId: "RPT-2025-0040", officerId: 1, stationId: 2,
        location: "Avenue Georges Clemenceau, pres de la Banque Centrale",
        latitude: 11.5880, longitude: 43.1520,
        accidentDate: "2025-01-14", accidentTime: "07:45",
        accidentType: "pedestrian_strike" as const, severity: "fatal" as const,
        weather: "Night — Illuminated", roadCondition: "Dry", lighting: "Street Lighting",
        description: "Pedestrian crossing outside crosswalk struck by northbound vehicle.",
        certified: true, certificationText: "I hereby certify...",
        status: "under_review" as const,
      },
    ]) {
      await db.insert(accidentReports).values(r).onDuplicateKeyUpdate({ set: { reportId: r.reportId } });
    }
    console.log("Reports seeded");

    // Seed vehicles
    for (const v of [
      { reportId: 1, plateNumber: "DJ-4521-A", brand: "Toyota", model: "Land Cruiser", color: "White", vehicleType: "passenger_car" as const, vehicleCategory: "private" as const, insuranceCategory: "local" as const, insuranceCompany: "GXA Assurances", insurancePolicy: "POL-45892" },
      { reportId: 1, plateNumber: "DJ-1893-B", brand: "Nissan", model: "Patrol", color: "Black", vehicleType: "light_utility" as const, vehicleCategory: "private" as const, insuranceCategory: "local" as const, insuranceCompany: "TRUST Assurance S.A.", insurancePolicy: "POL-78234" },
    ]) {
      await db.insert(vehicles).values(v).onDuplicateKeyUpdate({ set: { plateNumber: v.plateNumber } });
    }
    console.log("Vehicles seeded");

    // Seed drivers
    for (const d of [
      { reportId: 1, firstName: "Mohamed", lastName: "Ali Hassan", idNumber: "ID-88452", phone: "+253-77-11-22-33", licenseNumber: "DL-4521-B", licenseCategory: "Category B", licenseType: "local" as const, injuries: "serious" as const },
      { reportId: 1, firstName: "Kadra", lastName: "Daoud Ali", idNumber: "ID-33921", phone: "+253-77-44-55-66", licenseNumber: "DL-1893-B", licenseCategory: "Category B", licenseType: "local" as const, injuries: "minor" as const },
    ]) {
      await db.insert(drivers).values(d).onDuplicateKeyUpdate({ set: { idNumber: d.idNumber } });
    }
    console.log("Drivers seeded");

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seed error:", err);
  }
}

seed().catch(console.error);
