"use client";

import { useEffect, useState, useMemo } from "react";
import { AlertCircle, CheckCircle2, Search, Filter, BoxSelect, X, Loader2 } from "lucide-react";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function AdminReports() {
  const router = useRouter();
  
  // State Management
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", type: "", description: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const metrics = useMemo(() => {
    const openCount = reports.filter(r => r.status === 'Open').length;
    const resolvedCount = reports.filter(r => r.status === 'Resolved').length;
    return { openCount, resolvedCount };
  }, [reports]);

  // API Integration Hooks (Simulated endpoint gracefully falling back to mock data if 404)
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/reports");
      if (!res.ok) {
        throw new Error("Failed to fetch from API. Using local state.");
      }
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.warn(err.message);
      // Fallback to mock data for demonstration
      setReports([
        { id: "RC-8921", vehicle: "Tesla Model Y", user: "Michael Chen", status: "Open", type: "Mechanical", date: "Oct 24, 2026" },
        { id: "RC-8920", vehicle: "BMW X5", user: "Sarah Jenkins", status: "Resolved", type: "Cleanliness", date: "Oct 23, 2026" },
        { id: "RC-8919", vehicle: "Audi A4", user: "David Kim", status: "In Progress", type: "Billing", date: "Oct 22, 2026" },
        { id: "RC-8918", vehicle: "Mercedes C-Class", user: "Emma Watson", status: "Open", type: "Late Return", date: "Oct 22, 2026" },
      ]);
      setError("Connected to dummy data. Live API endpoint unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter Logic
  const filteredReports = useMemo(() => {
    return reports.filter(r => 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reports, searchQuery]);

  // Form Validation
  const validateForm = () => {
    let errors = {};
    if (!formData.title.trim()) errors.title = "Report title is required";
    if (!formData.type) errors.type = "Please select a report type";
    if (formData.description.length < 10) errors.description = "Description must be at least 10 characters";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newReport = {
        id: `RC-${Math.floor(8000 + Math.random() * 1000)}`,
        vehicle: "N/A",
        user: "Admin Generated",
        status: "Open",
        type: formData.type,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      setReports([newReport, ...reports]);
      setIsModalOpen(false);
      setFormData({ title: "", type: "", description: "" });
    } catch (err) {
      setError("Failed to generate report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToDetails = (id) => {
    router.push(`/admin/reports/${id}`);
  };

  return (
    <div className="min-h-screen bg-background-base p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 relative">
        
        {/* Error State Toast */}
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 shadow-diffused justify-between">
            <div className="flex gap-2 items-center">
              <AlertCircle size={20} />
              <p className="font-medium text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)}><X size={18}/></button>
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-on-surface-variant font-semibold tracking-wide text-sm mb-1 uppercase">Admin Suite</p>
            <h1 className="text-4xl text-on-surface font-bold tracking-tight">Reports & Complaints</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-br from-primary to-primary-dim text-white px-6 py-3 rounded-xl font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:opacity-90 transition-opacity"
          >
            Generate Report
          </button>
        </div>

        {/* Action Cards (Metrics) - Uses surface hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-diffused transition-transform hover:-translate-y-1">
            <h3 className="text-on-surface-variant text-sm font-medium mb-4">Total Open Issues</h3>
            <p className="text-5xl font-bold text-on-surface tracking-tight">{loading ? "-" : metrics.openCount}</p>
            <p className="text-sm text-error mt-4 font-medium flex items-center gap-1">
              <AlertCircle size={16} /> Needs attention
            </p>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-6 transition-transform hover:-translate-y-1 border border-transparent">
            <h3 className="text-on-surface-variant text-sm font-medium mb-4">Resolved (30 Days)</h3>
            <p className="text-5xl font-bold text-on-surface tracking-tight">{loading ? "-" : metrics.resolvedCount}</p>
            <p className="text-sm text-primary mt-4 font-medium flex items-center gap-1">
              <CheckCircle2 size={16} /> Healthy resolution rate
            </p>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <h3 className="text-on-surface-variant text-sm font-medium mb-4">Avg. Response Time</h3>
            <p className="text-5xl font-bold text-on-surface tracking-tight">2.4<span className="text-2xl text-on-surface-variant ml-1">hrs</span></p>
            <p className="text-sm text-on-surface-variant mt-4 font-medium">
              Target: &lt; 4.0 hrs
            </p>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-diffused overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-6 border-b border-surface-container flex flex-wrap gap-4 justify-between items-center bg-surface-container-lowest">
            <h2 className="text-xl font-bold text-on-surface">Recent Reports</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, User, or Vehicle..." 
                  className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/60 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors w-72"
                />
              </div>
              <button className="bg-surface-container text-on-surface px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors flex items-center gap-2">
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          {/* Clean Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high text-on-surface-variant text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16">
                    <BoxSelect size={18} className="text-outline-variant" />
                  </th>
                  <th className="p-4 font-semibold">Report ID</th>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Vehicle</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-on-surface text-[15px] leading-relaxed">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse bg-surface border-b border-surface-container-low border-opacity-50">
                      <td colSpan="7" className="p-4 h-16 bg-surface-container-low/50"></td>
                    </tr>
                  ))
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-on-surface-variant">
                      No reports found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((item, idx) => (
                    <tr 
                      key={item.id} 
                      className={`group hover:bg-surface-container transition-colors ${idx % 2 === 0 ? 'bg-surface' : 'bg-surface-container-low'}`}
                    >
                      <td className="p-4">
                        <BoxSelect size={18} className="text-outline-variant/30 group-hover:text-outline-variant transition-colors cursor-pointer" />
                      </td>
                      <td className="p-4 font-medium text-primary cursor-pointer hover:underline" onClick={() => navigateToDetails(item.id)}>{item.id}</td>
                      <td className="p-4">{item.user}</td>
                      <td className="p-4 text-on-surface-variant">{item.vehicle}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'Open' ? 'bg-error-container text-on-error-container' :
                          item.status === 'Resolved' ? 'bg-tertiary-container text-on-tertiary-container' :
                          'bg-primary-container text-on-surface'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">{item.date}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => navigateToDetails(item.id)}
                          className="text-on-surface font-medium hover:text-primary transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* "Generate Report" Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl shadow-diffused w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-surface-container flex justify-between items-center">
                <h2 className="text-xl font-bold text-on-surface">Generate Internal Report</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleGenerateReport} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Report Title</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full bg-surface-container-lowest border ${formErrors.title ? 'border-error' : 'border-outline-variant/30'} text-on-surface rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors`}
                    placeholder="Enter report title..."
                  />
                  {formErrors.title && <p className="text-error text-xs mt-1">{formErrors.title}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Report Category</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className={`w-full bg-surface-container-lowest border ${formErrors.type ? 'border-error' : 'border-outline-variant/30'} text-on-surface rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors`}
                  >
                    <option value="">Select a category</option>
                    <option value="Mechanical">Mechanical Issue</option>
                    <option value="Billing">Billing Discrepancy</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="General">General Support</option>
                  </select>
                  {formErrors.type && <p className="text-error text-xs mt-1">{formErrors.type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full h-32 bg-surface-container-lowest border ${formErrors.description ? 'border-error' : 'border-outline-variant/30'} text-on-surface rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors resize-none`}
                    placeholder="Detailed explanation..."
                  ></textarea>
                  {formErrors.description && <p className="text-error text-xs mt-1">{formErrors.description}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-surface-container">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-br from-primary to-primary-dim text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
