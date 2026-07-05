import { trpc } from "@/providers/trpc";
import {
  FileText, Shield, AlertTriangle, CheckCircle,
  TrendingUp, Activity
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

  const stats = statsQuery.data;
  const officerStats = officerStatsQuery.data;

  const totalReports = stats?.total || 0;
  const todayReports = stats?.today || 0;
  const monthReports = stats?.thisMonth || 0;
  const totalOfficers = officerStats?.total || 0;

  const pendingCount = stats?.byStatus?.find((s: any) => s.status === "submitted")?.count || 0;
  const approvedCount = stats?.byStatus?.find((s: any) => s.status === "approved")?.count || 0;
  const reviewCount = stats?.byStatus?.find((s: any) => s.status === "under_review")?.count || 0;

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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: "Report approved", item: "RPT-2025-0042", user: "Col. Mohamed Hassan", time: "2 min ago", icon: CheckCircle, color: "text-green-600" },
            { action: "Report submitted", item: "RPT-2025-0043", user: "Brig. Ahmed Omar", time: "15 min ago", icon: FileText, color: "text-blue-600" },
            { action: "Officer assigned", item: "UR-4521", user: "Admin", time: "1 hr ago", icon: Shield, color: "text-purple-600" },
            { action: "Audit log export", item: "System", user: "Super Admin", time: "3 hrs ago", icon: Activity, color: "text-gray-600" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{item.action} — <span className="font-mono text-blue-800">{item.item}</span></p>
                <p className="text-xs text-gray-500">by {item.user} — {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
