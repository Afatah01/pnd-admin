import { Switch } from "@/components/ui/switch";
import { Shield, Database, Bell, Globe, AlertTriangle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500">Configure application preferences and security</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-800" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">General</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-500">Switch between light and dark themes</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Language</p>
              <p className="text-xs text-gray-500">Interface language</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs font-bold">English</Button>
              <Button size="sm" variant="outline" className="text-xs font-bold">Francais</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-800" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Email Notifications", desc: "Receive email alerts for new reports" },
            { label: "Push Notifications", desc: "Browser push notifications" },
            { label: "Report Alerts", desc: "Alert when new accident report submitted" },
            { label: "System Alerts", desc: "Critical system notifications" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-800" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Require 2FA for admin accounts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Session Timeout</p>
              <p className="text-xs text-gray-500">Auto-logout after 30 minutes of inactivity</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">IP Whitelist</p>
              <p className="text-xs text-gray-500">Restrict access to specific IP ranges</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-800" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Database</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="text-xs font-bold uppercase">
            <Database className="w-4 h-4 mr-2" /> Backup Now
          </Button>
          <Button variant="outline" className="text-xs font-bold uppercase">
            <Database className="w-4 h-4 mr-2" /> Restore
          </Button>
          <Button variant="outline" className="text-xs font-bold uppercase">
            <Database className="w-4 h-4 mr-2" /> Auto-Backup: Daily
          </Button>
        </div>
      </div>

      {/* Confidentiality Warning */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-900 uppercase tracking-wide">RESTRICTED — LAW ENFORCEMENT SENSITIVE</p>
            <p className="text-xs text-amber-800 mt-1">
              All data is classified as Law Enforcement Sensitive. Unauthorized access, disclosure, or distribution is a criminal offence under Article 21 of the Criminal Procedure Code of the Republic of Djibouti.
            </p>
          </div>
        </div>
      </div>

      <Button className="w-full h-12 bg-blue-800 hover:bg-blue-900 text-white font-bold uppercase tracking-wide">
        <Save className="w-5 h-5 mr-2" /> Save All Settings
      </Button>
    </div>
  );
}
