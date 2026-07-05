import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft, Search, ChevronDown, ChevronUp, Car, User, Users,
  ClipboardList, Video, Ruler
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const FILTERS = ['All Cases', 'Submitted', 'Validated', 'Pending'] as const;

function getStatusBadge(status: string) {
  switch (status) {
    case 'submitted': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs font-bold uppercase">Submitted</Badge>;
    case 'validated': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-bold uppercase">Validated</Badge>;
    case 'draft': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase">Pending</Badge>;
    default: return null;
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'minor': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-bold uppercase">Minor</Badge>;
    case 'moderate': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs font-bold uppercase">Moderate</Badge>;
    case 'serious': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs font-bold uppercase">Serious</Badge>;
    case 'fatal': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs font-bold uppercase">Fatal</Badge>;
    default: return null;
  }
}

export default function HistoryScreen() {
  const { reports, goBack } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All Cases');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = reports.filter(r => {
    const matchesSearch = !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.location.address.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All Cases' ||
      (filter === 'Submitted' && r.status === 'submitted') ||
      (filter === 'Validated' && r.status === 'validated') ||
      (filter === 'Pending' && r.status === 'draft');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900 uppercase tracking-wide">Case Records</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by case number or location..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-gray-50 border-gray-200 text-gray-900 text-sm" />
        </div>
      </div>

      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors uppercase tracking-wide ${filter === f ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto scrollbar-hide">
        {filtered.map(report => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === report.id ? null : report.id)} className="w-full p-4 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900 font-mono">{report.id}</p>
                    <div className="flex gap-1">{getStatusBadge(report.status)}{getSeverityBadge(report.severity)}</div>
                  </div>
                  <p className="text-xs text-gray-500">{report.location.address}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{report.date} at {report.time}</p>
                </div>
                {expandedId === report.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {expandedId === report.id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3 animate-slide-up">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-blue-800" />
                  <p className="text-xs text-gray-600 capitalize">{report.accidentType?.replace(/-/g, ' ')}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Weather</p><p className="text-gray-700 font-semibold">{report.weather}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Road Surface</p><p className="text-gray-700 font-semibold">{report.roadCondition || 'N/A'}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Lighting</p><p className="text-gray-700 font-semibold">{report.lighting || 'N/A'}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">GPS</p><p className="text-gray-700 font-mono">{report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}</p></div>
                </div>
                {report.vehicles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1"><Car className="w-4 h-4 text-blue-800" /><p className="text-xs font-bold uppercase text-gray-900">Registered Vehicles</p></div>
                    {report.vehicles.map(v => (
                      <div key={v.id} className="ml-6">
                        <p className="text-xs text-gray-600 font-mono">{v.plateNumber} — {v.brand} {v.model}</p>
                        {v.vehicleType && <p className="text-xs text-blue-700 font-semibold">{v.vehicleType}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {report.parties.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1"><User className="w-4 h-4 text-blue-800" /><p className="text-xs font-bold uppercase text-gray-900">Involved Persons</p></div>
                    {report.parties.map(p => (
                      <div key={p.id} className="flex items-center gap-2 ml-6">
                        <p className="text-xs text-gray-600">{p.firstName} {p.lastName}</p>
                        <Badge className={`text-[10px] font-bold uppercase ${p.injuries === 'none' ? 'bg-green-100 text-green-800' : p.injuries === 'minor' ? 'bg-amber-100 text-amber-800' : p.injuries === 'serious' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                          {p.injuries === 'none' ? 'None' : p.injuries === 'minor' ? 'Minor' : p.injuries === 'serious' ? 'Serious' : 'Critical'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                {report.witnesses.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-blue-800" /><p className="text-xs font-bold uppercase text-gray-900">Witnesses</p></div>
                    {report.witnesses.map(w => <p key={w.id} className="text-xs text-gray-600 ml-6">{w.firstName} {w.lastName}</p>)}
                  </div>
                )}
                {report.videos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1"><Video className="w-4 h-4 text-blue-800" /><p className="text-xs font-bold uppercase text-gray-900">Video Evidence</p></div>
                    {report.videos.map(v => (
                      <div key={v.id} className="ml-6 mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${v.videoType === 'land' ? 'bg-blue-100 text-blue-800' : v.videoType === 'drone' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {v.videoType === 'land' ? 'Ground' : v.videoType === 'drone' ? 'Drone' : 'CCTV'}
                        </span>
                        <p className="text-xs text-gray-600 inline ml-1">{v.caption}</p>
                      </div>
                    ))}
                  </div>
                )}
                {report.measurements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1"><Ruler className="w-4 h-4 text-blue-800" /><p className="text-xs font-bold uppercase text-gray-900">Scene Measurements</p></div>
                    {report.measurements.map(m => (
                      <p key={m.id} className="text-xs text-gray-600 ml-6">{m.item}: <strong>{m.distance} {m.unit}</strong></p>
                    ))}
                  </div>
                )}
                {report.evidenceNotes && <div className="bg-blue-50 rounded-lg p-2 border border-blue-100"><p className="text-xs text-blue-600 font-bold mb-0.5 uppercase">Supplementary Evidence</p><p className="text-xs text-blue-900">{report.evidenceNotes}</p></div>}
                {report.description && <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400 font-bold mb-0.5 uppercase">Incident Narrative</p><p className="text-xs text-gray-700">{report.description}</p></div>}
                {report.officerObservations && <div className="bg-blue-50 rounded-lg p-2 border border-blue-100"><p className="text-xs text-blue-600 font-bold mb-0.5 uppercase">Officer Remarks</p><p className="text-xs text-blue-900">{report.officerObservations}</p></div>}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-semibold uppercase">No case records found</p>
          </div>
        )}
      </div>
    </div>
  );
}
