import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Fingerprint, Eye, EyeOff, Shield, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_BASE = 'https://pnd-admin.onrender.com';

interface OfficerFromApi {
  id: number;
  badgeNumber: string;
  firstName: string;
  lastName: string;
  rank: string;
  stationName?: string;
}

export default function LoginScreen() {
  const { login } = useApp();
  const [officers, setOfficers] = useState<OfficerFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [badge, setBadge] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/officers`)
      .then(res => res.json())
      .then(data => {
        if (data?.officers) setOfficers(data.officers);
        setLoading(false);
      })
      .catch(() => {
        setError('Offline mode');
        setOfficers([
          { id: 1, badgeNumber: '4521', firstName: 'Mohamed', lastName: 'Hassan', rank: 'colonel', stationName: 'Commissariat Central' },
          { id: 2, badgeNumber: '3187', firstName: 'Ahmed', lastName: 'Omar', rank: 'brigadier', stationName: 'Commissariat Central' },
          { id: 3, badgeNumber: '7214', firstName: 'Fatima', lastName: 'Daher', rank: 'chief_inspector', stationName: 'Poste de Police Balbala' },
        ]);
        setLoading(false);
      });
  }, []);

  const handleLogin = async () => {
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeNumber: badge, authCode }),
      });
      const data = await res.json();
      if (!data.success) {
        setLoginError(data.error || 'Invalid credentials');
        setLoggingIn(false);
        return;
      }
      login({
        id: String(data.officer.id),
        name: `${data.officer.firstName} ${data.officer.lastName}`,
        badge: data.officer.badgeNumber,
        rank: data.officer.rank,
        sector: data.officer.stationName || 'Brigade des accidents',
      });
    } catch {
      setLoginError('Network error');
      setLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      <div className="bg-blue-800 text-white pt-12 pb-8 px-6 text-center">
        <img src="/logo.jpg" alt="PND" className="w-20 h-20 object-contain mx-auto mb-4 rounded-lg bg-white p-1 shadow-md" />
        <h1 className="text-lg font-bold tracking-wide">POLICE NATIONALE DE DJIBOUTI</h1>
        <p className="text-blue-200 text-sm mt-1">DIRECTION DE LA SECURITE PUBLIQUE</p>
        <p className="text-yellow-400 text-sm font-bold tracking-wider mt-0.5">BRIGADE DES ACCIDENTS</p>
      </div>

      <div className="flex-1 px-6 pt-8 pb-6">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-blue-800 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Officer Authentication</h2>
          <p className="text-gray-500 text-sm mt-1">Badge number + Auth code from dashboard</p>
        </div>

        {error && <div className="max-w-sm mx-auto mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 text-center">{error}</div>}

        <div className="space-y-4 max-w-sm mx-auto">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">Badge Number</label>
            <div className="relative">
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="e.g. 4521" value={badge} onChange={e => setBadge(e.target.value.replace(/\D/g, ''))} className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-900" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">Auth Code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type={showCode ? 'text' : 'password'} placeholder="4-digit code" value={authCode} onChange={e => setAuthCode(e.target.value.replace(/\D/g, '').slice(0, 4))} className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 text-gray-900" maxLength={4} />
              <button type="button" onClick={() => setShowCode(!showCode)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Get auth code from Admin Dashboard Officers page</p>
          </div>

          {loginError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 text-center">{loginError}</div>}

          <Button className="w-full h-12 bg-blue-800 hover:bg-blue-900 text-white font-bold text-base uppercase tracking-wide" onClick={handleLogin} disabled={!badge || !authCode || badge.length < 4 || authCode.length < 4 || loggingIn}>
            {loggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
          </Button>
        </div>

        <div className="mt-8 max-w-sm mx-auto">
          <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-widest font-semibold">
            {loading ? 'Loading...' : `Active Officers (${officers.length})`}
          </p>
          {loading ? <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-blue-800 animate-spin" /></div> : (
            <div className="space-y-2">
              {officers.map(o => (
                <button key={o.id} onClick={() => setBadge(o.badgeNumber)} className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${badge === o.badgeNumber ? 'bg-blue-50 border-blue-400' : 'border-gray-200 bg-gray-50 hover:bg-blue-50'}`}>
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-sm flex-shrink-0">{o.badgeNumber}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{o.firstName} {o.lastName}</p>
                    <p className="text-xs text-gray-500 capitalize">{o.rank} — {o.stationName || 'PND'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center pb-6 px-6">
        <p className="text-xs text-gray-400 uppercase tracking-wide">&copy; 2025 Police Nationale de Djibouti<br />Ministere de l&apos;Interieur — Securite Publique</p>
      </div>
    </div>
  );
}
