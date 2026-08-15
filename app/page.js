"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/cars`);
        const data = await res.json();

        if (res.ok) {
          setFeaturedCars(data.slice(0, 4));
        } else {
          console.error(data.error || "Failed to fetch cars");
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/cars?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/cars');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center mt-32 mb-20 px-4 sm:px-6 relative">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold tracking-widest uppercase">
          Elite Vehicle Fleet
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight text-white">
          Drive the Future Today
        </h1>
        
        <p className="max-w-xl text-slate-400 text-lg mb-12">
          Experience unrivaled performance and luxury, delivered directly to your door.
        </p>

        {/* SEARCH BOX */}
        <div className="w-full max-w-3xl px-4 mb-20">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row bg-[#111] border border-white/10 rounded-lg overflow-hidden"
          >
            <div className="flex-1 flex items-center px-6 py-4 relative">
              <FaSearch className="text-slate-500 mr-4" />
              <input
                type="text"
                placeholder="Search by brand, model, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent w-full outline-none text-white placeholder-slate-500 text-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-black hover:bg-slate-200 font-semibold py-4 px-10 transition-colors md:w-auto w-full"
            >
              Search Vehicles
            </button>
          </form>
        </div>

        {/* PROFESSIONAL STATS */}
        <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-16">
           <div className="p-4">
             <h3 className="text-white text-4xl font-bold mb-2">300+</h3>
             <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">Premium Vehicles</p>
           </div>
           <div className="p-4 border-l border-white/10">
             <h3 className="text-white text-4xl font-bold mb-2">24/7</h3>
             <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">Concierge Support</p>
           </div>
           <div className="p-4 border-l border-white/10">
             <h3 className="text-white text-4xl font-bold mb-2">100%</h3>
             <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">Verified Owners</p>
           </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-2xl font-black tracking-tighter text-white uppercase flex items-baseline">
                Car<span className="text-indigo-500 italic lowercase">Rental</span>
              </span>
              <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mb-8"></div>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Hand-picked masterpieces of engineering. Each vehicle in our fleet is maintained to concours standards.
              </p>
            </div>
            
            <Link
              href="/cars"
              className="btn-outline group inline-flex items-center gap-3"
            >
              View Full Gallery
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {featuredCars.map((car, index) => (
              <div
                key={car.id}
                className="group carCard"
              >
                <div className="carImageWrapper h-64">
                  <Image
                    src={car.image ? (car.image.startsWith("http") || car.image.startsWith("/") ? car.image : `/${car.image}`) : "/bmw.png"}
                    alt={car.name}
                    width={500}
                    height={300}
                    className="carImage object-cover w-full h-full"
                  />
                  <span className="availableBadge">
                    Pristine Condition
                  </span>
                  <span className="priceBadge font-mono">
                    ₹{car.price}<span className="text-[10px] opacity-50 ml-1">/DAY</span>
                  </span>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-2">
                     <h3 className="font-black text-2xl text-white group-hover:text-indigo-400 transition-colors">{car.name}</h3>
                     <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{car.year}</span>
                  </div>
                  
                  <p className="text-slate-400 font-medium mb-8 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {car.type || "Performance Luxury"}
                  </p>

                  <Link
                    href={`/cars/${car.id}`}
                    className="viewBtn"
                  >
                    Experience Luxury
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LUXURY PARTNERSHIP CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2rem] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between text-white gap-16 overflow-hidden relative border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full -mr-64 -mt-64"></div>
            
            <div className="text-center md:text-left relative z-10 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase italic leading-tight">
                Drive the <span className="text-indigo-500">Extraordinary</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl mb-8">Redefining luxury travel with CarRental.</p>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                Connect with an exclusive network of drivers. List your vehicle and join the most prestigious rental collective.
              </p>
              <Link
                href="/list-cars"
                className="btn-primary"
              >
                Become a Partner
              </Link>
            </div>
            
            <div className="relative z-10 hidden md:block">
              <div className="absolute -inset-10 bg-indigo-500/20 rounded-full scale-75 blur-2xl"></div>
              <Image
                src="/bmw.png"
                alt="Partner Vehicle"
                width={500}
                height={300}
                className="relative z-10 w-full max-w-md h-auto transition-all duration-1000 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-32 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#020617] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Direct Inquiries
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              Get in Touch <br />
              <span className="text-indigo-500">Instantly.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-md leading-relaxed font-medium">
              Have questions about our fleet or specific rental costs? Ask away, and our AI-powered response system will get back to you immediately.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 text-indigo-400">📍</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global HQ</p>
                  <p className="text-white font-bold">Cyber City, DLF Phase 3, Gurugram</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 text-indigo-400">📱</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority Support</p>
                  <p className="text-white font-bold">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">Quick Inquiry</h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData);
              
              try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${apiUrl}/api/contact/inquiry`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data)
                });
                const result = await res.json();
                if (res.ok) {
                  alert(result.message || "Inquiry sent! You will receive an automated price update if you mentioned a car name.");
                  e.target.reset();
                } else {
                  alert(result.error || "Failed to send inquiry.");
                }
              } catch (err) {
                alert("Connection error.");
              }
            }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Name</label>
                  <input name="name" type="text" required placeholder="John Doe" className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Mobile No.</label>
                  <input name="mobile" type="tel" required placeholder="+91..." className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email</label>
                <input name="email" type="email" required placeholder="john@example.com" className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Message (Ask about a car!)</label>
                <textarea name="message" required rows={3} placeholder="What is the rent of the BMW X5?" className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none" />
              </div>
              <button type="submit" className="w-full py-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-indigo-500/30">
                Send Transmission
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* EXCLUSIVE NEWSLETTER */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">Join the Circle.</h2>
          <p className="text-slate-400 text-xl mb-12 max-w-lg mx-auto font-medium">
            Receive exclusive updates on new arrivals and invitation-only events.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 bg-slate-900 shadow-2xl p-3 rounded-3xl border border-white/10 max-w-2xl mx-auto backdrop-blur-xl">
            <input
              type="email"
              placeholder="Your professional email"
              className="bg-transparent px-8 py-5 outline-none text-white font-bold w-full placeholder:text-slate-600"
            />
            <button className="btn-primary whitespace-nowrap shadow-none">
              Get Invitations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}