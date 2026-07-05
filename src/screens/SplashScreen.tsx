import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function SplashScreen() {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => navigate('login'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gradient-to-b from-blue-800 to-blue-950 text-white p-6">
      <div className="animate-fade-in flex flex-col items-center">
        <img
          src="/logo2.jpg"
          alt="Police Nationale de Djibouti"
          className="w-32 h-32 object-contain mb-6 rounded-xl shadow-2xl bg-white p-1"
          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg'; }}
        />
        <h1 className="text-2xl font-black text-center tracking-widest mb-1">POLICE NATIONALE</h1>
        <h2 className="text-xl font-bold text-center tracking-widest text-blue-200 mb-1">DE DJIBOUTI</h2>
        <p className="text-blue-300 text-center text-sm mb-1 font-semibold tracking-wide">DIRECTION DE LA SECURITE PUBLIQUE</p>
        <p className="text-yellow-400 text-center text-lg font-black tracking-widest mb-6">BRIGADE DES ACCIDENTS</p>
        <div className="w-20 h-0.5 bg-yellow-400 mb-6" />
        <p className="text-xs text-blue-300 text-center font-semibold tracking-wider uppercase">Accident Reporting & Evidence Collection System</p>
      </div>
      <div className="absolute bottom-12 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: '200ms' }} />
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: '400ms' }} />
      </div>
      <p className="absolute bottom-5 text-[10px] text-blue-400 uppercase tracking-widest font-semibold">v2.1.0 — Law Enforcement Sensitive</p>
    </div>
  );
}
