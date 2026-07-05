import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft, Bell, Wifi, WifiOff, Shield, LogOut,
  ClipboardList, CheckCircle, AlertTriangle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SettingsScreen() {
  const { officer, reports, logoff, goBack } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [dispatchAlerts, setDispatchAlerts] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const totalReports = reports.length;
  const submittedCount = reports.filter(r => r.status === 'submitted' || r.status === 'validated').length;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900 uppercase tracking-wide">System Configuration</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto scrollbar-hide">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-lg">
              {officer?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">{officer?.name}</p>
              <p className="text-sm text-gray-500 font-semibold uppercase">{officer?.rank}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-800 text-xs font-bold">{officer?.badge}</Badge>
                <span className="text-xs text-gray-400 font-semibold uppercase">{officer?.sector}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <ClipboardList className="w-5 h-5 text-blue-800 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Cases</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <CheckCircle className="w-5 h-5 text-green-700 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{submittedCount}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Transmitted</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-800" />
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Alert Configuration</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
            <div><p className="text-sm text-gray-700 font-semibold">Dispatch Alerts</p><p className="text-xs text-gray-400">Receive operational alerts from Command Center</p></div>
            <Switch checked={dispatchAlerts} onCheckedChange={setDispatchAlerts} />
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
            <div><p className="text-sm text-gray-700 font-semibold">Audio Alerts</p><p className="text-xs text-gray-400">Enable notification sounds</p></div>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div><p className="text-sm text-gray-700 font-semibold">Haptic Alerts</p><p className="text-xs text-gray-400">Enable vibration for alerts</p></div>
            <Switch checked={vibration} onCheckedChange={setVibration} />
          </div>
        </div>

        {/* Network */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {offlineMode ? <WifiOff className="w-4 h-4 text-red-600" /> : <Wifi className="w-4 h-4 text-green-700" />}
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Network Status</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div><p className="text-sm text-gray-700 font-semibold">Offline Mode</p><p className="text-xs text-gray-400">Store reports locally for later transmission</p></div>
            <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
          </div>
          <div className="px-4 py-3 bg-green-50 border-t border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <p className="text-xs text-green-800 font-bold">Command Center — Connected</p>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-800" />
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">System Information</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="px-4 py-3 flex items-center justify-between"><p className="text-sm text-gray-500">Version</p><p className="text-sm font-bold text-gray-900 font-mono">v2.1.0</p></div>
            <div className="px-4 py-3 flex items-center justify-between"><p className="text-sm text-gray-500">Application</p><p className="text-sm font-bold text-gray-900">UR Accident</p></div>
            <div className="px-4 py-3 flex items-center justify-between"><p className="text-sm text-gray-500">Organization</p><p className="text-sm font-bold text-gray-900">Police Nationale de Djibouti</p></div>
            <div className="px-4 py-3 flex items-center justify-between"><p className="text-sm text-gray-500">Ministry</p><p className="text-sm font-bold text-gray-900">Ministere de l&apos;Interieur</p></div>
          </div>
        </div>

        {/* Confidentiality Warning */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 mb-1 uppercase tracking-wide">Restricted — Law Enforcement Sensitive</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Data contained in this system is classified as Law Enforcement Sensitive and is protected under Article 21 of the Criminal Procedure Code of the Republic of Djibouti. Unauthorized access, disclosure, or distribution is a criminal offence.
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="destructive" className="w-full h-12 font-bold uppercase tracking-wide" onClick={() => setShowLogoutConfirm(true)}>
          <LogOut className="w-5 h-5 mr-2" /> Terminate Session
        </Button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Confirm Session Termination</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to end your session? All unsaved data will be lost.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-11 font-bold uppercase" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
              <Button className="flex-1 h-11 bg-red-700 hover:bg-red-800 text-white font-bold uppercase" onClick={() => { setShowLogoutConfirm(false); logoff(); }}>Terminate</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
