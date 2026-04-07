"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#01040f] text-slate-400 pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -mr-64 -mb-64"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Story */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
                🏎️
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase flex items-baseline">
                Car<span className="text-indigo-500 italic lowercase">Rental</span>
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed font-medium">
              Redefining the art of travel. From breathtaking performance to unrivaled luxury, we provide the keys to your next great escape.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'LinkedIn'].map((platform) => (
                <a 
                  key={platform} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 group"
                >
                  <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors tracking-tighter">
                    {platform.substring(0, 2)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Navigation</h4>
            <ul className="space-y-5 font-bold">
              <li><Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link></li>
              <li><Link href="/cars" className="hover:text-indigo-500 transition-colors">The Fleet</Link></li>
              <li><Link href="/booking" className="hover:text-indigo-500 transition-colors">My Journeys</Link></li>
              <li><Link href="/list-cars" className="hover:text-indigo-500 transition-colors">Partnership</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Support</h4>
            <ul className="space-y-5 font-bold">
              <li><Link href="/help" className="hover:text-indigo-500 transition-colors">Concierge</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-500 transition-colors">Data Privacy</Link></li>
              <li><Link href="/insurance" className="hover:text-indigo-500 transition-colors">Insurance</Link></li>
            </ul>
          </div>

          {/* Global Operations */}
          <div className="space-y-5">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Headquarters</h4>
            <div className="space-y-2">
              <p className="text-white font-black text-sm">San Francisco, CA</p>
              <p className="text-slate-500 font-medium text-xs tracking-wider">1234 Silicon Valley Way, Suite 500</p>
            </div>
            <div className="space-y-2 pt-4">
              <p className="text-white font-black text-sm uppercase tracking-tighter cursor-pointer hover:text-indigo-500 transition-colors underline decoration-indigo-500/30">
                concierge@carescape.app
              </p>
              <p className="text-slate-500 font-bold text-xs">+1 (800) LUX-ESCAPE</p>
            </div>
          </div>
        </div>

        {/* Legal & Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            © 2026 CAR ESCAPE. All rights reserved.
          </p>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
             <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
             <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
             <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
