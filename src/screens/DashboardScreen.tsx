import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FilePlus, History, Bell, Home, Settings, ClipboardList,
  CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'minor': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-semibold">MINOR</Badge>;
    case 'moderate': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs font-semibold">MODERATE</Badge>;
    case 'serious': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs font-semibold">SERIOUS</Badge>;
    case 'fatal': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs font-semibold">FATAL</Badge>;
    default: return null;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'submitted': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs font-semibold">SUBMITTED</Badge>;
    case 'validated': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-semibold">VALIDATED</Badge>;
    case 'draft': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs font-semibold">DRAFT</Badge>;
    default: return null;
  }
}

export default function DashboardScreen() {
  const { officer, reports, createNewReport, navigate } = useApp();
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const submitted = reports.filter(r => r.status === 'submitted').length;
  const drafts = reports.filter(r => r.status === 'draft').length;
  const alerts = 2;

  const recentReports = reports.slice(0, 3);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-sm">
              {officer?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{officer?.name}</p>
              <p className="text-xs text-gray-500">{officer?.rank} — {officer?.badge}</p>
            </div>
          </div>
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            {alerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {alerts}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse-dot" />
            <span className="text-xs text-green-700 font-bold uppercase tracking-wide">On Duty</span>
          </div>
          <span className="text-xs text-gray-500 font-mono font-semibold">
            {clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto scrollbar-hide">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={createNewReport} className="bg-blue-800 hover:bg-blue-900 text-white rounded-xl p-4 flex flex-col items-center gap-2 transition-colors shadow-sm">
            <FilePlus className="w-7 h-7" />
            <span className="text-sm font-bold uppercase tracking-wide">New Report</span>
          </button>
          <button onClick={() => navigate('history')} className="bg-white border border-gray-200 hover:border-gray-300 text-gray-800 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors shadow-sm">
            <History className="w-7 h-7 text-gray-600" />
            <span className="text-sm font-bold uppercase tracking-wide">Case History</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <CheckCircle className="w-5 h-5 text-blue-800 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">{submitted}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Submitted</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">{drafts}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">{alerts}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Alerts</p>
          </div>
        </div>

        {/* Dispatch Alerts */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Dispatch Alerts
          </h3>
          <div className="space-y-2">
            <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs mb-1 font-bold">URGENT</Badge>
                  <p className="text-sm font-bold text-gray-900 uppercase">Traffic Collision</p>
                </div>
                <span className="text-xs text-gray-400 font-mono font-semibold">09:23</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Boulevard de la Republique, near Total station</p>
              <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white text-xs h-8 font-bold uppercase tracking-wide">
                Accept Dispatch
              </Button>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs mb-1 font-bold">STANDARD</Badge>
                  <p className="text-sm font-bold text-gray-900 uppercase">Traffic Incident</p>
                </div>
                <span className="text-xs text-gray-400 font-mono font-semibold">09:15</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Route de l&apos;Aeroport Ambouli, km 5</p>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-bold">DISPATCHED</Badge>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
            <ClipboardList className="w-4 h-4 text-blue-800" />
            Recent Case Files
          </h3>
          <div className="space-y-2">
            {recentReports.map(report => (
              <div key={report.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-bold text-gray-900 font-mono">{report.id}</p>
                  <div className="flex gap-1">
                    {getStatusBadge(report.status)}
                    {getSeverityBadge(report.severity)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{report.location.address}</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">{report.date} at {report.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center sticky bottom-0 z-10">
        <button className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-blue-50 text-blue-800">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wide">Home</span>
        </button>
        <button onClick={createNewReport} className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-gray-500 hover:bg-gray-50">
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wide">Report</span>
        </button>
        <button onClick={() => navigate('history')} className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-gray-500 hover:bg-gray-50">
          <History className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wide">Records</span>
        </button>
        <button onClick={() => navigate('settings')} className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-gray-500 hover:bg-gray-50">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wide">Config</span>
        </button>
      </div>
    </div>
  );
}
