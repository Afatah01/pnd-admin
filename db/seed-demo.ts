import { getDb } from "../api/queries/connection";
import {
  accidentReports, vehicles, drivers, victims, witnesses,
  evidence, measurements, officers, policeStations, districts, users,
} from "./schema";

const db = getDb();

// ─── Helpers ───
const now = new Date();
const fmtDate = (d: Date) => d.toISOString().split("T")[0];
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return fmtDate(d);
};

async function seed() {
  console.log("🌱 Seeding demo data for PND...");

  // ─── Districts ───
  const distResult = await db.insert(districts).values([
    { name: "Djibouti City", code: "DJ-CEN", region: "Djibouti Region", description: "Capital district covering central urban area" },
    { name: "Ali Sabieh", code: "AS-SUD", region: "Ali Sabieh Region", description: "Southern region border district" },
    { name: "Tadjourah", code: "TD-NOR", region: "Tadjourah Region", description: "Northern coastal district" },
    { name: "Obock", code: "OB-NOR", region: "Obock Region", description: "Northern gulf district" },
  ]).$returningId();
  const distIds = distResult.map((d: any) => d.id);
  console.log("✅ Districts seeded:", distIds);

  // ─── Police Stations ───
  const stationResult = await db.insert(policeStations).values([
    { name: "Commissariat Central", code: "CC-01", districtId: distIds[0], address: "Boulevard de la Republique, Djibouti City", phone: "+253 21 35 20 00", type: "central", isActive: true },
    { name: "Poste de Police Balbala", code: "PB-02", districtId: distIds[0], address: "Rue de Balbala, Djibouti City", phone: "+253 21 35 21 00", type: "station", isActive: true },
    { name: "Poste de Police Plateau", code: "PP-03", districtId: distIds[0], address: "Plateau du Serpent, Djibouti City", phone: "+253 21 35 22 00", type: "station", isActive: true },
    { name: "Poste de Police Ali Sabieh", code: "PAS-04", districtId: distIds[1], address: "Centre Ville, Ali Sabieh", phone: "+253 21 35 23 00", type: "station", isActive: true },
    { name: "Poste de Police Tadjourah", code: "PT-05", districtId: distIds[2], address: "Port de Tadjourah, Tadjourah", phone: "+253 21 35 24 00", type: "station", isActive: true },
  ]).$returningId();
  const stationIds = stationResult.map((s: any) => s.id);
  console.log("✅ Stations seeded:", stationIds);

  // ─── Officers ───
  const officerResult = await db.insert(officers).values([
    { badgeNumber: "4521", firstName: "Mohamed", lastName: "Hassan", rank: "colonel", stationId: stationIds[0], phone: "+253 77 12 34 56", email: "m.hassan@pnd.gov.dj", status: "active", joinDate: "2015-03-15" },
    { badgeNumber: "3187", firstName: "Ahmed", lastName: "Omar", rank: "brigadier", stationId: stationIds[0], phone: "+253 77 23 45 67", email: "a.omar@pnd.gov.dj", status: "active", joinDate: "2018-07-22" },
    { badgeNumber: "7214", firstName: "Fatima", lastName: "Daher", rank: "chief_inspector", stationId: stationIds[1], phone: "+253 77 34 56 78", email: "f.daher@pnd.gov.dj", status: "active", joinDate: "2016-11-08" },
    { badgeNumber: "1845", firstName: "Ismail", lastName: "Robleh", rank: "inspector", stationId: stationIds[2], phone: "+253 77 45 67 89", email: "i.robleh@pnd.gov.dj", status: "active", joinDate: "2021-01-10" },
    { badgeNumber: "6392", firstName: "Ayaan", lastName: "Guelleh", rank: "superintendent", stationId: stationIds[0], phone: "+253 77 56 78 90", email: "a.guelleh@pnd.gov.dj", status: "on_leave", joinDate: "2017-05-30" },
    { badgeNumber: "5103", firstName: "Yacin", lastName: "Bourhan", rank: "sergeant", stationId: stationIds[1], phone: "+253 77 67 89 01", email: "y.bourhan@pnd.gov.dj", status: "active", joinDate: "2019-09-14" },
    { badgeNumber: "2478", firstName: "Hodan", lastName: "Kamil", rank: "inspector", stationId: stationIds[3], phone: "+253 77 78 90 12", email: "h.kamil@pnd.gov.dj", status: "active", joinDate: "2022-03-01" },
    { badgeNumber: "8631", firstName: "Said", lastName: "Egueh", rank: "brigadier", stationId: stationIds[4], phone: "+253 77 89 01 23", email: "s.egueh@pnd.gov.dj", status: "suspended", joinDate: "2014-12-20" },
  ]).$returningId();
  const officerIds = officerResult.map((o: any) => o.id);
  console.log("✅ Officers seeded:", officerIds);

  // ─── Accident Reports ───
  const reportResult = await db.insert(accidentReports).values([
    { reportId: "RPT-2025-0038", location: "Boulevard de la Republique, near Total station", latitude: "11.5721", longitude: "43.1456", accidentDate: daysAgo(0), accidentTime: "08:30", severity: "serious", status: "submitted", weather: "Clear", roadCondition: "Dry", accidentType: "head_on_collision", description: "Head-on collision between two taxis at intersection. Both vehicles sustained heavy damage.", officerId: officerIds[0], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0037", location: "Route de l'Aeroport, km 5", latitude: "11.5480", longitude: "43.1600", accidentDate: daysAgo(1), accidentTime: "14:15", severity: "fatal", status: "approved", weather: "Khamsin Wind", roadCondition: "Sand Dust Debris", accidentType: "rollover", description: "Truck rollover due to strong crosswinds. Cargo spilled across roadway. One fatality confirmed.", officerId: officerIds[1], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0036", location: "Rue de Balbala, market entrance", latitude: "11.5900", longitude: "43.1200", accidentDate: daysAgo(1), accidentTime: "11:45", severity: "moderate", status: "under_review", weather: "Clear", roadCondition: "Dry", accidentType: "pedestrian_strike", description: "Pedestrian struck by motorcycle in market area. Victim transported to Peltier Hospital.", officerId: officerIds[2], stationId: stationIds[1], createdBy: 1 },
    { reportId: "RPT-2025-0035", location: "Plateau du Serpent, roundabout", latitude: "11.5780", longitude: "43.1520", accidentDate: daysAgo(2), accidentTime: "19:20", severity: "minor", status: "approved", weather: "Night — Illuminated", roadCondition: "Wet", accidentType: "side_impact_collision", description: "Sideswipe collision at roundabout. Minor damage to both vehicles. No injuries.", officerId: officerIds[3], stationId: stationIds[2], createdBy: 1 },
    { reportId: "RPT-2025-0034", location: "Route d'Ambouli, near Camp Lemonnier gate", latitude: "11.5350", longitude: "43.1550", accidentDate: daysAgo(2), accidentTime: "07:00", severity: "serious", status: "approved", weather: "Fog/Mist", roadCondition: "Slippery", accidentType: "multi_vehicle_pile_up", description: "Multi-vehicle pile-up (4 cars) in foggy conditions. Three people injured, road closed 3 hours.", officerId: officerIds[0], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0033", location: "Avenue 26 Juin, central district", latitude: "11.5800", longitude: "43.1480", accidentDate: daysAgo(3), accidentTime: "16:45", severity: "moderate", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "rear_end_collision", description: "Rear-end collision at traffic light. Second vehicle failed to stop. Whiplash injuries reported.", officerId: officerIds[1], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0032", location: "Route de Doraleh, port access road", latitude: "11.5100", longitude: "43.1300", accidentDate: daysAgo(4), accidentTime: "09:10", severity: "minor", status: "submitted", weather: "Saba Wind", roadCondition: "Dry", accidentType: "side_impact_collision", description: "Minor collision between private car and port truck. Fender damage only.", officerId: officerIds[5], stationId: stationIds[1], createdBy: 1 },
    { reportId: "RPT-2025-0031", location: "Rue d'Ethiopie, commercial district", latitude: "11.5750", longitude: "43.1420", accidentDate: daysAgo(5), accidentTime: "13:30", severity: "serious", status: "approved", weather: "Clear", roadCondition: "Under Repair", accidentType: "single_vehicle_crash", description: "Motorcyclist lost control on uneven road surface. Severe injuries, victim in critical condition.", officerId: officerIds[2], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0030", location: "Route de l'Arta, km 12", latitude: "11.5200", longitude: "42.8500", accidentDate: daysAgo(6), accidentTime: "22:00", severity: "fatal", status: "approved", weather: "Night — Unlit", roadCondition: "Dry", accidentType: "rollover", description: "Single vehicle rollover on rural road. Driver ejected, pronounced dead at scene.", officerId: officerIds[6], stationId: stationIds[3], createdBy: 1 },
    { reportId: "RPT-2025-0029", location: "Boulevard Hassan Gouled, bank quarter", latitude: "11.5850", longitude: "43.1500", accidentDate: daysAgo(7), accidentTime: "10:45", severity: "moderate", status: "under_review", weather: "Dust Haboobs", roadCondition: "Sand Dust Debris", accidentType: "head_on_collision", description: "Two-car collision during dust storm. Reduced visibility reported. Both drivers injured.", officerId: officerIds[1], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0028", location: "Rue de Yemen, residential area", latitude: "11.5700", longitude: "43.1380", accidentDate: daysAgo(8), accidentTime: "15:00", severity: "minor", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "property_damage_only", description: "Parking lot sideswipe. Both parties exchanged insurance information.", officerId: officerIds[3], stationId: stationIds[2], createdBy: 1 },
    { reportId: "RPT-2025-0027", location: "Route de Tadjourah, coastal highway km 25", latitude: "11.4800", longitude: "42.5000", accidentDate: daysAgo(10), accidentTime: "11:20", severity: "serious", status: "approved", weather: "Storm", roadCondition: "Flooded", accidentType: "rollover", description: "Bus overturned on flooded coastal road. 12 passengers injured, emergency services deployed.", officerId: officerIds[4], stationId: stationIds[4], createdBy: 1 },
    { reportId: "RPT-2025-0026", location: "Avenue Bender, industrial zone", latitude: "11.5600", longitude: "43.1650", accidentDate: daysAgo(12), accidentTime: "06:45", severity: "moderate", status: "submitted", weather: "Overcast", roadCondition: "Wet", accidentType: "rear_end_collision", description: "Delivery van rear-ended truck at loading zone. Driver sustained moderate injuries.", officerId: officerIds[5], stationId: stationIds[1], createdBy: 1 },
    { reportId: "RPT-2025-0025", location: "Boulevard de la Gauloise, school zone", latitude: "11.5880", longitude: "43.1400", accidentDate: daysAgo(15), accidentTime: "07:30", severity: "serious", status: "approved", weather: "Rain", roadCondition: "Slippery", accidentType: "pedestrian_strike", description: "Child struck by car in school zone. Transported to hospital with fractures.", officerId: officerIds[2], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0024", location: "Route d'Ali Sabieh, km 45", latitude: "11.1500", longitude: "42.7000", accidentDate: daysAgo(18), accidentTime: "14:00", severity: "moderate", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "head_on_collision", description: "Head-on collision on desert highway. Both drivers injured. Road blocked 2 hours.", officerId: officerIds[6], stationId: stationIds[3], createdBy: 1 },
    { reportId: "RPT-2025-0023", location: "Port de Djibouti, container terminal", latitude: "11.6050", longitude: "43.1400", accidentDate: daysAgo(22), accidentTime: "03:00", severity: "minor", status: "approved", weather: "Night — Illuminated", roadCondition: "Dry", accidentType: "property_damage_only", description: "Forklift collision with container truck. Equipment damage only.", officerId: officerIds[7], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0022", location: "Rue de la Liberte, downtown", latitude: "11.5820", longitude: "43.1470", accidentDate: daysAgo(25), accidentTime: "17:15", severity: "moderate", status: "approved", weather: "Clear", roadCondition: "Dry", accidentType: "cyclist_strike", description: "Motorcycle vs taxi collision at junction. Motorcyclist injured with broken leg.", officerId: officerIds[0], stationId: stationIds[0], createdBy: 1 },
    { reportId: "RPT-2025-0021", location: "Route de Dikhil, km 30", latitude: "11.3500", longitude: "42.4500", accidentDate: daysAgo(28), accidentTime: "12:30", severity: "fatal", status: "approved", weather: "Khamsin Wind", roadCondition: "Sand Dust Debris", accidentType: "rollover", description: "Fatal rollover of cattle transport truck. Driver deceased. Livestock scattered.", officerId: officerIds[1], stationId: stationIds[0], createdBy: 1 },
  ]).$returningId();
  const reportIds = reportResult.map((r: any) => r.id);
  console.log("✅ 18 Accident Reports seeded:", reportIds);

  // ─── Vehicles ───
  await db.insert(vehicles).values([
    { reportId: reportIds[0], plateNumber: "DJ-1234-A", vehicleType: "taxi", brand: "Toyota", model: "Corolla", color: "White" },
    { reportId: reportIds[0], plateNumber: "DJ-5678-B", vehicleType: "taxi", brand: "Hyundai", model: "Accent", color: "Blue" },
    { reportId: reportIds[1], plateNumber: "DJ-9012-C", vehicleType: "truck", brand: "Mercedes", model: "Actros", color: "Red" },
    { reportId: reportIds[3], plateNumber: "DJ-3456-D", vehicleType: "passenger_car", brand: "Toyota", model: "Land Cruiser", color: "Black" },
    { reportId: reportIds[3], plateNumber: "DJ-7890-E", vehicleType: "passenger_car", brand: "Nissan", model: "Patrol", color: "Silver" },
    { reportId: reportIds[4], plateNumber: "DJ-1111-F", vehicleType: "passenger_car", brand: "Toyota", model: "Hilux", color: "White" },
    { reportId: reportIds[4], plateNumber: "DJ-2222-G", vehicleType: "passenger_car", brand: "Mitsubishi", model: "L200", color: "Grey" },
    { reportId: reportIds[6], plateNumber: "DJ-3333-H", vehicleType: "passenger_car", brand: "Kia", model: "Sportage", color: "White" },
    { reportId: reportIds[6], plateNumber: "DJ-4444-I", vehicleType: "truck", brand: "Isuzu", model: "FTR", color: "Blue" },
  ]);
  console.log("✅ Vehicles seeded");

  // ─── Drivers ───
  await db.insert(drivers).values([
    { reportId: reportIds[0], firstName: "Abdi", lastName: "Waberi", licenseNumber: "DJ-458921", licenseCategory: "B", phone: "+253 77 11 22 33", address: "Rue 1, Quartier 5, Djibouti City", injuries: "serious" },
    { reportId: reportIds[0], firstName: "Hassan", lastName: "Moussa", licenseNumber: "DJ-672134", licenseCategory: "B", phone: "+253 77 22 33 44", address: "Rue 10, Quartier 3, Djibouti City", injuries: "serious" },
    { reportId: reportIds[1], firstName: "Mahamoud", lastName: "Ali", licenseNumber: "DJ-901234", licenseCategory: "C+E", phone: "+253 77 33 44 55", address: "Route d'Ambouli, Djibouti City", injuries: "none" },
    { reportId: reportIds[3], firstName: "Sadia", lastName: "Hared", licenseNumber: "DJ-334455", licenseCategory: "B", phone: "+253 77 44 55 66", address: "Plateau du Serpent, Djibouti City", injuries: "none" },
  ]);
  console.log("✅ Drivers seeded");

  // ─── Victims ───
  await db.insert(victims).values([
    { reportId: reportIds[1], firstName: "Omar", lastName: "Dirieh", phone: "+253 77 55 66 77", type: "passenger", injuries: "fatal", hospitalName: "Peltier Hospital" },
    { reportId: reportIds[2], firstName: "Kadra", lastName: "Hassan", phone: "+253 77 66 77 88", type: "pedestrian", injuries: "serious", hospitalName: "Peltier Hospital" },
    { reportId: reportIds[4], firstName: "Unknown", lastName: "Passenger", type: "passenger", injuries: "minor", hospitalName: "Peltier Hospital" },
    { reportId: reportIds[4], firstName: "Said", lastName: "Dabar", phone: "+253 77 77 88 99", type: "driver", injuries: "minor", hospitalName: "Peltier Hospital" },
    { reportId: reportIds[4], firstName: "Amina", lastName: "Ibrahim", phone: "+253 77 88 99 00", type: "passenger", injuries: "serious", hospitalName: "Peltier Hospital" },
    { reportId: reportIds[8], firstName: "Houssein", lastName: "Rayaleh", phone: "+253 77 99 00 11", type: "driver", injuries: "fatal", hospitalName: "Ali Sabieh Health Center" },
    { reportId: reportIds[14], firstName: "Child", lastName: "Victim", phone: "+253 77 00 11 22", type: "pedestrian", injuries: "serious", hospitalName: "Peltier Hospital" },
    { reportId: reportIds[11], firstName: "Multiple", lastName: "Passengers", type: "passenger", injuries: "serious", hospitalName: "Tadjourah Hospital" },
    { reportId: reportIds[17], firstName: "Abdallah", lastName: "Bogoreh", phone: "+253 77 12 34 55", type: "driver", injuries: "fatal", hospitalName: "Dikhil Regional Hospital" },
  ]);
  console.log("✅ Victims seeded");

  // ─── Witnesses ───
  await db.insert(witnesses).values([
    { reportId: reportIds[0], firstName: "Souad", lastName: "Abdillahi", phone: "+253 77 11 11 22", address: "Rue 5, Quartier 2, Djibouti City", statement: "I saw the first taxi run the red light before hitting the second vehicle head-on." },
    { reportId: reportIds[0], firstName: "Moumin", lastName: "Bogoreh", phone: "+253 77 22 22 33", address: "Rue 12, Quartier 3, Djibouti City", statement: "The collision happened very fast. Both drivers appeared to be going too fast for the intersection." },
    { reportId: reportIds[1], firstName: "Hibo", lastName: "Ismail", phone: "+253 77 33 33 44", address: "Route de l'Aeroport, Djibouti City", statement: "The truck was swaying in the wind before it tipped over. The sand made the road surface very slippery." },
    { reportId: reportIds[2], firstName: "Abdourahman", lastName: "Kamil", phone: "+253 77 44 44 55", address: "Rue de Balbala, Djibouti City", statement: "The motorcycle came around the corner very fast and hit the pedestrian who was crossing." },
  ]);
  console.log("✅ Witnesses seeded");

  // ─── Evidence ───
  await db.insert(evidence).values([
    { reportId: reportIds[0], type: "photo", url: "https://pnd.gov.dj/evidence/rpt-0038/img-001.jpg", caption: "Front impact damage - Vehicle 1" },
    { reportId: reportIds[0], type: "photo", url: "https://pnd.gov.dj/evidence/rpt-0038/img-002.jpg", caption: "Front impact damage - Vehicle 2" },
    { reportId: reportIds[0], type: "photo", url: "https://pnd.gov.dj/evidence/rpt-0038/img-003.jpg", caption: "Intersection overview" },
    { reportId: reportIds[1], type: "video", url: "https://pnd.gov.dj/evidence/rpt-0037/video-001.mp4", caption: "Dashcam footage of rollover incident", videoType: "land" },
    { reportId: reportIds[4], type: "photo", url: "https://pnd.gov.dj/evidence/rpt-0034/img-001.jpg", caption: "Multi-vehicle crash scene overview" },
    { reportId: reportIds[7], type: "document", url: "https://pnd.gov.dj/evidence/rpt-0031/doc-001.pdf", caption: "Police report and witness statements" },
  ]);
  console.log("✅ Evidence seeded");

  // ─── Measurements ───
  await db.insert(measurements).values([
    { reportId: reportIds[0], item: "Left front tire skid mark", distance: "12.5", unit: "meters", notes: "Measured from first visible mark to impact point" },
    { reportId: reportIds[0], item: "Right front tire skid mark", distance: "8.3", unit: "meters", notes: "Shorter due to steering correction attempt" },
    { reportId: reportIds[0], item: "Distance from curb to impact", distance: "2.1", unit: "meters", notes: "Vehicle drifted across lane before collision" },
    { reportId: reportIds[1], item: "Debris scatter length", distance: "45", unit: "meters", notes: "Cargo and vehicle parts spread across both lanes" },
    { reportId: reportIds[4], item: "Longest skid mark", distance: "22.0", unit: "meters", notes: "Vehicle 1 - excessive speed in fog" },
    { reportId: reportIds[4], item: "Chain collision span", distance: "18", unit: "meters", notes: "Total distance covered by 4-vehicle collision" },
  ]);
  console.log("✅ Measurements seeded");

  console.log("\n🎉 Demo seeding complete! Dashboard is now fully active.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
