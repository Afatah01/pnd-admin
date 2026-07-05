import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Officer, AccidentReport, AppScreen, VehicleInfo, PartyInfo, WitnessInfo, AccidentPhoto, EvidenceVideo, Measurement } from '@/types';

interface AppState {
  screen: AppScreen;
  officer: Officer | null;
  reports: AccidentReport[];
  currentReport: AccidentReport | null;
  previousScreen: AppScreen | null;
}

interface AppContextType extends AppState {
  navigate: (screen: AppScreen) => void;
  goBack: () => void;
  login: (officer: Officer) => void;
  logoff: () => void;
  createNewReport: () => void;
  updateCurrentReport: (report: Partial<AccidentReport>) => void;
  submitCurrentReport: () => void;
  addPhotoToCurrentReport: (photo: AccidentPhoto) => void;
  addVehicleToCurrentReport: (vehicle: VehicleInfo) => void;
  removeVehicleFromCurrentReport: (vehicleId: string) => void;
  addPartyToCurrentReport: (party: PartyInfo) => void;
  removePartyFromCurrentReport: (partyId: string) => void;
  addWitnessToCurrentReport: (witness: WitnessInfo) => void;
  removeWitnessFromCurrentReport: (witnessId: string) => void;
  removePhotoFromCurrentReport: (photoId: string) => void;
  addVideoToCurrentReport: (video: EvidenceVideo) => void;
  removeVideoFromCurrentReport: (videoId: string) => void;
  addMeasurementToCurrentReport: (measurement: Measurement) => void;
  removeMeasurementFromCurrentReport: (measurementId: string) => void;
}

const mockReports: AccidentReport[] = [
  {
    id: 'RPT-2025-0042',
    status: 'submitted',
    createdAt: '2025-01-15T09:30:00',
    submittedAt: '2025-01-15T10:15:00',
    officerId: '1',
    location: { address: 'Boulevard de la République, près du marché Héron', latitude: 11.5721, longitude: 43.1456 },
    date: '2025-01-15',
    time: '09:23',
    accidentType: 'head-on collision',
    severity: 'serious',
    weather: 'Clear',
    roadCondition: 'Dry',
    lighting: 'Daylight',
    vehicles: [
      { id: 'v1', plateNumber: 'DJ-4521-A', brand: 'Toyota', model: 'Land Cruiser', color: 'Blanc', vehicleType: 'Passenger Car', insuranceCategory: 'Local Insurances', insuranceCompany: 'GXA Assurances', insurancePolicy: 'POL-78234' },
      { id: 'v2', plateNumber: 'DJ-1893-B', brand: 'Nissan', model: 'Patrol', color: 'Noir', vehicleType: 'Light Utility Vehicle', insuranceCategory: 'Local Insurances', insuranceCompany: 'TRUST Assurance S.A.', insurancePolicy: 'POL-45291' },
    ],
    parties: [
      { id: 'p1', type: 'driver', firstName: 'Mohamed', lastName: 'Ali Hassan', idNumber: 'ID-12345', phone: '77 12 34 56', address: 'Rue de Bender, Djibouti-ville', licenseNumber: 'DL-78901', licenseCategory: 'B', licenseExpiry: '2027-03-15', injuries: 'serious' },
      { id: 'p2', type: 'driver', firstName: 'Kadra', lastName: 'Daoud Ali', idNumber: 'ID-67890', phone: '77 98 76 54', address: 'Quartier 7, Balbala', licenseNumber: 'DL-34567', licenseCategory: 'B', licenseExpiry: '2026-08-20', injuries: 'minor' },
    ],
    witnesses: [
      { id: 'w1', firstName: 'Abdillahi', lastName: 'Hassan', phone: '77 11 22 33', address: 'Boulevard de la Republique, Djibouti-ville', statement: 'I was standing at the northeast corner of the intersection. The white vehicle approached at high speed and went straight through the red light without braking. The other vehicle had already entered the intersection on green. The impact was immediate and very loud.' },
    ],
    description: 'Vehicle 2 (DJ-1893-B) proceeded through a red traffic control signal at the intersection, resulting in a frontal collision with Vehicle 1 (DJ-4521-A) which had right of way. Eyewitness confirms signal was displaying red.',
    damageDescription: 'Vehicle 1: Frontal impact damage — crushed radiator, deployed airbags (driver and passenger), compromised crumple zones. Vehicle 2: Severe frontal damage, engine displacement, deployed airbags. Both vehicles non-operational.',
    officerObservations: 'Continuous skid marks measured 15.2m originating from Vehicle 1, consistent with emergency braking. Traffic signal confirmed operational — red phase active at time of impact. No tyre marks from Vehicle 2. Road surface dry.',
    photos: [],
    videos: [
      { id: 'vid1', videoType: 'land', url: 'https://example.com/vid1', caption: 'Approach view — southbound lane', timestamp: '2025-01-15T09:25:00' },
      { id: 'vid2', videoType: 'drone', url: 'https://example.com/vid2', caption: 'Aerial overview of collision scene and debris pattern', timestamp: '2025-01-15T09:30:00' },
    ],
    measurements: [
      { id: 'm1', item: 'Skid marks (Veh 1)', distance: '15.2', unit: 'meters', notes: 'Continuous braking marks in southbound lane, 2.8m from curb, commencing 12m pre-intersection' },
      { id: 'm2', item: 'Debris scatter', distance: '8.5', unit: 'meters', notes: 'Debris field extends E-W from point of impact, centred on intersection' },
      { id: 'm3', item: 'Crosswalk proximity', distance: '45', unit: 'meters', notes: 'Nearest pedestrian crossing — south of intersection, unaffected' },
    ],
    evidenceNotes: 'Traffic signal post No.TS-0427 confirmed operational. Signal phase timing recorded. Road markings clearly visible and compliant. No CCTV coverage at this intersection. Road surface: dry, ambient temp 32°C.',
  },
  {
    id: 'RPT-2025-0041',
    status: 'validated',
    createdAt: '2025-01-14T14:20:00',
    submittedAt: '2025-01-14T15:00:00',
    officerId: '2',
    location: { address: 'Route de l\'Aéroport Ambouli, km 3', latitude: 11.5478, longitude: 43.1590 },
    date: '2025-01-14',
    time: '14:10',
    accidentType: 'rear-end collision',
    severity: 'moderate',
    weather: 'Overcast',
    roadCondition: 'Dry',
    lighting: 'Daylight',
    vehicles: [
      { id: 'v3', plateNumber: 'DJ-6734-C', brand: 'Mitsubishi', model: 'L200', color: 'Gris', vehicleType: 'Truck', insuranceCategory: 'Cross-Border Insurances', insuranceCompany: 'COMESA Yellow Card Scheme', insurancePolicy: 'POL-90234' },
      { id: 'v4', plateNumber: 'DJ-1122-D', brand: 'Isuzu', model: 'D-Max', color: 'Bleu', vehicleType: 'Light Utility Vehicle', insuranceCategory: 'Local Insurances', insuranceCompany: 'Tamini-Insurance SA', insurancePolicy: 'POL-11223' },
    ],
    parties: [
      { id: 'p3', type: 'driver', firstName: 'Ismael', lastName: 'Omar Guelleh', idNumber: 'ID-24680', phone: '77 33 44 55', address: 'Avenue Georges Clemenceau', licenseNumber: 'DL-54321', licenseCategory: 'B', licenseExpiry: '2028-01-10', injuries: 'none' },
      { id: 'p4', type: 'driver', firstName: 'Hibo', lastName: 'Mohamed', idNumber: 'ID-13579', phone: '77 66 77 88', address: 'Quartier 5, Djibouti-ville', licenseNumber: 'DL-98765', licenseCategory: 'B', licenseExpiry: '2026-12-05', injuries: 'minor' },
    ],
    witnesses: [],
    description: 'Vehicle 2 (DJ-1122-D) failed to maintain adequate following distance, resulting in a rear-end collision with Vehicle 1 (DJ-6734-C) which was stationary at the time. Vehicle 2 driver reported distraction.',
    damageDescription: 'Vehicle 1: Rear bumper crushed, tailgate compromised, rear frame deformation. Vehicle 2: Frontal impact — bonnet buckled, grille destroyed, radiator breach. Both vehicles towed from scene.',
    officerObservations: 'Dry road surface. Adequate visibility. No skid marks from Vehicle 2 indicating insufficient braking reaction. Following distance grossly inadequate per Highway Code Art. 12. Scene documented with Total Energies CCTV.',
    photos: [],
    videos: [
      { id: 'vid3', videoType: 'cctv', url: 'https://example.com/vid3', caption: 'CCTV — Station Total perimeter camera #3', timestamp: '2025-01-14T14:10:00', cctvLocation: 'Station Total, Boulevard de la Republique', cctvOwner: 'Total Energies Djibouti' },
    ],
    measurements: [
      { id: 'm4', item: 'Post-impact stopping (Veh 2)', distance: '12.3', unit: 'meters', notes: 'Distance from point of impact to final rest position of Vehicle 2, northbound lane' },
      { id: 'm5', item: 'Carriageway width', distance: '3.5', unit: 'meters', notes: 'Per lane, standard dual carriageway configuration at incident location' },
    ],
    evidenceNotes: 'CCTV footage obtained from Total Energies Djibouti — Station Total perimeter camera #3. Footage covers approach and impact. CCTV operator contacted: M. Hassan Ibrahim. Copy secured on evidence drive EV-2025-0041.',
  },
  {
    id: 'RPT-2025-0040',
    status: 'draft',
    createdAt: '2025-01-14T08:00:00',
    officerId: '1',
    location: { address: 'Avenue Georges Clemenceau, près de la Banque Centrale', latitude: 11.5889, longitude: 43.1480 },
    date: '2025-01-14',
    time: '07:45',
    accidentType: 'pedestrian strike',
    severity: 'fatal',
    weather: 'Clear Night',
    roadCondition: 'Dry',
    lighting: 'Street Lighting',
    vehicles: [
      { id: 'v5', plateNumber: 'DJ-9988-E', brand: 'Hyundai', model: 'Tucson', color: 'Argent', vehicleType: 'Passenger Car', insuranceCategory: 'Local Insurances', insuranceCompany: 'African Takaful Insurance', insurancePolicy: 'POL-55678' },
    ],
    parties: [
      { id: 'p5', type: 'driver', firstName: 'Aden', lastName: 'Robleh Awaleh', idNumber: 'ID-86420', phone: '77 99 00 11', address: 'Rue de Bender', licenseNumber: 'DL-11223', licenseCategory: 'B', licenseExpiry: '2027-06-30', injuries: 'none' },
      { id: 'p6', type: 'pedestrian', firstName: 'Inconnu', lastName: '', idNumber: '', phone: '', address: '', licenseNumber: '', licenseCategory: '', licenseExpiry: '', injuries: 'critical' },
    ],
    witnesses: [
      { id: 'w2', firstName: 'Saida', lastName: 'Hassan', phone: '77 22 33 44', address: 'Avenue Georges Clemenceau', statement: 'Le piéton a traversé en dehors du passage clouté.' },
    ],
    description: 'Vehicle 1 (DJ-9988-E) was travelling eastbound when a pedestrian (identity unknown) crossed the carriageway outside the designated pedestrian crossing zone. Pedestrian struck by front offside of vehicle. Emergency services responded; pedestrian pronounced deceased at scene by medical examiner.',
    damageDescription: 'Vehicle 1: Front offside bonnet denting consistent with human impact, windscreen star fracture (passenger side), minor bumper deformation. Vehicle secured for forensic examination.',
    officerObservations: 'Pedestrian crossing violation — subject crossed 4.2m south of regulated zebra crossing. Street lighting functional (lamp posts LP-0891 and LP-0892 operational). No vehicular defects observed on Vehicle 1. Driver cooperative, negative for impairment. Attempted identification of deceased ongoing — fingerprints and photographs taken.',
    photos: [],
    videos: [],
    measurements: [
      { id: 'm6', item: 'Impact point to designated crossing', distance: '4.2', unit: 'meters', notes: 'Pedestrian struck 4.2m south of regulated zebra crossing — crossing violation' },
      { id: 'm7', item: 'Driver visibility range', distance: '85', unit: 'meters', notes: 'Clear visibility eastbound with street lighting — no obstruction' },
      { id: 'm8', item: 'Blood evidence trail', distance: '2.1', unit: 'meters', notes: 'Blood trail from impact point to final rest position of pedestrian' },
    ],
    evidenceNotes: 'No CCTV in immediate vicinity. Nearest CCTV: Banque Centrale (150m east) — footage requested. Blood samples collected from scene (KIT-B-2025-0040). Tyre marks: none — no emergency braking. Vehicle 1 secured at impound for forensic inspection. Body referred to Institut Médico-Légal for autopsy.',
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    screen: 'splash',
    officer: null,
    reports: mockReports,
    currentReport: null,
    previousScreen: null,
  });

  const navigate = useCallback((screen: AppScreen) => {
    setState(prev => ({ ...prev, previousScreen: prev.screen, screen }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: prev.previousScreen ?? 'dashboard',
      previousScreen: null,
    }));
  }, []);

  const login = useCallback((officer: Officer) => {
    setState(prev => ({ ...prev, officer, screen: 'dashboard' }));
  }, []);

  const logoff = useCallback(() => {
    setState(prev => ({
      ...prev,
      officer: null,
      screen: 'login',
      currentReport: null,
    }));
  }, []);

  const createNewReport = useCallback(() => {
    const newReport: AccidentReport = {
      id: '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      officerId: state.officer?.id ?? '',
      location: { address: '', latitude: 11.5721, longitude: 43.1456 },
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      accidentType: '',
      severity: 'minor',
      weather: 'Soleil',
      roadCondition: '',
      lighting: '',
      vehicles: [],
      parties: [],
      witnesses: [],
      description: '',
      damageDescription: '',
      officerObservations: '',
      photos: [],
      videos: [],
      measurements: [],
      evidenceNotes: '',
    };
    setState(prev => ({ ...prev, currentReport: newReport, screen: 'accident-report' }));
  }, [state.officer]);

  const updateCurrentReport = useCallback((report: Partial<AccidentReport>) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport ? { ...prev.currentReport, ...report } : null,
    }));
  }, []);

  const submitCurrentReport = useCallback(() => {
    setState(prev => {
      if (!prev.currentReport) return prev;
      const reportId = `RPT-2025-${String(prev.reports.length + 43).padStart(4, '0')}`;
      const submittedReport: AccidentReport = {
        ...prev.currentReport,
        id: reportId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        reports: [submittedReport, ...prev.reports],
        currentReport: submittedReport,
        screen: 'report-success',
      };
    });
  }, []);

  const addPhotoToCurrentReport = useCallback((photo: AccidentPhoto) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, photos: [...prev.currentReport.photos, photo] }
        : null,
    }));
  }, []);

  const removePhotoFromCurrentReport = useCallback((photoId: string) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, photos: prev.currentReport.photos.filter(p => p.id !== photoId) }
        : null,
    }));
  }, []);

  const addVideoToCurrentReport = useCallback((video: EvidenceVideo) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, videos: [...prev.currentReport.videos, video] }
        : null,
    }));
  }, []);

  const removeVideoFromCurrentReport = useCallback((videoId: string) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, videos: prev.currentReport.videos.filter(v => v.id !== videoId) }
        : null,
    }));
  }, []);

  const addMeasurementToCurrentReport = useCallback((measurement: Measurement) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, measurements: [...prev.currentReport.measurements, measurement] }
        : null,
    }));
  }, []);

  const removeMeasurementFromCurrentReport = useCallback((measurementId: string) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, measurements: prev.currentReport.measurements.filter(m => m.id !== measurementId) }
        : null,
    }));
  }, []);

  const addVehicleToCurrentReport = useCallback((vehicle: VehicleInfo) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, vehicles: [...prev.currentReport.vehicles, vehicle] }
        : null,
    }));
  }, []);

  const removeVehicleFromCurrentReport = useCallback((vehicleId: string) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, vehicles: prev.currentReport.vehicles.filter(v => v.id !== vehicleId) }
        : null,
    }));
  }, []);

  const addPartyToCurrentReport = useCallback((party: PartyInfo) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, parties: [...prev.currentReport.parties, party] }
        : null,
    }));
  }, []);

  const removePartyFromCurrentReport = useCallback((partyId: string) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, parties: prev.currentReport.parties.filter(p => p.id !== partyId) }
        : null,
    }));
  }, []);

  const addWitnessToCurrentReport = useCallback((witness: WitnessInfo) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, witnesses: [...prev.currentReport.witnesses, witness] }
        : null,
    }));
  }, []);

  const removeWitnessFromCurrentReport = useCallback((witnessId: string) => {
    setState(prev => ({
      ...prev,
      currentReport: prev.currentReport
        ? { ...prev.currentReport, witnesses: prev.currentReport.witnesses.filter(w => w.id !== witnessId) }
        : null,
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigate,
        goBack,
        login,
        logoff,
        createNewReport,
        updateCurrentReport,
        submitCurrentReport,
        addPhotoToCurrentReport,
        addVehicleToCurrentReport,
        removeVehicleFromCurrentReport,
        addPartyToCurrentReport,
        removePartyFromCurrentReport,
        addWitnessToCurrentReport,
        removeWitnessFromCurrentReport,
        removePhotoFromCurrentReport,
        addVideoToCurrentReport,
        removeVideoFromCurrentReport,
        addMeasurementToCurrentReport,
        removeMeasurementFromCurrentReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
