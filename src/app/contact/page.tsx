"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [mounted, setMounted] = useState(false);

  // Fix for Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setStatus("Message sent successfully! 🍰");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus(""), 5000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 md:pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
      
      {/* 🔮 Background Glows */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#ff4d6d05] rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-[#7209b705] rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-[#ff4d6d] mb-4"
          >
            <Sparkles size={14} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Private Consultation</span>
          </motion.div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] to-[#f9829b]">Touch.</span>
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* --- LEFT: CONTACT INFO --- */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8 md:p-14 border-b md:border-b-0 md:border-r border-white/5">
            <h2 className="text-xl md:text-2xl font-bold uppercase italic mb-8 tracking-tight">Connect with <br className="hidden md:block" /> the Studio</h2>
            
            <div className="space-y-8 md:space-y-10">
              {[
                { icon: <MapPin size={18} />, title: "Studio", detail: "123 Bakery St, Digital City" },
                { icon: <Phone size={18} />, title: "Hotline", detail: "+91 98765 43210" },
                { icon: <Mail size={18} />, title: "Inquiry", detail: "hello@cakebiss.com" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="text-[#ff4d6d] p-3 bg-white/5 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[7px] md:text-[8px] font-bold uppercase text-gray-500 tracking-widest mb-1">{item.title}</p>
                    <p className="text-xs md:text-sm font-medium text-white/80">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="mt-12 md:mt-20 pt-8 border-t border-white/5">
              <p className="text-[8px] font-bold uppercase text-gray-600 tracking-[0.3em] mb-4 text-center md:text-left">Follow the Magic</p>
              <div className="flex justify-center md:justify-start gap-6 text-[10px] font-black tracking-widest">
                <span className="hover:text-[#ff4d6d] cursor-pointer transition-colors uppercase">IG</span>
                <span className="hover:text-[#ff4d6d] cursor-pointer transition-colors uppercase">TW</span>
                <span className="hover:text-[#ff4d6d] cursor-pointer transition-colors uppercase">BE</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT: THE FORM --- */}
          <div className="w-full md:w-2/3 p-8 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                  <input 
                    type="text" required
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl focus:ring-1 focus:ring-[#ff4d6d] outline-none transition-all text-xs md:text-sm placeholder:text-gray-700"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    value={formData.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                  <input 
                    type="email" required
                    placeholder="example@mail.com"
                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl focus:ring-1 focus:ring-[#ff4d6d] outline-none transition-all text-xs md:text-sm placeholder:text-gray-700"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    value={formData.email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Regarding</label>
                <input 
                  type="text" required
                  placeholder="Subject of inquiry"
                  className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl focus:ring-1 focus:ring-[#ff4d6d] outline-none transition-all text-xs md:text-sm placeholder:text-gray-700"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  value={formData.subject}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Message</label>
                <textarea 
                  placeholder="Describe your dream celebration..." rows={4} required
                  className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl focus:ring-1 focus:ring-[#ff4d6d] outline-none transition-all text-xs md:text-sm placeholder:text-gray-700 resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  value={formData.message}
                ></textarea>
              </div>

              <button className="group w-full bg-[#ff4d6d] text-white font-black uppercase text-[10px] tracking-[0.3em] py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-[#ff4d6dbb] transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(255,77,109,0.2)]">
                Send Message <Send size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <p className="text-[#ff4d6d] font-bold text-[10px] tracking-widest uppercase">
                      {status}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}