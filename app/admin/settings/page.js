"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Bell, Database, Globe, Percent, Key, Power } from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setMaintenanceMode(data.maintenanceMode || false);
        setGlobalAnnouncement(data.globalAnnouncement || "");
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSaveSettings = async (updates) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        alert("Settings updated successfully");
      } else {
        alert("Failed to update settings");
      }
    } catch (err) {
      alert("Error updating settings");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "financial", label: "Financial", icon: Percent },
    { id: "security", label: "Security & API", icon: Key },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fadeUp">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-on-surface mb-2">System Settings</h1>
        <p className="text-on-surface-variant">Configure core platform parameters and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-diffused p-6 lg:p-8">
          
          {/* GENERAL SETTINGS */}
          {activeTab === "general" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-on-surface mb-1 flex items-center gap-2">
                  <Power size={20} className="text-primary" /> Maintenance Mode
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">Temporarily disable the platform for updates.</p>
                
                <div className="flex items-center justify-between p-4 border border-surface-container rounded-xl bg-surface-container-low">
                  <div>
                    <p className="font-semibold text-on-surface">Enable Maintenance Mode</p>
                    <p className="text-xs text-on-surface-variant">Users will see a "Be right back" screen.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={maintenanceMode}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setMaintenanceMode(val);
                        handleSaveSettings({ maintenanceMode: val });
                      }}
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-on-surface mb-1 flex items-center gap-2">
                  <Bell size={20} className="text-primary" /> Global Announcements
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">Display a banner at the top of the website for all users.</p>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="e.g., Use code SUMMER20 for 20% off!" 
                    value={globalAnnouncement}
                    onChange={(e) => setGlobalAnnouncement(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container p-3 rounded-xl text-on-surface focus:outline-none focus:border-primary" 
                  />
                  <button 
                    onClick={() => handleSaveSettings({ globalAnnouncement })}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Publish Banner
                  </button>
                  <button 
                    onClick={() => {
                      setGlobalAnnouncement("");
                      handleSaveSettings({ globalAnnouncement: "" });
                    }}
                    className="ml-4 bg-red-500 text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Clear Banner
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FINANCIAL SETTINGS */}
          {activeTab === "financial" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-on-surface mb-1 flex items-center gap-2">
                  <Percent size={20} className="text-primary" /> Platform Fee Percentage
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">The percentage cut the platform takes from every booking.</p>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input type="number" defaultValue="15" className="w-32 bg-surface-container-low border border-surface-container p-3 rounded-xl text-on-surface focus:outline-none focus:border-primary pl-4 pr-8 font-bold" />
                    <span className="absolute right-4 top-3 text-on-surface-variant font-bold">%</span>
                  </div>
                  <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-medium hover:bg-surface-container-highest transition-colors">Save</button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-on-surface mb-1 flex items-center gap-2">
                  <Database size={20} className="text-primary" /> Payout Threshold
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">Minimum amount an owner must earn before a payout is processed.</p>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-on-surface-variant font-bold">₹</span>
                    <input type="number" defaultValue="50" className="w-32 bg-surface-container-low border border-surface-container p-3 rounded-xl text-on-surface focus:outline-none focus:border-primary pl-8 font-bold" />
                  </div>
                  <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-medium hover:bg-surface-container-highest transition-colors">Save</button>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY & API */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-on-surface mb-1 flex items-center gap-2">
                  <Shield size={20} className="text-primary" /> API Integrations
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">Manage external API keys (Gemini, Stripe, Cloudinary).</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gemini API Key</label>
                    <input type="password" defaultValue="************************" className="w-full bg-surface-container-low border border-surface-container p-3 rounded-xl text-on-surface focus:outline-none focus:border-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Stripe Secret Key</label>
                    <input type="password" defaultValue="************************" className="w-full bg-surface-container-low border border-surface-container p-3 rounded-xl text-on-surface focus:outline-none focus:border-primary" />
                  </div>
                  <button className="bg-primary text-white px-6 py-2 mt-2 rounded-xl font-medium hover:opacity-90 transition-opacity">Update Keys</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
