"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Truck, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import FallingCakes from "../components/FallingCakes";
import AddToCartBtn from "../components/AddToCartBtn";


export default function Home() {
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    fetch("/api/cakes?limit=4")
      .then((res) => res.json())
      .then((json) => setCakes(json.data.slice(0, 4)));
  }, []);

  return (
    <main className="min-h-screen bg-[#fffcf9] overflow-hidden">
      <FallingCakes/>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cake-gold/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cake-brown/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cake-gold font-black tracking-[0.4em] uppercase text-[10px] md:text-xs mb-6 block"
          >
            Est. 2024 • Artisanal Patisserie
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-9xl font-serif text-black mb-8 leading-[1] italic tracking-tight"
          >
            Handcrafted <br />
            <span className="not-italic font-black text-cake-gold">Boutique</span> Cakes
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-sm md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Experience the fusion of organic ingredients and master craftsmanship. 
            Delivered fresh from our boutique oven to your sanctuary.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/cakes" className="group w-full sm:w-auto bg-black text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all hover:bg-cake-gold hover:text-black flex items-center justify-center gap-3">
              Explore Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/about" className="w-full sm:w-auto bg-white border border-black/5 px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all text-center">
              Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- WHY US (NEW FEATURES) --- */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: <Truck className="mx-auto text-cake-gold" />, title: "Express Delivery", desc: "Fresh cakes delivered in under 2 hours in local areas." },
            { icon: <ShieldCheck className="mx-auto text-cake-gold" />, title: "Premium Ingredients", desc: "We use only 100% organic flour and artisanal Belgian chocolate." },
            { icon: <Heart className="mx-auto text-cake-gold" />, title: "Customized for You", desc: "Personalize messages and designs for your special moments." },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BEST SELLERS --- */}
      <section className="py-32 px-6 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-7xl font-serif text-black italic leading-none">The Best Sellers</h2>
            <p className="mt-6 text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Curation of our finest masterpieces</p>
          </div>
          <Link href="/cakes" className="text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-2 hover:text-cake-gold hover:border-cake-gold transition-all">
            View All Creations →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cakes.map((cake: any, idx) => (
            <motion.div 
              key={cake._id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-80 overflow-hidden">
                <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6">
                  <span className="bg-black text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{cake.category}</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow text-center">
                <h3 className="text-xl font-serif font-black mb-2 italic text-black">{cake.name}</h3>
                <p className="text-gray-400 text-xs mb-6 italic leading-relaxed">"{cake.description}"</p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="text-left">
                    <span className="text-2xl font-black text-black">₹{cake.price}</span>
                  </div>
                  <AddToCartBtn cake={cake}/>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- LUXURY REVIEWS SECTION (NEW) --- */}
      <section className="py-32 bg-black text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-10">
            {[...Array(5)].map((_, i) => <Star key={i} fill="#D4AF37" color="#D4AF37" size={20} />)}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif italic mb-10 leading-snug">
            "The most exquisite Chocolate Truffle I've ever tasted. It's not just a cake, it's a piece of art delivered to your doorstep."
          </h2>
          <p className="text-cake-gold font-black uppercase tracking-[0.3em] text-xs">— Ananya Sharma, Delhi</p>
        </div>
      </section>

      {/* --- FINAL CTA BANNER --- */}
      <section className="px-6 py-24">
        <motion.div 
          whileInView={{ scale: 0.98 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto bg-cake-gold rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-10 -right-10 text-[200px] opacity-40 rotate-12 select-none">🎂</div>
          <h2 className="text-4xl md:text-8xl font-serif text-black italic mb-8 tracking-tighter">Grand Occasions?</h2>
          <p className="text-black/60 max-w-xl mx-auto mb-12 text-lg font-medium leading-relaxed">
            Planning a wedding or a luxury event? Our chefs work directly with you to create your dream masterpiece.
          </p>
          <Link href="/contact" className="bg-black text-white px-14 py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white hover:text-black transition-all inline-block shadow-xl">
            Book Private Session
          </Link>
        </motion.div>
      </section>
    </main>
  );
}