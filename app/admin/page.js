"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [insights, setInsights] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);

  // In reality, this would hit an endpoint that runs AI over DB metrics.
  // Mocking the AI Insight fetch to showcase the architecture.
  useEffect(() => {
    setTimeout(() => {
      setInsights([
        "SUV demand spiked 40% on weekends over the last month.",
        "Automatic transmissions make up 75% of your total rental volume.",
        "Sedans under ₹2500 per day have the highest utilization rate."
      ]);
      setRecommendation("Consider acquiring 2 more budget SUVs specifically for Friday-Sunday deployment to maximize revenue yield.");
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Fleet Command</h1>
      
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-indigo-400 opacity-20">
          <BarChart3 size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={28} className="text-amber-400" />
            <h2 className="text-2xl font-bold">AI Business Insights</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center gap-3 text-indigo-200">
              <Loader2 className="animate-spin" size={24} />
              <p>LLM is processing 30-day booking aggregations...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex gap-4 items-start">
                    <div className="bg-indigo-500/50 rounded-full h-8 w-8 flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-lg leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-6">
                <div className="flex gap-3 text-amber-400 font-bold mb-2 items-center">
                  <AlertTriangle size={20} />
                  <h3>Actionable Recommendation</h3>
                </div>
                <p className="text-amber-50 leading-relaxed font-medium">
                  {recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
