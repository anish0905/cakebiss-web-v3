"use client";
import { motion } from "framer-motion";
import { Heart, Star, Sparkles, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Cakes Baked", value: "10,000+" },
    { label: "Happy Moments", value: "8,500+" },
    { label: "Expert Chefs", value: "12" },
    { label: "Cities", value: "5" },
  ];

  return (
    <main className="min-h-screen bg-[#fffcf9] text-black pb-20">
      
      {/* --- HERO: The Philosophy --- */}
      <section className="relative py-24 md:py-40 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cake-gold/5 -skew-x-12 transform origin-top" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-cake-gold mb-6 block"
          >
            Since 2024 • Our Heritage
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-9xl font-serif font-black italic leading-none mb-12"
          >
            Baking <br /> <span className="text-cake-gold not-italic">Poetry</span> into <br /> Reality.
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-lg md:text-2xl font-medium leading-relaxed"
            >
              CakeBiss ki shuruaat ek simple sapne se hui thi: "Har celebration ko ek masterpiece banana." Hum sirf cakes nahi banate, hum aapki khushiyon ko ek swaad dete hain.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80" 
                alt="Chef at work"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 bg-black text-white px-6 rounded-[4rem] mx-2 md:mx-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-cake-gold rounded-2xl flex items-center justify-center text-black">
              <Sparkles size={28} />
            </div>
            <h3 className="text-2xl font-serif italic">Artisanal Quality</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Hum har cake ko scratch se banate hain. No preservatives, no shortcuts. Sirf pure organic ingredients.</p>
          </div>
          
          <div className="space-y-6">
            <div className="w-14 h-14 bg-cake-gold rounded-2xl flex items-center justify-center text-black">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-serif italic">Made with Love</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Hamare liye har order ek zimmedari hai. Hum wahi taste deliver karte hain jo hum apne apno ke liye banate.</p>
          </div>

          <div className="space-y-6">
            <div className="w-14 h-14 bg-cake-gold rounded-2xl flex items-center justify-center text-black">
              <UtensilsCrossed size={28} />
            </div>
            <h3 className="text-2xl font-serif italic">Master Craftsmanship</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Hamare pastry chefs ne duniya bhar ki techniques ko seekha hai taaki aapko mile ek behtareen experience.</p>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              className="text-center p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm"
            >
              <h4 className="text-4xl md:text-6xl font-black text-black mb-2">{stat.value}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-cake-gold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-7xl font-serif font-black italic">Ready to taste <br /> the magic?</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/cakes" className="bg-black text-white px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-cake-gold hover:text-black transition-all shadow-2xl">
              Order Your Masterpiece
            </Link>
            <Link href="/contact" className="bg-white border-2 border-black text-black px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-black hover:text-white transition-all">
              Consult a Chef
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}