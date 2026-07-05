import { trpc } from "@/providers/trpc";
import {
  FileText, Shield, AlertTriangle, CheckCircle,
  TrendingUp, FileCheck, Clock, UserPlus
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color, trend }: any) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    green: "bg-green-50 text-green-800 border-green-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-800 border-red-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
  };
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6" />
        {trend && <span className="text-xs font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend}</span>}
      </div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide mt-1 opacity-80">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const statsQuery = trpc.report.stats.useQuery();
  const officerStatsQuery = trpc.officer.stats.useQuery();
  const recentReportsQuery = trpc.report.list.useQuery({ limit: 10 });

  const stats = statsQuery.data;
  const officerStats = officerStatsQuery.data;
  const recentReports = recentReportsQuery.data?.reports || [];

  const totalReports = stats?.total || 0;
  const todayReports = stats?.today || 0;
  const monthReports = stats?.thisMonth || 0;
  const totalOfficers = officerStats?.total || 0;

  const pendingCount = stats?.byStatus?.find((s: any) => s.status === "submitted")?.count || 0;
  const approvedCount = stats?.byStatus?.find((s: any) => s.status === "approved")?.count || 0;
  const reviewCount = stats?.byStatus?.find((s: any) => s.status === "under_review")?.count || 0;

  const statusIcon = (status: string) => {
    if (status === "approved") return FileCheck;
    if (status === "submitted") return FileText;
    if (status === "under_review") return Clock;
    return FileText;
  };

  const statusColor = (status: string) => {
    if (status === "approved") return "text-green-600";
    if (status === "submitted") return "text-blue-600";
    if (status === "under_review") return "text-amber-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="text-sm text-gray-500">Police Nationale de Djibouti — Brigade des Accidents</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Reports" value={totalReports} color="blue" trend="+12%" />
        <StatCard icon={AlertTriangle} label="Pending Review" value={pendingCount} color="amber" />
        <StatCard icon={CheckCircle} label="Approved" value={approvedCount} color="green" />
        <StatCard icon={Shield} label="Active Officers" value={totalOfficers} color="purple" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-bold">Today</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{todayReports}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-bold">This Month</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{monthReports}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-bold">Under Review</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{reviewCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-bold">Response Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">14m</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Accidents by Severity</h3>
          <div className="space-y-3">
            {stats?.bySeverity?.map((s: any) => (
              <div key={s.severity} className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase w-20 ${
                  s.severity === "minor" ? "text-green-700" :
                  s.severity === "moderate" ? "text-amber-700" :
                  s.severity === "serious" ? "text-orange-700" : "text-red-700"
                }`}>{s.severity}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                      s.severity === "minor" ? "bg-green-500" :
                      s.severity === "moderate" ? "bg-amber-500" :
                      s.severity === "serious" ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, (s.count / (totalReports || 1)) * 100 * 3)}%` }}
                  >
                    {s.count}
                  </div>
                </div>
              </div>
            )) || <p className="text-sm text-gray-400">No data available</p>}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Reports by Status</h3>
          <div className="space-y-3">
            {stats?.byStatus?.map((s: any) => (
              <div key={s.status} className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase w-24 text-gray-600">{s.status}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                      s.status === "approved" ? "bg-green-500" :
                      s.status === "submitted" ? "bg-blue-500" :
                      s.status === "under_review" ? "bg-amber-500" :
                      s.status === "draft" ? "bg-gray-400" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, (s.count / (totalReports || 1)) * 100 * 3)}%` }}
                  >
                    {s.count}
                  </div>
                </div>
              </div>
            )) || <p className="text-sm text-gray-400">No data available</p>}
          </div>
        </div>
      </div>

      {/* Recent Reports — REAL DATA */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Recent Reports</h3>
        {recentReports.length === 0 ? (
          <p className="text-sm text-gray-400">Loading reports...</p>
        ) : (
          <div className="space-y-3">
            {recentReports.slice(0, 8).map((report: any) => {
              const Icon = statusIcon(report.status);
              return (
                <div key={report.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <Icon className={`w-4 h-4 ${statusColor(report.status)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {report.reportId} — <span className="text-gray-600">{report.location}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {report.severity} • {report.weather} • {report.accidentDate}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    report.status === "approved" ? "bg-green-100 text-green-700" :
                    report.status === "submitted" ? "bg-blue-100 text-blue-700" :
                    report.status === "under_review" ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{report.status.replace("_", " ")}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
