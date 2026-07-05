import { useApp } from '@/context/AppContext';
import SplashScreen from '@/screens/SplashScreen';
import LoginScreen from '@/screens/LoginScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import AccidentReportScreen from '@/screens/AccidentReportScreen';
import ReportSuccessScreen from '@/screens/ReportSuccessScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import SettingsScreen from '@/screens/SettingsScreen';

function AppContent() {
  const { screen } = useApp();

  switch (screen) {
    case 'splash':
      return <SplashScreen />;
    case 'login':
      return <LoginScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    case 'accident-report':
      return <AccidentReportScreen />;
    case 'report-success':
      return <ReportSuccessScreen />;
    case 'history':
      return <HistoryScreen />;
    case 'settings':
      return <SettingsScreen />;
    default:
      return <SplashScreen />;
  }
}

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mobile-frame">
        <AppContent />
      </div>
    </div>
  );
}
