"use client";
import React, { useState } from "react";
import Image from "next/image";
import ChatbotWidget from "../../components/ChatbotWidget";

export default function ServicesPage() {
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request to save feedback
    setTimeout(() => {
      setIsSubmitted(true);
      setFeedbackName("");
      setFeedbackText("");
    }, 500);
  };

  const services = [
    {
      title: "Chauffeur Drives",
      desc: "Experience ultimate luxury with our professional chauffeur services. Sit back and relax.",
      icon: "👔",
      delay: "0ms"
    },
    {
      title: "Airport Transfers",
      desc: "Punctual, private, and premium transfers. Seamless transition from sky to road.",
      icon: "✈️",
      delay: "100ms"
    },
    {
      title: "Corporate Leasing",
      desc: "Flexible, long-term fleet solutions tailored for your business needs and executives.",
      icon: "🏢",
      delay: "200ms"
    }
  ];

  const testimonials = [
    {
      name: "Aryan Sharma",
      role: "Frequent Traveler",
      text: "The easiest car rental process I've ever experienced. Highly recommend their corporate leasing program!",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      name: "Priya Desai",
      role: "Business Executive",
      text: "Exceptional fleet quality. The AI recommendations picked exactly what I needed for my mountain trip.",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Rohan Gupta",
      role: "Auto Enthusiast",
      text: "Immaculate condition! Driving the BMW X5 felt like it just rolled out of the showroom.",
      avatar: "https://i.pravatar.cc/150?img=12"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 relative overflow-hidden isolate">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Premium Offerings
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Elevate Your <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent italic">Journey</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            From short city hops to long-term corporate solutions, redefining mobility.
          </p>
        </div>

        {/* Media Block (Video + Text) */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-32">
          <div className="w-full lg:w-1/2 relative rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
             <video 
               autoPlay 
               loop 
               muted 
               playsInline 
               className="w-full h-[500px] object-cover scale-105"
             >
               <source src="https://assets.mixkit.co/videos/preview/mixkit-car-driving-in-the-city-at-night-3221-large.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>
          </div>
          <div className="w-full lg:w-1/2">
             <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
               State of the Art <span className="text-indigo-400">Mobility</span>
             </h2>
             <p className="text-slate-400 leading-relaxed text-lg mb-8">
               Our operations are completely backed by artificial intelligence, ensuring that your vehicle matches your precise requirements. We guarantee a frictionless handover protocol and robust on-road assistance.
             </p>
             <div className="grid gap-6">
                {services.map((svc, i) => (
                   <div key={i} className="flex gap-4 items-start p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-colors" style={{ animationDelay: svc.delay }}>
                      <div className="text-3xl">{svc.icon}</div>
                      <div>
                         <h3 className="text-white font-bold mb-1 uppercase tracking-wider">{svc.title}</h3>
                         <p className="text-slate-500 text-sm">{svc.desc}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-32">
           <h2 className="text-center text-3xl font-black text-white mb-12 uppercase tracking-tighter">Client Records</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test, i) => (
                <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-indigo-500/30 transition-all shadow-xl group relative overflow-hidden">
                  <div className="absolute top-4 right-6 text-6xl text-white/5 group-hover:text-indigo-500/10 transition-colors font-serif">"</div>
                  <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">
                    "{test.text}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                     <Image src={test.avatar} alt={test.name} width={50} height={50} className="rounded-full border-2 border-indigo-500/30" />
                     <div>
                       <p className="text-white font-bold text-sm uppercase tracking-wider">{test.name}</p>
                       <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase">{test.role}</p>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Feedback Form */}
        <div className="max-w-2xl mx-auto bg-[#111] border border-white/10 rounded-3xl p-10 sm:p-14 shadow-2xl">
          <div className="text-center mb-10">
             <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Share Your Experience</h2>
             <p className="text-slate-400 text-sm">Your feedback drives our continuous engineering refinements.</p>
          </div>
          
          {isSubmitted ? (
             <div className="text-center p-8 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-white font-bold text-xl mb-2">Transmission Received</h3>
                <p className="text-slate-400">Thank you for your valuable insight.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-6 text-xs text-indigo-400 font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Submit another report
                </button>
             </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Name</label>
                 <input 
                   type="text" 
                   required
                   value={feedbackName}
                   onChange={(e) => setFeedbackName(e.target.value)}
                   className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-700"
                   placeholder="Your Name"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Feedback Log</label>
                 <textarea 
                   required
                   rows={4}
                   value={feedbackText}
                   onChange={(e) => setFeedbackText(e.target.value)}
                   className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-700 resize-none"
                   placeholder="How was the velocity and comfort of your trip?"
                 />
               </div>
               <button type="submit" className="w-full py-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-indigo-500/30">
                 Transmit Feedback
               </button>
             </form>
          )}
        </div>
        <ChatbotWidget />
      </div>
    </div>
  );
}
