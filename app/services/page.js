"use client";
import React, { useState } from "react";
import Image from "next/image";
import ChatbotWidget from "../../components/ChatbotWidget";

function HoverVideo({ videoId, placeholder }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full aspect-video bg-black/60 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 hover:border-blue-500/50 group/vid cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z"></path></svg>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Visual Preview</p>
            <p className="text-white/40 text-xs font-bold">{placeholder}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 transition-opacity pointer-events-none">
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-2xl">Hover to play</span>
          </div>
        </div>
      ) : (
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="absolute inset-0 w-full h-full object-cover"
        ></iframe>
      )}
    </div>
  );
}

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
      delay: "0ms",
      details: [
        "Professional Uniformed Drivers",
        "Punctual Pick-ups & Drop-offs",
        "Multilingual Support",
        "Discretion & Safety Guaranteed"
      ],
      videoPlaceholder: "Chauffeur Luxury Experience"
    },
    {
      title: "Airport Transfers",
      desc: "Punctual, private, and premium transfers. Seamless transition from sky to road.",
      icon: "✈️",
      delay: "100ms",
      details: [
        "Flight Monitoring & Adjustment",
        "Meet & Greet Services",
        "Porterage Assistance",
        "Fixed Rates (No Surge)"
      ],
      videoPlaceholder: "Seamless Airport Transit"
    },
    {
      title: "Corporate Leasing",
      desc: "Flexible, long-term fleet solutions tailored for your business needs and executives.",
      icon: "🏢",
      delay: "200ms",
      details: [
        "Customizable Fleet Selection",
        "Tax-Efficient Solutions",
        "Dedicated Account Manager",
        "24/7 Priority Support"
      ],
      videoPlaceholder: "Business Fleet Solutions"
    },
    {
      title: "Event Concierge",
      desc: "Comprehensive transportation management for weddings, galas, and high-profile events.",
      icon: "💍",
      delay: "300ms",
      details: [
        "Coordinated Multi-Car Logistics",
        "VIP Liaison Services",
        "Event Branding Options",
        "On-Site Dispatcher"
      ],
      videoPlaceholder: "Grand Event Management"
    },
    {
      title: "Wedding Special",
      desc: "Make your special day unforgettable with our fleet of vintage and modern luxury cars.",
      icon: "🥂",
      delay: "400ms",
      details: [
        "Decorated Bridal Cars",
        "Guest Convoy Management",
        "Professional Photo-op Coordination",
        "Late-night Send-off Service"
      ],
      videoPlaceholder: "Romantic Wedding Journey"
    },
    {
      title: "Inter-City Travels",
      desc: "Safe and comfortable long-distance travel with premium sedans and SUVs.",
      icon: "🛣️",
      delay: "500ms",
      details: [
        "Experienced Highway Drivers",
        "In-Car Refreshments",
        "Regular Sanitization",
        "Real-Time Tracking"
      ],
      videoPlaceholder: "Cross-Country Comfort"
    }
  ];

  const [expandedSvc, setExpandedSvc] = useState(null);

  const toggleSvc = (index) => {
    setExpandedSvc(expandedSvc === index ? null : index);
  };

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 relative overflow-hidden isolate">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-200 text-blue-700 shadow-sm text-[10px] font-black uppercase tracking-[0.2em]">
            Premium Offerings
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-950 mb-6 tracking-tighter">
            Elevate Your <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent italic">Journey</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            From short city hops to long-term corporate solutions, redefining mobility.
          </p>
        </div>

        {/* Media Block (Video + Text) */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-32">
          <div className="w-full lg:w-1/2 relative rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl">
             <video 
               autoPlay 
               loop 
               muted 
               playsInline 
               className="w-full h-[500px] object-cover scale-105"
             >
               <source src="https://assets.mixkit.co/videos/preview/mixkit-car-driving-in-the-city-at-night-3221-large.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </div>
          <div className="w-full lg:w-1/2">
             <h2 className="text-4xl font-black text-slate-950 mb-6 uppercase tracking-tighter">
               State of the Art <span className="text-blue-600">Mobility</span>
             </h2>
             <p className="text-slate-600 leading-relaxed text-lg mb-8">
               Our operations are completely backed by artificial intelligence, ensuring that your vehicle matches your precise requirements. We guarantee a frictionless handover protocol and robust on-road assistance.
             </p>
             <div className="grid gap-6">
                {services.map((svc, i) => (
                    <div 
                     key={i} 
                     className={`cursor-pointer overflow-hidden p-8 bg-white border border-slate-200 shadow-sm rounded-[2rem] hover:border-blue-500/30 transition-all duration-500 ${expandedSvc === i ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-200' : ''}`} 
                     style={{ animationDelay: svc.delay }}
                     onClick={() => toggleSvc(i)}
                    >
                       <div className="flex justify-between items-center">
                         <div className="flex gap-6 items-center">
                           <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                             {svc.icon}
                           </div>
                           <div>
                              <h3 className="text-slate-900 font-black text-xl mb-1 uppercase tracking-tight">{svc.title}</h3>
                              <p className="text-slate-600 text-sm font-medium">{svc.desc}</p>
                           </div>
                         </div>
                         <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 transition-all duration-500 ${expandedSvc === i ? 'rotate-180 bg-blue-500/20 text-white' : ''}`}>
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                         </div>
                       </div>
                       
                       {expandedSvc === i && (
                         <div className="mt-8 pt-8 border-t border-slate-200 animate-fadeUp">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                             <div className="space-y-4">
                               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Core Benefits</p>
                               <ul className="space-y-3">
                                 {svc.details.map((detail, idx) => (
                                   <li key={idx} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                                     {detail}
                                   </li>
                                 ))}
                               </ul>
                             </div>
                             
                             <div className="relative">
                               <HoverVideo videoId="h9dTYG1y21k" placeholder={svc.videoPlaceholder} />
                             </div>
                           </div>
                           
                           <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-[10px] text-blue-800 font-bold uppercase tracking-widest text-center">
                             To add your custom video, edit <code className="text-white bg-black/30 px-1 rounded">services/page.js</code> and replace the placeholder div with a <code className="text-white bg-black/30 px-1 rounded">&lt;video&gt;</code> tag.
                           </div>
                         </div>
                       )}
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-32">
           <h2 className="text-center text-3xl font-black text-slate-950 mb-12 uppercase tracking-tighter">Client Records</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test, i) => (
                <div key={i} className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-blue-400 transition-all shadow-md hover:shadow-xl group relative overflow-hidden">
                  <div className="absolute top-4 right-6 text-6xl text-slate-200 group-hover:text-blue-100 transition-colors font-serif">"</div>
                  <p className="text-slate-600 italic mb-8 relative z-10 leading-relaxed">
                    "{test.text}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                     <Image src={test.avatar} alt={test.name} width={50} height={50} className="rounded-full border-2 border-blue-500/30" />
                     <div>
                       <p className="text-slate-900 font-bold text-sm uppercase tracking-wider">{test.name}</p>
                       <p className="text-xs text-blue-600 font-bold tracking-widest uppercase">{test.role}</p>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Feedback Form */}
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 shadow-2xl">
          <div className="text-center mb-10">
             <h2 className="text-3xl font-black text-slate-950 mb-3 tracking-tighter uppercase">Share Your Experience</h2>
             <p className="text-slate-600 text-sm">Your feedback drives our continuous engineering refinements.</p>
          </div>
          
          {isSubmitted ? (
             <div className="text-center p-8 bg-blue-50 rounded-3xl border border-blue-200">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-slate-900 font-bold text-xl mb-2">Transmission Received</h3>
                <p className="text-slate-400">Thank you for your valuable insight.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-6 text-xs text-blue-600 font-bold uppercase tracking-widest hover:text-blue-700 transition-colors">
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
                   className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400"
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
                   className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400 resize-none"
                   placeholder="How was the velocity and comfort of your trip?"
                 />
               </div>
               <button type="submit" className="w-full py-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-500/25">
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
