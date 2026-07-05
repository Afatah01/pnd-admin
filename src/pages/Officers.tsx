import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Plus, Phone, Mail, MapPin, X, Copy, Check } from "lucide-react";

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

const RANKS = ["constable", "corporal", "sergeant", "inspector", "chief_inspector", "superintendent", "chief_superintendent", "commissioner", "brigadier", "colonel", "general"];

export default function Officers() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    badgeNumber: "", firstName: "", lastName: "", rank: "constable",
    stationId: 1, phone: "", email: "", joinDate: "",
  });
  const [formError, setFormError] = useState("");

  const utils = trpc.useUtils();
  const officersQuery = trpc.officer.list.useQuery({ search: search || undefined });
  const stationsQuery = trpc.officer.stations.useQuery();
  const statsQuery = trpc.officer.stats.useQuery();
  const createMutation = trpc.officer.create.useMutation({
    onSuccess: () => {
      utils.officer.list.invalidate();
      utils.officer.stats.invalidate();
      setShowForm(false);
      setFormData({ badgeNumber: "", firstName: "", lastName: "", rank: "constable", stationId: 1, phone: "", email: "", joinDate: "" });
      setFormError("");
    },
    onError: (err: any) => setFormError(err.message || "Failed to create officer"),
  });

  const officers = officersQuery.data?.officers || [];
  const stations = stationsQuery.data || [];
  const stats = statsQuery.data;

  const stationMap = Object.fromEntries(stations.map((s: any) => [s.id, s.name]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.badgeNumber || !formData.firstName || !formData.lastName || !formData.joinDate) {
      setFormError("Badge number, first name, last name, and join date are required");
      return;
    }
    createMutation.mutate(formData);
  };

  const copyAuthCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Officers</h1>
          <p className="text-sm text-gray-500">Manage police officers and their mobile auth codes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase">
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
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-green-700">{stats?.active || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-amber-700">{stats?.onLeave || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">On Leave</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-red-700">{stats?.suspended || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Suspended</p>
        </div>
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
                <p className="text-xs text-gray-500 font-mono mt-0.5">Badge: {officer.badgeNumber}</p>
                
                {/* Auth Code — KEY FEATURE */}
                {officer.authCode && officer.status === "active" && (
                  <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-green-700 font-bold uppercase">Mobile Auth Code:</span>
                    <span className="text-sm font-mono font-bold text-green-900">{officer.authCode}</span>
                    <button
                      onClick={() => copyAuthCode(officer.authCode, officer.id)}
                      className="ml-auto text-green-600 hover:text-green-800"
                      title="Copy auth code"
                    >
                      {copiedId === officer.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                <div className="mt-2 space-y-1">
                  {officer.phone && <p className="text-xs text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3" /> {officer.phone}</p>}
                  {officer.email && <p className="text-xs text-gray-600 flex items-center gap-1"><Mail className="w-3 h-3" /> {officer.email}</p>}
                  {officer.stationId && <p className="text-xs text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3" /> {stationMap[officer.stationId] || officer.stationName || "Unknown Station"}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Officer Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Add New Officer</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {formError && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{formError}</div>}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Badge Number *</label>
                <Input value={formData.badgeNumber} onChange={e => setFormData({...formData, badgeNumber: e.target.value})} placeholder="e.g. 9999" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">First Name *</label>
                  <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="First name" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Last Name *</label>
                  <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Last name" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Rank</label>
                  <select value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})} className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                    {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Station</label>
                  <select value={formData.stationId} onChange={e => setFormData({...formData, stationId: Number(e.target.value)})} className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                    {stations.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Phone</label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+253 77 XX XX XX" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="officer@pnd.gov.dj" type="email" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Join Date *</label>
                <Input value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})} type="date" required />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                <p className="font-bold">A random 4-digit auth code will be generated automatically.</p>
                <p>The officer uses this code with their badge number to log in on the mobile app.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white">
                  {createMutation.isPending ? "Creating..." : "Create Officer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
