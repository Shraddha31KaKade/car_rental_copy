"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "../../../../utils/api";
import { AlertCircle, ArrowLeft, BrainCircuit, Check, ShieldAlert, Loader2, X } from "lucide-react";

export default function ReportDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${apiUrl}/api/admin/reports/${id}`);
      if (!res.ok) throw new Error("Failed to fetch report details");
      const data = await res.json();
      setReport(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAI = async () => {
    setAiLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${apiUrl}/api/admin/reports/${id}/analyze`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      // Update local state with new AI insight
      setReport(prev => ({
        ...prev,
        aiInsights: data.data
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAction = async (statusEnum) => {
    setActionLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${apiUrl}/api/admin/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusEnum })
      });
      if (!res.ok) throw new Error("Action failed");
      
      // Navigate back or refresh
      fetchReportDetails();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8"><Loader2 className="animate-spin text-primary mx-auto my-12" size={40}/></div>;
  if (error) return <div className="p-8 text-error">{error}</div>;
  if (!report) return null;

  return (
    <div className="min-h-screen bg-background-base p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={18}/> Back to Reports
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Report Details</h1>
            <p className="text-on-surface-variant mt-1">ID: {report.reportId} • Created {new Date(report.createdAt).toLocaleString()}</p>
          </div>
          <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${
            report.status === 'PENDING' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-surface'
          }`}>
            {report.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-diffused">
              <h3 className="font-semibold text-lg border-b border-surface-container pb-3 mb-4">Complaint</h3>
              <p className="text-on-surface whitespace-pre-wrap leading-relaxed bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                {report.complaintText}
              </p>
              
              {report.attachments && report.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-on-surface-variant mb-2">Attachments</h4>
                  <div className="flex gap-4 overflow-x-auto">
                    {report.attachments.map((url, i) => (
                      <img key={i} src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`} alt="Attachment" className="h-32 rounded-xl border border-outline-variant/30 object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-diffused">
              <h3 className="font-semibold text-lg border-b border-surface-container pb-3 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><BrainCircuit className="text-primary"/> Gemini AI Analysis</span>
                {!report.aiInsights && (
                   <button 
                     onClick={handleTriggerAI} 
                     disabled={aiLoading}
                     className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2"
                   >
                     {aiLoading ? <Loader2 className="animate-spin" size={16}/> : 'Trigger Analysis'}
                   </button>
                )}
              </h3>

              {report.aiInsights ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/20">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Category</p>
                    <p className="font-medium text-on-surface">{report.aiInsights.category}</p>
                  </div>
                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/20">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Suggested Priority</p>
                    <p className={`font-bold ${report.aiInsights.suggestedPriority === 'URGENT' ? 'text-error' : 'text-primary'}`}>
                      {report.aiInsights.suggestedPriority}
                    </p>
                  </div>
                  <div className="col-span-2 bg-surface p-4 rounded-xl border border-outline-variant/20">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Summary</p>
                    <p className="text-on-surface">{report.aiInsights.summary}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-on-surface-variant bg-surface-container-low rounded-xl">
                  AI Classification has not been run yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-diffused">
              <h3 className="font-semibold text-lg border-b border-surface-container pb-3 mb-4">Involved Parties</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase mb-1">Reporter</p>
                  <div className="bg-surface-container-low p-3 rounded-lg">
                    <p className="font-medium">{report.reporter?.name}</p>
                    <p className="text-sm text-on-surface-variant">{report.reporter?.role}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-error uppercase mb-1 flex items-center gap-1"><ShieldAlert size={14}/> Reported User</p>
                  <div className="bg-error-container/20 border border-error/20 p-3 rounded-lg">
                    <p className="font-bold text-error">{report.reportedAccount?.name}</p>
                    <p className="text-sm text-on-surface-variant">{report.reportedAccount?.role}</p>
                    <p className="text-xs font-semibold mt-2 text-error">Past Reports: {report.reportedAccount?.pastReportsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-diffused">
              <h3 className="font-semibold text-lg border-b border-surface-container pb-3 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleAction('UNDER_REVIEW')}
                  disabled={actionLoading}
                  className="w-full bg-surface-container-high hover:bg-surface-container transition-colors py-2.5 rounded-xl text-on-surface font-medium"
                >
                   Mark Under Review
                </button>
                <button 
                   onClick={() => handleAction('RESOLVED')}
                   disabled={actionLoading}
                   className="w-full bg-tertiary hover:bg-tertiary/90 transition-colors py-2.5 rounded-xl text-on-tertiary font-medium flex justify-center items-center gap-2"
                >
                   <Check size={18}/> Resolve Issue
                </button>
                <div className="pt-3 border-t border-surface-container mt-3">
                  <button 
                     onClick={() => handleAction('DISMISS')}
                     disabled={actionLoading}
                     className="w-full bg-surface hover:bg-error/10 hover:text-error text-on-surface-variant transition-colors py-2.5 rounded-xl font-medium"
                  >
                     Dismiss Complaint
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
