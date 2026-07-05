import { useApp } from '@/context/AppContext';
import { CheckCircle, Home, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ReportSuccessScreen() {
  const { currentReport, navigate } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 px-6">
      <div className="animate-slide-up flex flex-col items-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-700" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Case Transmitted</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Accident report successfully transmitted to the Command Center for processing
        </p>

        {currentReport && (
          <div className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-900 font-mono">{currentReport.id || 'NEW CASE'}</p>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs font-bold uppercase">Transmitted to CC</Badge>
            </div>
            <p className="text-xs text-gray-500 font-mono">
              {new Date().toLocaleDateString('en-US')} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
          </div>
        )}

        <div className="w-full space-y-3">
          <Button className="w-full h-12 bg-blue-800 hover:bg-blue-900 text-white font-bold uppercase tracking-wide" onClick={() => navigate('dashboard')}>
            <Home className="w-5 h-5 mr-2" /> Return to Operations
          </Button>
          <Button variant="outline" className="w-full h-12 border-gray-200 text-gray-700 font-bold uppercase tracking-wide" onClick={() => navigate('history')}>
            <History className="w-5 h-5 mr-2" /> View Case Records
          </Button>
        </div>
      </div>
    </div>
  );
}
