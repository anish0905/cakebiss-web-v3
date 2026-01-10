"use client";
import Link from "next/link";
import { Instagram, Twitter, Facebook, ArrowUpRight, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Social links ko object array mein rakhein taki hum icons ko safely render kar sakein
  const socialLinks = [
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Facebook, href: "#" },
  ];

  return (
    <footer className="bg-[#050505] text-white pt-24 pb-10 px-6 border-t border-white/5 relative overflow-hidden">
      
      {/* 🔮 Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#ff4d6d03] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* --- BRAND SECTION --- */}
          <div className="md:col-span-2 space-y-8">
            <Link href="/" className="text-4xl font-black tracking-tighter italic group">
              CAKE<span className="text-[#ff4d6d] group-hover:text-white transition-colors">BISS.</span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed text-sm font-medium italic">
              "Hum banate hain sirf desserts nahi, balki ek yaadgar anubhav. Har bite mein premium quality aur 3D art ka sangam."
            </p>
            
            {/* Social Icons Fixed Logic */}
            <div className="flex gap-6">
              {socialLinks.map((social, i) => (
                <Link key={i} href={social.href} className="p-3 bg-white/5 rounded-2xl hover:bg-[#ff4d6d] hover:text-white transition-all duration-300">
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* --- QUICK LINKS --- */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: "The Collection", href: "/cakes" },
                { name: "Our Heritage", href: "/about" },
                { name: "Consult a Chef", href: "/contact" },
                { name: "Private Events", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold text-gray-400 hover:text-[#ff4d6d] flex items-center gap-2 group transition-all text-nowrap">
                    {link.name} 
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- NEWSLETTER --- */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Newsletter</h4>
            <p className="text-xs text-gray-500 mb-6 italic leading-relaxed">
              Get invited to our exclusive dessert tasting events.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl text-xs outline-none focus:border-[#ff4d6d] transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ff4d6d] hover:scale-110 transition-transform">
                <Sparkles size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            © {currentYear} CakeBiss Studio • All Rights Reserved
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}