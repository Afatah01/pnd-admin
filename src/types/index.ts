export interface Officer {
  id: string;
  name: string;
  badge: string;
  rank: string;
  sector: string;
}

export interface VehicleInfo {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  color: string;
  vehicleType: string;
  insuranceCategory: string;
  insuranceCompany: string;
  insurancePolicy: string;
}

export interface PartyInfo {
  id: string;
  type: 'driver' | 'passenger' | 'pedestrian';
  firstName: string;
  lastName: string;
  idNumber: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  injuries: 'none' | 'minor' | 'serious' | 'critical';
}

export interface WitnessInfo {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  statement: string;
}

export interface AccidentPhoto {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
}

export interface EvidenceVideo {
  id: string;
  videoType: 'land' | 'drone' | 'cctv';
  url: string;
  caption: string;
  timestamp: string;
  cctvLocation?: string;
  cctvOwner?: string;
}

export interface Measurement {
  id: string;
  item: string;
  distance: string;
  unit: string;
  notes: string;
}

export interface AccidentReport {
  id: string;
  status: 'draft' | 'submitted' | 'validated';
  createdAt: string;
  submittedAt?: string;
  officerId: string;
  location: { address: string; latitude: number; longitude: number };
  date: string;
  time: string;
  accidentType: string;
  severity: 'minor' | 'moderate' | 'serious' | 'fatal';
  weather: string;
  roadCondition: string;
  lighting: string;
  vehicles: VehicleInfo[];
  parties: PartyInfo[];
  witnesses: WitnessInfo[];
  description: string;
  damageDescription: string;
  officerObservations: string;
  photos: AccidentPhoto[];
  videos: EvidenceVideo[];
  measurements: Measurement[];
  evidenceNotes: string;
}

export type AppScreen = 'splash' | 'login' | 'dashboard' | 'accident-report' | 'report-success' | 'history' | 'settings';

// Category definitions for dropdowns
export const LOCAL_INSURANCES = [
  'GXA Assurances',
  'Amerga Assurances',
  'TRUST Assurance S.A.',
  'Tamini-Insurance SA',
  'African Takaful Insurance',
  'Pool Assurances GIE',
];

export const CROSS_BORDER_INSURANCES = [
  'COMESA Yellow Card Scheme',
  'Ethiopian Insurance Corporation (EIC)',
  'Amerga Assurances (Cross-Border Division)',
  'GXA Assurances (Regional Extensions)',
  'Tamini-Insurance SA (Transit Division)',
];

export const LOCAL_DRIVING_LICENSES = [
  'Category A1',
  'Category A',
  'Category B',
  'Category C',
  'Category D',
  'Category E',
];

export const CROSS_BORDER_DRIVING_LICENSES = [
  'International Driving Permit (IDP)',
  'COMESA Cross-Border Carrier Permit',
];

export const PRIVATE_VEHICLE_TYPES = [
  'Motorcycle',
  'Tricycle (Bajaj)',
  'Passenger Car',
  'Taxi',
  'Light Utility Vehicle',
  'Truck',
  'Minibus',
  'Bus',
  'Articulated & Trailer Vehicle',
  'Construction Machinery',
];

export const GOVERNMENT_VEHICLE_TYPES = [
  'Police Vehicle',
  'Military Vehicle',
  'Ambulance',
  'Fire & Rescue Vehicle',
  'Other Government Service Vehicle',
];
