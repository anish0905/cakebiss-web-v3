"use client";
import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-black italic text-cake-gold">CakeBiss.</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Artisanal cakes handcrafted with organic ingredients and love since 2024.</p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-cake-gold hover:text-black transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-cake-gold">Creations</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><Link href="/cakes" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="/cakes?category=Wedding" className="hover:text-white transition-colors">Wedding Special</Link></li>
              <li><Link href="/cakes?category=Custom" className="hover:text-white transition-colors">Custom Designs</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-cake-gold">Support</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-cake-gold">Newsletter</h3>
            <p className="text-xs text-gray-400">Get updates on seasonal collections.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 bg-white/10 rounded-full px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-cake-gold" />
              <button className="bg-cake-gold text-black px-4 py-2 rounded-full text-[10px] font-black uppercase">Join</button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 gap-4">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><MapPin size={12} /> Patna, India</span>
            <span className="flex items-center gap-2"><Phone size={12} /> +91 98765 43210</span>
          </div>
          <p>© 2026 CakeBiss Artisanal Patisserie.</p>
        </div>
      </div>
    </footer>
  );
}