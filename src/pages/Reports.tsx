import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, CheckCircle, XCircle, Trash2, ChevronDown, ChevronUp, MapPin, Calendar, Clock } from "lucide-react";

const severityColors: Record<string, string> = {
  minor: "bg-green-100 text-green-800",
  moderate: "bg-amber-100 text-amber-800",
  serious: "bg-orange-100 text-orange-800",
  fatal: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function Reports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const reportsQuery = trpc.report.list.useQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    severity: severityFilter || undefined,
  });

  const statusMutation = trpc.report.updateStatus.useMutation({
    onSuccess: () => { utils.report.list.invalidate(); utils.report.stats.invalidate(); },
  });
  const deleteMutation = trpc.report.delete.useMutation({
    onSuccess: () => { utils.report.list.invalidate(); utils.report.stats.invalidate(); },
  });

  const reports = reportsQuery.data?.reports || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accident Reports</h1>
          <p className="text-sm text-gray-500">Manage and review all accident reports</p>
        </div>
        <Button variant="outline" className="text-xs font-bold uppercase"><FileText className="w-4 h-4 mr-2" /> Export</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by ID, location..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm">
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm">
            <option value="">All Severity</option>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="serious">Serious</option>
            <option value="fatal">Fatal</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((report: any) => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === report.id ? null : report.id)} className="w-full p-4 text-left">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-gray-900">{report.reportId}</span>
                    <Badge className={`text-[10px] font-bold uppercase ${statusColors[report.status]}`}>{report.status}</Badge>
                    <Badge className={`text-[10px] font-bold uppercase ${severityColors[report.severity]}`}>{report.severity}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {report.location}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-2"><Calendar className="w-3 h-3" /> {report.accidentDate} <Clock className="w-3 h-3 ml-2" /> {report.accidentTime}</p>
                </div>
                {expandedId === report.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </button>

            {expandedId === report.id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Weather</p><p className="font-semibold text-gray-700">{report.weather || "N/A"}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Road Surface</p><p className="font-semibold text-gray-700">{report.roadCondition || "N/A"}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Type</p><p className="font-semibold text-gray-700">{report.accidentType || "N/A"}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">GPS</p><p className="font-mono text-gray-700">{report.latitude}, {report.longitude}</p></div>
                </div>
                {report.description && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Description</p>
                    <p className="text-xs text-blue-900">{report.description}</p>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  {report.status !== "approved" && (
                    <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs uppercase" onClick={() => statusMutation.mutate({ id: report.id, status: "approved" })} disabled={statusMutation.isPending}><CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve</Button>
                  )}
                  {report.status !== "rejected" && (
                    <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs uppercase" onClick={() => statusMutation.mutate({ id: report.id, status: "rejected" })} disabled={statusMutation.isPending}><XCircle className="w-3.5 h-3.5 mr-1" /> Reject</Button>
                  )}
                  <Button size="sm" variant="outline" className="border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-xs uppercase ml-auto" onClick={() => { if (confirm("Delete this report?")) deleteMutation.mutate({ id: report.id }); }} disabled={deleteMutation.isPending}><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete</Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-semibold uppercase">No reports yet</p>
            <p className="text-xs text-gray-400 mt-1">Reports will appear when officers submit them from the mobile app</p>
          </div>
        )}
      </div>
    </div>
  );
}
