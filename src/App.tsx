import { Routes, Route } from "react-router";
import AdminLayout from "@/components/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import Reports from "@/pages/Reports";
import Officers from "@/pages/Officers";
import Users from "@/pages/Users";
import AnalyticsPage from "@/pages/AnalyticsPage";
import Audit from "@/pages/Audit";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/officers" element={<Officers />} />
        <Route path="/users" element={<Users />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  );
}
