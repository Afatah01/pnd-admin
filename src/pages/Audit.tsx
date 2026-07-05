import { trpc } from "@/providers/trpc";
import { ClipboardList, Shield, Activity, FileText, Settings as SettingsIcon } from "lucide-react";

const actionIcons: Record<string, any> = {
  login: Shield,
  logout: Shield,
  create: FileText,
  update: SettingsIcon,
  delete: Activity,
  approve: Shield,
  reject: Activity,
};

export default function Audit() {
  const auditQuery = trpc.audit.list.useQuery({ limit: 50 });
  const logs = auditQuery.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-sm text-gray-500">Complete activity trail and system changes</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Action</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Details</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log: any) => {
                const Icon = actionIcons[log.action?.toLowerCase()] || ClipboardList;
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-800" />
                        <span className="font-semibold text-gray-900">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{log.resource} {log.resourceId && <span className="font-mono text-xs">({log.resourceId})</span>}</td>
                    <td className="px-4 py-3 text-gray-600">{log.userName || "System"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-semibold uppercase">No audit logs yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
