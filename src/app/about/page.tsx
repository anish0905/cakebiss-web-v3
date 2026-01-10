"use client";
import { motion } from "framer-motion";
import { Heart, Star, Sparkles, UtensilsCrossed, Zap, Award, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Cakes Baked", value: "10k+", icon: <Zap size={16} /> },
    { label: "Happy Hearts", value: "8.5k+", icon: <Heart size={16} /> },
    { label: "Master Chefs", value: "12", icon: <Award size={16} /> },
    { label: "Cities", value: "5", icon: <Globe size={16} /> },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-20 pt-24 overflow-hidden relative">
      
      {/* 🔮 Background Cinematic Glows */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-[#ff4d6d10] to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#7209b708] rounded-full blur-[150px] pointer-events-none" />

      {/* --- HERO: The Philosophy --- */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[#ff4d6d] mb-6 justify-center md:justify-start"
          >
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Established 2024 • Our Heritage</span>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter uppercase italic mb-10 text-center md:text-left"
              >
                Baking <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] to-[#f9829b]">Poetry</span> <br /> 
                Into Life.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-base md:text-xl font-light leading-relaxed italic border-l-2 border-[#ff4d6d]/20 pl-6 max-w-xl mx-auto md:mx-0"
              >
                CakeBiss ki shuruaat ek simple sapne se hui thi: "Har celebration ko ek masterpiece banana." Hum sirf cakes nahi banate, hum aapki khushiyon ko ek digital aur swaadishth roop dete hain.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="relative aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(255,77,109,0.15)] border border-white/5"
            >
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80" 
                alt="Chef at work"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES: Glassmorphism Cards --- */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Sparkles />, 
              title: "Artisanal Quality", 
              desc: "Hum har cake ko scratch se banate hain. No preservatives, sirf pure organic ingredients." 
            },
            { 
              icon: <Heart />, 
              title: "Made with Love", 
              desc: "Hamare liye har order ek zimmedari hai. Hum wahi taste deliver karte hain jo hum apne apno ke liye banate." 
            },
            { 
              icon: <UtensilsCrossed />, 
              title: "Master Craft", 
              desc: "Hamare pastry chefs ne duniya bhar ki techniques ko seekha hai taaki aapko mile ek behtareen experience." 
            },
          ].map((value, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/5 hover:border-[#ff4d6d50] transition-all duration-500 group"
            >
              <div className="w-14 h-14 bg-[#ff4d6d] rounded-2xl flex items-center justify-center text-white mb-8 shadow-[0_10px_30px_rgba(255,77,109,0.3)] group-hover:rotate-12 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 italic">{value.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-[#ff4d6d05] to-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 md:p-12 bg-[#111] rounded-[2.5rem] border border-white/5"
            >
              <div className="text-[#ff4d6d] flex justify-center mb-3 opacity-50">{stat.icon}</div>
              <h4 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</h4>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.h2 
            whileInView={{ scale: [0.9, 1] }}
            className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none"
          >
            Ready to taste <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] to-[#f9829b]">the magic?</span>
          </motion.h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/cakes" className="w-full sm:w-auto bg-[#ff4d6d] text-white px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_20px_40px_rgba(255,77,109,0.3)] hover:scale-105 transition-all">
              Order Masterpiece
            </Link>
            <Link href="/contact" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all">
              Consult a Chef
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}