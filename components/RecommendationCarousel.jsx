"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

export default function RecommendationCarousel({ tripType = "weekend", budget = 8000, passengers = 4 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("http://localhost:5000/api/v1/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripType, budget, passengers })
        });
        const data = await res.json();
        setRecommendations(data.recommendations || []);
        setTypes(data.suggestedTypes || []);
      } catch (error) {
        console.error("Failed to load recommendations", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [tripType, budget, passengers]);

  if (loading) {
    return (
      <div className="py-10 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 font-medium">Curating perfect cars with AI...</p>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-amber-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">AI Recommendations</h2>
      </div>
      <p className="text-gray-600 mb-6 flex gap-2 flex-wrap">
        We think you'll love these {types.join(" / ")}s.
      </p>

      <div className="flex overflow-x-auto pb-6 gap-6 hide-scrollbar">
        {recommendations.map((car) => (
          <div 
            key={car.id} 
            onClick={() => router.push(`/cars/${car.id}`)}
            className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <img 
              src={car.image || "/ferrari.png"} 
              alt={car.name} 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{car.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">{car.type}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Starts at ₹{car.price}/day</p>
              
              <div className="flex text-sm text-gray-600 gap-4">
                <span>{car.seats || 4} Seats</span>
                <span>{car.transmission || "Auto"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
