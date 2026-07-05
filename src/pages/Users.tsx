import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users as UsersIcon, Shield, UserCheck, UserX, Plus } from "lucide-react";

const roleColors: Record<string, string> = {
  user: "bg-blue-100 text-blue-800",
  admin: "bg-purple-100 text-purple-800",
  super_admin: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-amber-100 text-amber-800",
  deleted: "bg-red-100 text-red-800",
};

export default function Users() {
  const [search, setSearch] = useState("");
  const usersQuery = trpc.auth.listUsers.useQuery();

  const users = (usersQuery.data || []).filter((u: any) =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Create, edit, suspend, and manage system users</p>
        </div>
        <Button className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <UsersIcon className="w-5 h-5 text-blue-800 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Total Users</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <UserCheck className="w-5 h-5 text-green-700 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{users.filter((u: any) => u.status === "active").length}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Shield className="w-5 h-5 text-purple-700 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{users.filter((u: any) => u.role === "admin" || u.role === "super_admin").length}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Admins</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <UserX className="w-5 h-5 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{users.filter((u: any) => u.status === "suspended").length}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Suspended</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Last Sign In</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name || "Unnamed"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] font-bold uppercase ${roleColors[user.role] || "bg-gray-100"}`}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] font-bold uppercase ${statusColors[user.status] || "bg-gray-100"}`}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" className="text-xs font-bold">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-semibold uppercase">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
