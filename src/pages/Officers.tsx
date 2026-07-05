import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Plus, Phone, Mail, MapPin } from "lucide-react";

const rankColors: Record<string, string> = {
  constable: "bg-gray-100 text-gray-700",
  corporal: "bg-blue-100 text-blue-800",
  sergeant: "bg-blue-100 text-blue-800",
  inspector: "bg-purple-100 text-purple-800",
  chief_inspector: "bg-purple-100 text-purple-800",
  superintendent: "bg-orange-100 text-orange-800",
  chief_superintendent: "bg-orange-100 text-orange-800",
  commissioner: "bg-red-100 text-red-800",
  brigadier: "bg-red-100 text-red-800",
  colonel: "bg-red-100 text-red-800",
  general: "bg-yellow-100 text-yellow-800",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  on_leave: "bg-amber-100 text-amber-800",
  suspended: "bg-red-100 text-red-800",
  retired: "bg-gray-100 text-gray-500",
};

export default function Officers() {
  const [search, setSearch] = useState("");
  const officersQuery = trpc.officer.list.useQuery({ search: search || undefined });
  const stationsQuery = trpc.officer.stations.useQuery();
  const statsQuery = trpc.officer.stats.useQuery();

  const officers = officersQuery.data || [];
  const stations = stationsQuery.data || [];
  const stats = statsQuery.data;

  const stationMap = Object.fromEntries(stations.map((s: any) => [s.id, s.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Officers</h1>
          <p className="text-sm text-gray-500">Manage police officers and assignments</p>
        </div>
        <Button className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase">
          <Plus className="w-4 h-4 mr-2" /> Add Officer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Shield className="w-5 h-5 text-blue-800 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Total Officers</p>
        </div>
        {stats?.byRank?.slice(0, 3).map((r: any) => (
          <div key={r.rank} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{r.count}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">{r.rank}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by badge, name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {officers.map((officer: any) => (
          <div key={officer.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {officer.firstName[0]}{officer.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900">{officer.firstName} {officer.lastName}</p>
                  <Badge className={`text-[10px] font-bold uppercase ${rankColors[officer.rank] || "bg-gray-100"}`}>
                    {officer.rank}
                  </Badge>
                  <Badge className={`text-[10px] font-bold uppercase ${statusColors[officer.status] || "bg-gray-100"}`}>
                    {officer.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{officer.badgeNumber}</p>
                <div className="mt-2 space-y-1">
                  {officer.phone && <p className="text-xs text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3" /> {officer.phone}</p>}
                  {officer.email && <p className="text-xs text-gray-600 flex items-center gap-1"><Mail className="w-3 h-3" /> {officer.email}</p>}
                  {officer.stationId && <p className="text-xs text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3" /> {stationMap[officer.stationId] || "Unknown Station"}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
