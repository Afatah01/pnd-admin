import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft, MapPin, Calendar, Clock, CloudRain, Moon, CloudLightning,
  Sun, Cloud, Car, User, Users, Camera, FileText, CheckCircle, Trash2, Plus, RotateCcw,
  ClipboardList, Video, Ruler, StickyNote, Monitor, Plane, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { VehicleInfo, PartyInfo, WitnessInfo, EvidenceVideo, Measurement } from '@/types';
import {
  LOCAL_INSURANCES, CROSS_BORDER_INSURANCES,
  LOCAL_DRIVING_LICENSES, CROSS_BORDER_DRIVING_LICENSES,
  PRIVATE_VEHICLE_TYPES, GOVERNMENT_VEHICLE_TYPES,
} from '@/types';

const STEPS = [
  'Scene Location', 'Incident Details', 'Vehicle Registration', 'Involved Persons',
  'Witness Statements', 'Photographic Evidence', 'Video & Measurements',
  'Officer Narrative', 'Case Review'
];

const ACCIDENT_TYPES = [
  'head-on collision', 'rear-end collision', 'side-impact collision', 'rollover',
  'pedestrian strike', 'cyclist strike', 'single-vehicle crash', 'multi-vehicle pile-up',
  'property damage only', 'other'
];

const WEATHER_OPTIONS = [
  { value: 'Clear', icon: Sun },
  { value: 'Overcast', icon: Cloud },
  { value: 'Rain', icon: CloudRain },
  { value: 'Fog/Mist', icon: Cloud },
  { value: 'Night — Illuminated', icon: Moon },
  { value: 'Night — Unlit', icon: Moon },
  { value: 'Storm', icon: CloudLightning },
];

const ROAD_CONDITIONS = ['Dry', 'Wet', 'Slippery', 'Flooded', 'Ice/Frost', 'Debris', 'Under Repair'];
const LIGHTING_OPTIONS = ['Daylight', 'Dawn/Dusk', 'Street Lighting', 'Vehicle Headlights Only', 'No Illumination'];

function getSeverityClass(severity: string, selected: boolean) {
  if (selected) {
    switch (severity) {
      case 'minor': return 'bg-green-100 border-green-400 text-green-800';
      case 'moderate': return 'bg-amber-100 border-amber-400 text-amber-800';
      case 'serious': return 'bg-orange-100 border-orange-400 text-orange-800';
      case 'fatal': return 'bg-red-100 border-red-400 text-red-800';
    }
  }
  return 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100';
}

export default function AccidentReportScreen() {
  const {
    currentReport, updateCurrentReport, submitCurrentReport, goBack,
    addVehicleToCurrentReport, removeVehicleFromCurrentReport,
    addPartyToCurrentReport, removePartyFromCurrentReport,
    addWitnessToCurrentReport, removeWitnessFromCurrentReport,
    addPhotoToCurrentReport, removePhotoFromCurrentReport,
    addVideoToCurrentReport, removeVideoFromCurrentReport,
    addMeasurementToCurrentReport, removeMeasurementFromCurrentReport,
  } = useApp();
  const [step, setStep] = useState(0);

  const [vehicleForm, setVehicleForm] = useState<Partial<VehicleInfo>>({});
  const [partyForm, setPartyForm] = useState<Partial<PartyInfo>>({ type: 'driver', injuries: 'none' });
  const [witnessForm, setWitnessForm] = useState<Partial<WitnessInfo>>({});

  const [insuranceGroup, setInsuranceGroup] = useState<'local' | 'cross-border'>('local');
  const [licenseGroup, setLicenseGroup] = useState<'local' | 'cross-border'>('local');
  const [vehicleGroup, setVehicleGroup] = useState<'private' | 'government'>('private');

  // Evidence form state
  const [videoType, setVideoType] = useState<'land' | 'drone' | 'cctv'>('land');
  const [videoCaption, setVideoCaption] = useState('');
  const [cctvAvailable, setCctvAvailable] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [cctvLocation, setCctvLocation] = useState('');
  const [cctvOwner, setCctvOwner] = useState('');

  const [measurementForm, setMeasurementForm] = useState<Partial<Measurement>>({ unit: 'meters' });

  if (!currentReport) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => step === 0 ? goBack() : setStep(s => s - 1);

  const addVehicle = () => {
    if (vehicleForm.plateNumber) {
      addVehicleToCurrentReport({
        id: `v-${Date.now()}`, plateNumber: vehicleForm.plateNumber || '', brand: vehicleForm.brand || '',
        model: vehicleForm.model || '', color: vehicleForm.color || '', vehicleType: vehicleForm.vehicleType || '',
        insuranceCategory: vehicleForm.insuranceCategory || '', insuranceCompany: vehicleForm.insuranceCompany || '',
        insurancePolicy: vehicleForm.insurancePolicy || '',
      });
      setVehicleForm({});
    }
  };

  const addParty = () => {
    if (partyForm.firstName) {
      addPartyToCurrentReport({
        id: `p-${Date.now()}`, type: (partyForm.type as 'driver' | 'passenger' | 'pedestrian') || 'driver',
        firstName: partyForm.firstName || '', lastName: partyForm.lastName || '', idNumber: partyForm.idNumber || '',
        phone: partyForm.phone || '', address: partyForm.address || '', licenseNumber: partyForm.licenseNumber || '',
        licenseCategory: partyForm.licenseCategory || '', licenseExpiry: partyForm.licenseExpiry || '',
        injuries: (partyForm.injuries as 'none' | 'minor' | 'serious' | 'critical') || 'none',
      });
      setPartyForm({ type: 'driver', injuries: 'none' });
    }
  };

  const addWitness = () => {
    if (witnessForm.firstName) {
      addWitnessToCurrentReport({
        id: `w-${Date.now()}`, firstName: witnessForm.firstName || '', lastName: witnessForm.lastName || '',
        phone: witnessForm.phone || '', address: witnessForm.address || '', statement: witnessForm.statement || '',
      });
      setWitnessForm({});
    }
  };

  const addMockPhoto = () => {
    const captions = ['Scene overview', 'Vehicle 1 — front aspect', 'Vehicle 1 — rear aspect', 'Collision damage', 'Road surface evidence', 'Traffic control devices'];
    addPhotoToCurrentReport({
      id: `photo-${Date.now()}`, url: `https://picsum.photos/400/300?random=${Date.now()}`,
      caption: captions[Math.floor(Math.random() * captions.length)], timestamp: new Date().toISOString(),
    });
  };

  const addVideo = () => {
    if (videoCaption) {
      const newVideo: EvidenceVideo = {
        id: `vid-${Date.now()}`, videoType, url: `https://example.com/video-${Date.now()}`,
        caption: videoCaption, timestamp: new Date().toISOString(),
        ...(videoType === 'cctv' ? { cctvLocation, cctvOwner } : {}),
      };
      addVideoToCurrentReport(newVideo);
      setVideoCaption('');
      setCctvLocation('');
      setCctvOwner('');
    }
  };

  const addMeasurement = () => {
    if (measurementForm.item && measurementForm.distance) {
      addMeasurementToCurrentReport({
        id: `m-${Date.now()}`, item: measurementForm.item || '', distance: measurementForm.distance || '',
        unit: measurementForm.unit || 'meters', notes: measurementForm.notes || '',
      });
      setMeasurementForm({ unit: 'meters' });
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={handleBack} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 uppercase tracking-wide">Accident Report</h1>
            <p className="text-xs text-gray-500 font-semibold uppercase">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-800' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
        {/* STEP 0: Scene Location */}
        {step === 0 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-800" />
                <Label className="text-sm font-bold uppercase tracking-wide">GPS Coordinates</Label>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 mb-2">
                <p className="text-xs text-blue-900 font-mono font-bold">
                  LAT {currentReport.location.latitude.toFixed(6)} / LON {currentReport.location.longitude.toFixed(6)}
                </p>
              </div>
              <Button variant="outline" size="sm" className="text-xs font-bold uppercase" onClick={() => {}}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Refresh Position
              </Button>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Label className="text-sm font-bold mb-2 block uppercase tracking-wide">Incident Location</Label>
              <Textarea
                value={currentReport.location.address}
                onChange={e => updateCurrentReport({ location: { ...currentReport.location, address: e.target.value } })}
                placeholder="Enter full street address or nearest identifiable landmark"
                className="bg-gray-50 border-gray-200 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-800" />
                  <Label className="text-sm font-bold uppercase">Date of Incident</Label>
                </div>
                <Input type="date" value={currentReport.date} onChange={e => updateCurrentReport({ date: e.target.value })} className="bg-gray-50 border-gray-200 text-gray-900" />
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-800" />
                  <Label className="text-sm font-bold uppercase">Time of Incident</Label>
                </div>
                <Input type="time" value={currentReport.time} onChange={e => updateCurrentReport({ time: e.target.value })} className="bg-gray-50 border-gray-200 text-gray-900" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Incident Details */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Label className="text-sm font-bold mb-3 block uppercase tracking-wide">Classification of Incident</Label>
              <div className="grid grid-cols-2 gap-2">
                {ACCIDENT_TYPES.map(type => (
                  <button key={type} onClick={() => updateCurrentReport({ accidentType: type })} className={`p-2.5 rounded-lg text-xs font-semibold border transition-colors text-left capitalize ${currentReport.accidentType === type ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Label className="text-sm font-bold mb-3 block uppercase tracking-wide">Severity Classification</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['minor', 'moderate', 'serious', 'fatal'] as const).map(s => (
                  <button key={s} onClick={() => updateCurrentReport({ severity: s })} className={`p-2.5 rounded-lg text-xs font-bold border transition-colors uppercase tracking-wide ${getSeverityClass(s, currentReport.severity === s)}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Label className="text-sm font-bold mb-3 block uppercase tracking-wide">Atmospheric Conditions</Label>
              <div className="grid grid-cols-4 gap-2">
                {WEATHER_OPTIONS.map(w => (
                  <button key={w.value} onClick={() => updateCurrentReport({ weather: w.value })} className={`p-2 rounded-lg text-[10px] font-semibold border flex flex-col items-center gap-1 transition-colors ${currentReport.weather === w.value ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                    <w.icon className="w-4 h-4" />{w.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Label className="text-sm font-bold mb-2 block uppercase tracking-wide">Road Surface</Label>
                <select value={currentReport.roadCondition} onChange={e => updateCurrentReport({ roadCondition: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  <option value="">Select condition</option>{ROAD_CONDITIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Label className="text-sm font-bold mb-2 block uppercase tracking-wide">Lighting</Label>
                <select value={currentReport.lighting} onChange={e => updateCurrentReport({ lighting: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  <option value="">Select lighting</option>{LIGHTING_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle Registration */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            {currentReport.vehicles.map(v => (
              <div key={v.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-800" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 font-mono">{v.plateNumber}</p>
                      <p className="text-xs text-gray-500">{v.brand} {v.model} — {v.color}</p>
                      {v.vehicleType && <p className="text-xs text-blue-800 font-bold">{v.vehicleType}</p>}
                      <p className="text-xs text-gray-400">{v.insuranceCategory}: {v.insuranceCompany}</p>
                      <p className="text-xs text-gray-400 font-mono">Policy: {v.insurancePolicy}</p>
                    </div>
                  </div>
                  <button onClick={() => removeVehicleFromCurrentReport(v.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Register Vehicle</p>
              <div className="mb-3">
                <Label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Vehicle Category</Label>
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setVehicleGroup('private')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${vehicleGroup === 'private' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>Private</button>
                  <button onClick={() => setVehicleGroup('government')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${vehicleGroup === 'government' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>Government</button>
                </div>
                <select value={vehicleForm.vehicleType || ''} onChange={e => setVehicleForm(f => ({ ...f, vehicleType: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  <option value="">Select vehicle classification</option>
                  {vehicleGroup === 'private' ? (
                    <optgroup label="Private Vehicle">{PRIVATE_VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</optgroup>
                  ) : (
                    <optgroup label="Government Vehicle">{GOVERNMENT_VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</optgroup>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <Input placeholder="Registration Plate" value={vehicleForm.plateNumber || ''} onChange={e => setVehicleForm(f => ({ ...f, plateNumber: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="Manufacturer" value={vehicleForm.brand || ''} onChange={e => setVehicleForm(f => ({ ...f, brand: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="Model" value={vehicleForm.model || ''} onChange={e => setVehicleForm(f => ({ ...f, model: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="Color" value={vehicleForm.color || ''} onChange={e => setVehicleForm(f => ({ ...f, color: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
              </div>

              <div className="mb-3">
                <Label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Insurance Coverage</Label>
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setInsuranceGroup('local')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${insuranceGroup === 'local' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>Local</button>
                  <button onClick={() => setInsuranceGroup('cross-border')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${insuranceGroup === 'cross-border' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>Cross-Border</button>
                </div>
                <select value={vehicleForm.insuranceCompany || ''} onChange={e => setVehicleForm(f => ({ ...f, insuranceCompany: e.target.value, insuranceCategory: insuranceGroup === 'local' ? 'Local Insurances' : 'Cross-Border Insurances' }))} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  <option value="">Select insurer</option>
                  {insuranceGroup === 'local' ? (
                    <optgroup label="Local Insurances">{LOCAL_INSURANCES.map(i => <option key={i} value={i}>{i}</option>)}</optgroup>
                  ) : (
                    <optgroup label="Cross-Border Insurances">{CROSS_BORDER_INSURANCES.map(i => <option key={i} value={i}>{i}</option>)}</optgroup>
                  )}
                </select>
              </div>

              <Input placeholder="Policy Number" value={vehicleForm.insurancePolicy || ''} onChange={e => setVehicleForm(f => ({ ...f, insurancePolicy: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm mb-3" />
              <Button size="sm" variant="outline" onClick={addVehicle} className="text-xs font-bold uppercase"><Plus className="w-3.5 h-3.5 mr-1" /> Register Vehicle</Button>
            </div>
          </div>
        )}

        {/* STEP 3: Involved Persons */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            {currentReport.parties.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-blue-800" />
                      <p className="text-sm font-bold text-gray-900">{p.firstName} {p.lastName}</p>
                      <Badge className={`text-[10px] font-bold uppercase ${p.type === 'driver' ? 'bg-blue-100 text-blue-800' : p.type === 'passenger' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {p.type === 'driver' ? 'Driver' : p.type === 'passenger' ? 'Passenger' : 'Pedestrian'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">ID: {p.idNumber || 'N/A'} — TEL: {p.phone || 'N/A'}</p>
                    {p.licenseNumber && <p className="text-xs text-gray-400">License: {p.licenseNumber} ({p.licenseCategory})</p>}
                    <Badge className={`text-[10px] mt-1 font-bold uppercase ${p.injuries === 'none' ? 'bg-green-100 text-green-800' : p.injuries === 'minor' ? 'bg-amber-100 text-amber-800' : p.injuries === 'serious' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                      {p.injuries === 'none' ? 'No Injuries' : p.injuries === 'minor' ? 'Minor Injuries' : p.injuries === 'serious' ? 'Serious Injuries' : 'Critical'}
                    </Badge>
                  </div>
                  <button onClick={() => removePartyFromCurrentReport(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Register Involved Person</p>
              <div className="flex gap-2 mb-3">
                {(['driver', 'passenger', 'pedestrian'] as const).map(t => (
                  <button key={t} onClick={() => setPartyForm(f => ({ ...f, type: t }))} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${partyForm.type === t ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>{t}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input placeholder="Given Name" value={partyForm.firstName || ''} onChange={e => setPartyForm(f => ({ ...f, firstName: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="Surname" value={partyForm.lastName || ''} onChange={e => setPartyForm(f => ({ ...f, lastName: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="National ID" value={partyForm.idNumber || ''} onChange={e => setPartyForm(f => ({ ...f, idNumber: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="Telephone" value={partyForm.phone || ''} onChange={e => setPartyForm(f => ({ ...f, phone: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
              </div>

              {partyForm.type === 'driver' && (
                <div className="mb-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <Label className="text-xs font-bold text-blue-800 mb-1 block uppercase">Driver License Classification</Label>
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setLicenseGroup('local')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${licenseGroup === 'local' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white border-gray-200 text-gray-600'}`}>Local</button>
                    <button onClick={() => setLicenseGroup('cross-border')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${licenseGroup === 'cross-border' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white border-gray-200 text-gray-600'}`}>Cross-Border</button>
                  </div>
                  <select value={partyForm.licenseCategory || ''} onChange={e => setPartyForm(f => ({ ...f, licenseCategory: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-900 mb-2">
                    <option value="">Select classification</option>
                    {licenseGroup === 'local' ? (
                      <optgroup label="Local Driving Licenses">{LOCAL_DRIVING_LICENSES.map(l => <option key={l} value={l}>{l}</option>)}</optgroup>
                    ) : (
                      <optgroup label="Cross-Border Driving Licenses">{CROSS_BORDER_DRIVING_LICENSES.map(l => <option key={l} value={l}>{l}</option>)}</optgroup>
                    )}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="License Number" value={partyForm.licenseNumber || ''} onChange={e => setPartyForm(f => ({ ...f, licenseNumber: e.target.value }))} className="bg-white border-gray-200 text-gray-900 text-sm" />
                    <Input placeholder="Expiry" type="date" value={partyForm.licenseExpiry || ''} onChange={e => setPartyForm(f => ({ ...f, licenseExpiry: e.target.value }))} className="bg-white border-gray-200 text-gray-900 text-sm" />
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-2 overflow-x-auto">
                {(['none', 'minor', 'serious', 'critical'] as const).map(i => (
                  <button key={i} onClick={() => setPartyForm(f => ({ ...f, injuries: i }))} className={`flex-1 py-1.5 rounded-md text-[10px] font-bold border whitespace-nowrap uppercase tracking-wide ${partyForm.injuries === i ? getSeverityClass(i, true) : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    {i === 'none' ? 'None' : i === 'minor' ? 'Minor' : i === 'serious' ? 'Serious' : 'Critical'}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={addParty} className="text-xs font-bold uppercase"><Plus className="w-3.5 h-3.5 mr-1" /> Register Person</Button>
            </div>
          </div>
        )}

        {/* STEP 4: Witness Statements */}
        {step === 4 && (
          <div className="space-y-4 animate-slide-up">
            {currentReport.witnesses.map(w => (
              <div key={w.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-800" />
                      <p className="text-sm font-bold text-gray-900">{w.firstName} {w.lastName}</p>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">TEL: {w.phone}</p>
                    {w.statement && <p className="text-xs text-gray-600 mt-1 italic bg-gray-50 p-2 rounded-lg border border-gray-100">&ldquo;{w.statement}&rdquo;</p>}
                  </div>
                  <button onClick={() => removeWitnessFromCurrentReport(w.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Record Witness Statement</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input placeholder="Given Name" value={witnessForm.firstName || ''} onChange={e => setWitnessForm(f => ({ ...f, firstName: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="Surname" value={witnessForm.lastName || ''} onChange={e => setWitnessForm(f => ({ ...f, lastName: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                <Input placeholder="Telephone" value={witnessForm.phone || ''} onChange={e => setWitnessForm(f => ({ ...f, phone: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm col-span-2" />
              </div>
              <Textarea placeholder="Enter witness statement verbatim" value={witnessForm.statement || ''} onChange={e => setWitnessForm(f => ({ ...f, statement: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm mb-2" />
              <Button size="sm" variant="outline" onClick={addWitness} className="text-xs font-bold uppercase"><Plus className="w-3.5 h-3.5 mr-1" /> Record Statement</Button>
            </div>
          </div>
        )}

        {/* STEP 5: Photographic Evidence */}
        {step === 5 && (
          <div className="space-y-4 animate-slide-up">
            {currentReport.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {currentReport.photos.map(photo => (
                  <div key={photo.id} className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                    <button onClick={() => removePhotoFromCurrentReport(photo.id)} className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full"><Trash2 className="w-3 h-3" /></button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5">
                      <p className="text-[10px] text-white font-semibold truncate">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-14 border-dashed border-2 border-gray-300" onClick={addMockPhoto}>
                <Camera className="w-5 h-5 mr-2 text-blue-800" /><span className="text-xs font-bold uppercase">Capture Photo</span>
              </Button>
              <Button variant="outline" className="flex-1 h-14 border-dashed border-2 border-gray-300" onClick={addMockPhoto}>
                <Plus className="w-5 h-5 mr-2 text-blue-800" /><span className="text-xs font-bold uppercase">Gallery</span>
              </Button>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-blue-800 font-bold mb-2 uppercase tracking-wide">Required photographic documentation:</p>
              <div className="flex flex-wrap gap-2">
                {['Scene overview', 'Vehicle positions', 'Collision damage', 'Road markings', 'Traffic signals', 'Environmental factors'].map(c => (
                  <span key={c} className="text-[10px] px-2 py-1 bg-white rounded-md text-blue-800 border border-blue-200 font-semibold">{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: VIDEO & MEASUREMENTS */}
        {step === 6 && (
          <div className="space-y-6 animate-slide-up">
            {/* VIDEO EVIDENCE */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-blue-800" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Video Evidence Log</h3>
              </div>

              {currentReport.videos.map(v => (
                <div key={v.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {v.videoType === 'land' && <Video className="w-5 h-5 text-blue-800" />}
                      {v.videoType === 'drone' && <Plane className="w-5 h-5 text-purple-700" />}
                      {v.videoType === 'cctv' && <Monitor className="w-5 h-5 text-green-700" />}
                      <div>
                        <p className="text-sm font-bold text-gray-900">{v.caption}</p>
                        <Badge className={`text-[10px] font-bold uppercase mt-0.5 ${v.videoType === 'land' ? 'bg-blue-100 text-blue-800' : v.videoType === 'drone' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {v.videoType === 'land' ? 'Ground-Level Footage' : v.videoType === 'drone' ? 'Aerial / Drone Footage' : 'CCTV Recording'}
                        </Badge>
                        {v.videoType === 'cctv' && v.cctvLocation && (
                          <p className="text-xs text-gray-500 mt-0.5">Location: {v.cctvLocation}</p>
                        )}
                        {v.videoType === 'cctv' && v.cctvOwner && (
                          <p className="text-xs text-gray-500">Owner: {v.cctvOwner}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={() => removeVideoFromCurrentReport(v.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Log Video Evidence</p>

                {/* Video Type Selection */}
                <div className="flex gap-2 mb-3">
                  {[
                    { key: 'land' as const, label: 'Ground-Level', icon: Video },
                    { key: 'drone' as const, label: 'Aerial / Drone', icon: Plane },
                    { key: 'cctv' as const, label: 'CCTV', icon: Monitor },
                  ].map(vt => (
                    <button key={vt.key} onClick={() => setVideoType(vt.key)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border flex flex-col items-center gap-1 transition-colors uppercase tracking-wide ${videoType === vt.key ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      <vt.icon className="w-4 h-4" />{vt.label}
                    </button>
                  ))}
                </div>

                {/* CCTV Availability Check */}
                {videoType === 'cctv' && (
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <Label className="text-xs font-bold text-amber-800 uppercase">CCTV Availability</Label>
                    </div>
                    <p className="text-xs text-amber-700 mb-2">Is a CCTV camera available near the accident scene?</p>
                    <div className="flex gap-2 mb-3">
                      <button onClick={() => setCctvAvailable('yes')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${cctvAvailable === 'yes' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-white border-gray-200 text-gray-600'}`}>Yes — Obtain Footage</button>
                      <button onClick={() => setCctvAvailable('no')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors uppercase ${cctvAvailable === 'no' ? 'bg-red-100 border-red-400 text-red-800' : 'bg-white border-gray-200 text-gray-600'}`}>No CCTV</button>
                    </div>
                    {cctvAvailable === 'yes' && (
                      <>
                        <Input placeholder="CCTV Camera Location" value={cctvLocation} onChange={e => setCctvLocation(e.target.value)} className="bg-white border-gray-200 text-gray-900 text-sm mb-2" />
                        <Input placeholder="CCTV Owner / Operator" value={cctvOwner} onChange={e => setCctvOwner(e.target.value)} className="bg-white border-gray-200 text-gray-900 text-sm mb-2" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase flex-1 h-10 border-dashed border-2">
                            <Video className="w-3.5 h-3.5 mr-1" /> Upload Footage
                          </Button>
                        </div>
                      </>
                    )}
                    {cctvAvailable === 'no' && (
                      <p className="text-xs text-red-600 font-semibold">No CCTV coverage at incident location. Document scene with officer-worn camera and photographic evidence.</p>
                    )}
                  </div>
                )}

                {videoType !== 'cctv' && (
                  <Input placeholder="Enter video evidence description" value={videoCaption} onChange={e => setVideoCaption(e.target.value)} className="bg-gray-50 border-gray-200 text-gray-900 text-sm mb-2" />
                )}

                <Button size="sm" variant="outline" onClick={addVideo} className="text-xs font-bold uppercase" disabled={videoType === 'cctv' && cctvAvailable !== 'yes'}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Log Video Entry
                </Button>
              </div>
            </div>

            {/* MEASUREMENTS SECTION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="w-5 h-5 text-blue-800" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Scene Measurements</h3>
              </div>

              {currentReport.measurements.map(m => (
                <div key={m.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-blue-800" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{m.item}</p>
                        <p className="text-xs text-blue-800 font-bold">{m.distance} {m.unit}</p>
                        {m.notes && <p className="text-xs text-gray-500">{m.notes}</p>}
                      </div>
                    </div>
                    <button onClick={() => removeMeasurementFromCurrentReport(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Record Measurement</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input placeholder="Measured item (e.g. skid marks)" value={measurementForm.item || ''} onChange={e => setMeasurementForm(f => ({ ...f, item: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                  <Input placeholder="Distance value" value={measurementForm.distance || ''} onChange={e => setMeasurementForm(f => ({ ...f, distance: e.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select value={measurementForm.unit || 'meters'} onChange={e => setMeasurementForm(f => ({ ...f, unit: e.target.value }))} className="h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-900">
                    <option value="meters">Meters</option>
                    <option value="centimeters">Centimeters</option>
                    <option value="feet">Feet</option>
                    <option value="inches">Inches</option>
                  </select>
                </div>
                <Textarea
                  placeholder="Detailed description of measurement location, direction from point of impact, and any relevant spatial relationships to scene landmarks"
                  value={measurementForm.notes || ''}
                  onChange={e => setMeasurementForm(f => ({ ...f, notes: e.target.value }))}
                  className="bg-gray-50 border-gray-200 text-gray-900 text-sm mb-3 min-h-[80px]"
                />
                <Button size="sm" variant="outline" onClick={addMeasurement} className="text-xs font-bold uppercase"><Plus className="w-3.5 h-3.5 mr-1" /> Record Measurement</Button>
              </div>
            </div>

            {/* ADDITIONAL EVIDENCE NOTES */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-5 h-5 text-blue-800" />
                <Label className="text-sm font-bold uppercase tracking-wide">Supplementary Evidence Notes</Label>
              </div>
              <Textarea
                value={currentReport.evidenceNotes}
                onChange={e => updateCurrentReport({ evidenceNotes: e.target.value })}
                placeholder="Document any additional physical evidence: tyre marks, debris scatter patterns, fluid traces, road surface conditions, signage, lighting conditions, or other material evidence observed at the scene."
                className="bg-gray-50 border-gray-200 text-gray-900 min-h-[100px]"
              />
            </div>
          </div>
        )}

        {/* STEP 7: Officer Narrative */}
        {step === 7 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-800" />
                <Label className="text-sm font-bold uppercase tracking-wide">Incident Narrative</Label>
              </div>
              <Textarea value={currentReport.description} onChange={e => updateCurrentReport({ description: e.target.value })} placeholder="Provide a chronological account of the incident, including sequence of events, contributing factors, and any observations relevant to causation." className="bg-gray-50 border-gray-200 text-gray-900 min-h-[120px]" />
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-5 h-5 text-blue-800" />
                <Label className="text-sm font-bold uppercase tracking-wide">Damage Assessment</Label>
              </div>
              <Textarea value={currentReport.damageDescription} onChange={e => updateCurrentReport({ damageDescription: e.target.value })} placeholder="Document all property damage: vehicle damage (by area), infrastructure damage, and third-party property affected." className="bg-gray-50 border-gray-200 text-gray-900 min-h-[100px]" />
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-5 h-5 text-blue-800" />
                <Label className="text-sm font-bold uppercase tracking-wide">Investigating Officer Remarks</Label>
              </div>
              <Textarea value={currentReport.officerObservations} onChange={e => updateCurrentReport({ officerObservations: e.target.value })} placeholder="Record professional observations: apparent cause, contributory factors, scene conditions, and any preliminary determinations." className="bg-gray-50 border-gray-200 text-gray-900 min-h-[100px]" />
            </div>
          </div>
        )}

        {/* STEP 8: Case Review */}
        {step === 8 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
              <CheckCircle className="w-8 h-8 text-green-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Case File Review</p>
              <p className="text-xs text-green-700">Verify all information before transmission to Command Center</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-blue-800" />
                <p className="text-sm font-bold uppercase">Scene Location</p>
              </div>
              <p className="text-xs text-gray-600">{currentReport.location.address || 'Not specified'}</p>
              <p className="text-xs text-gray-500 font-mono">{currentReport.date} at {currentReport.time}</p>
              <p className="text-xs text-gray-400 font-mono mt-1">LAT {currentReport.location.latitude.toFixed(6)} / LON {currentReport.location.longitude.toFixed(6)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-sm font-bold mb-2 uppercase">Incident Classification</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gray-100 text-gray-800 font-bold uppercase text-[10px]">{currentReport.accidentType || 'Unclassified'}</Badge>
                <Badge className={`font-bold uppercase text-[10px] ${getSeverityClass(currentReport.severity, true)}`}>
                  {currentReport.severity === 'minor' ? 'Minor' : currentReport.severity === 'moderate' ? 'Moderate' : currentReport.severity === 'serious' ? 'Serious' : 'Fatal'}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">{currentReport.weather}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { icon: Car, label: 'Vehicles', count: currentReport.vehicles.length },
                { icon: User, label: 'Persons', count: currentReport.parties.length },
                { icon: Users, label: 'Witnesses', count: currentReport.witnesses.length },
                { icon: Camera, label: 'Photos', count: currentReport.photos.length },
                { icon: Ruler, label: 'Measures', count: currentReport.measurements.length },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl p-2.5 text-center border border-gray-100 shadow-sm">
                  <item.icon className="w-4 h-4 text-blue-800 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{item.count}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{item.label}</p>
                </div>
              ))}
            </div>
            {currentReport.videos.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-blue-800" />
                  <p className="text-sm font-bold uppercase">Video Evidence Log</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentReport.videos.map(v => (
                    <Badge key={v.id} className={`text-[10px] font-bold uppercase ${v.videoType === 'land' ? 'bg-blue-100 text-blue-800' : v.videoType === 'drone' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {v.videoType === 'land' ? 'Ground' : v.videoType === 'drone' ? 'Drone' : 'CCTV'}: {v.caption}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <Button className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-base uppercase tracking-wide" onClick={submitCurrentReport}>
              <CheckCircle className="w-5 h-5 mr-2" /> Transmit to Command Center
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      {step < STEPS.length - 1 && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 z-10">
          <Button className="w-full h-12 bg-blue-800 hover:bg-blue-900 text-white font-bold uppercase tracking-wide" onClick={handleNext}>Proceed to Next Step</Button>
        </div>
      )}
    </div>
  );
}
