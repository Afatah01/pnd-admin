import { trpc } from "@/providers/trpc";
import { BarChart3, MapPin, TrendingUp, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const execQuery = trpc.analytics.executive.useQuery();
  const hotspotsQuery = trpc.analytics.hotspots.useQuery();
  const timeSeriesQuery = trpc.analytics.timeSeries.useQuery({ period: "monthly" });

  const exec = execQuery.data;
  const hotspots = hotspotsQuery.data || [];
  const timeSeries = timeSeriesQuery.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Comprehensive accident analysis and trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Total Reports", value: exec?.totalReports || 0, color: "text-blue-800" },
          { icon: TrendingUp, label: "Total Officers", value: exec?.totalOfficers || 0, color: "text-green-700" },
          { icon: BarChart3, label: "Active Officers", value: exec?.activeOfficers || 0, color: "text-purple-700" },
          { icon: MapPin, label: "Hotspots", value: hotspots.length, color: "text-red-700" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Accidents Over Time</h3>
        <div className="h-48 flex items-end gap-1">
          {timeSeries.map((point: any, i: number) => {
            const maxCount = Math.max(...timeSeries.map((t: any) => t.count), 1);
            const height = (point.count / maxCount) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-800 rounded-t" style={{ height: `${height}%` }} />
                <span className="text-[8px] text-gray-500 rotate-0">{point.date?.slice(5)}</span>
              </div>
            );
          }) || <p className="text-sm text-gray-400 w-full text-center">No time series data available</p>}
        </div>
      </div>

      {/* Hotspot Map Data */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Accident Hotspots (GPS)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {hotspots.slice(0, 10).map((spot: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{spot.location}</p>
                <p className="text-xs text-gray-500 font-mono">{spot.latitude?.toFixed(4)}, {spot.longitude?.toFixed(4)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{spot.count}</p>
                <p className="text-[10px] text-gray-500 uppercase">incidents</p>
              </div>
            </div>
          ))}
          {hotspots.length === 0 && (
            <p className="text-sm text-gray-400 col-span-2 text-center py-6">No hotspot data available</p>
          )}
        </div>
      </div>

      {/* Accident Type Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Accidents by Type</h3>
        <div className="space-y-2">
          {exec?.byType?.map((t: any) => (
            <div key={t.type} className="flex items-center gap-3">
              <span className="text-xs font-semibold w-40 text-gray-600 capitalize">{t.type?.replace(/_/g, " ")}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full flex items-center justify-end pr-2 text-[9px] font-bold text-white" style={{ width: `${Math.min(100, (t.count / (exec?.totalReports || 1)) * 500)}%` }}>
                  {t.count}
                </div>
              </div>
            </div>
          )) || <p className="text-sm text-gray-400">No data available</p>}
        </div>
      </div>
    </div>
  );
}
