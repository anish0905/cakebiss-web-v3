"use client";
import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import AddToCartBtn from "../../../components/AddToCartBtn";

export default function CakeDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cake, setCake] = useState<any>(null);
  const [activeImg, setActiveImg] = useState("");
  const [relatedCakes, setRelatedCakes] = useState([]);

  useEffect(() => {
    // 1. Fetch Main Cake Details
    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setCake(json.data);
        setActiveImg(json.data.image);
        
        // 2. Fetch Related Cakes (Same Category)
        fetch(`/api/cakes?category=${json.data.category}&limit=4`)
          .then(r => r.json())
          .then(related => setRelatedCakes(related.data.filter((c:any) => c._id !== id)));
      });
  }, [id]);

  if (!cake) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffcf9]">
      <div className="w-16 h-16 border-4 border-cake-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-serif italic text-gray-400">Preparing your masterpiece...</p>
    </div>
  );

  const allImages = [cake.image, ...(cake.extraImages || [])].slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fffcf9] pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/cakes" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-12 hover:text-cake-gold transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
          
          {/* --- LEFT: LUXURY GALLERY --- */}
          <div className="space-y-6">
            <motion.div 
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-gray-100"
            >
              <img src={activeImg} className="w-full h-full object-cover" alt={cake.name} />
              {cake.discountPrice > 0 && (
                <div className="absolute top-8 right-8 bg-red-600 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Save ₹{cake.price - cake.discountPrice}
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img ? "border-cake-gold scale-95 shadow-md" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: PRODUCT DETAILS --- */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-cake-gold font-black uppercase tracking-[0.4em] text-[10px]">{cake.category} Collection</span>
              <h1 className="text-5xl md:text-7xl font-serif font-black italic text-black leading-tight tracking-tighter">{cake.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex text-cake-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Verified Masterpiece</span>
              </div>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed font-medium italic border-l-4 border-cake-gold/20 pl-6">"{cake.description}"</p>

            <div className="flex items-center gap-10 py-10 border-y border-gray-100">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Investment</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-black tracking-tighter">₹{cake.discountPrice || cake.price}</span>
                  {cake.discountPrice > 0 && <span className="text-xl text-gray-300 line-through font-bold">₹{cake.price}</span>}
                </div>
              </div>
              <div className="w-[1px] h-16 bg-gray-100" />
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Configuration</p>
                <span className="text-2xl font-black text-black uppercase">{cake.weight} {cake.unit}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 scale-110 origin-left">
                {cake.quantity > 0 ? (
                  <AddToCartBtn cake={cake} />
                ) : (
                  <button disabled className="w-full py-6 rounded-full bg-gray-100 text-gray-400 font-black uppercase text-xs">Out of Stock</button>
                )}
              </div>
              <button className="flex-1 py-6 rounded-full border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all">Request Customization</button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="p-6 bg-white rounded-3xl border border-gray-50 flex items-center gap-4">
                <Truck className="text-cake-gold" size={20} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-tighter">Delivery</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Same Day</p>
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-gray-50 flex items-center gap-4">
                <ShieldCheck className="text-cake-gold" size={20} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-tighter">Quality</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">100% Organic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        {relatedCakes.length > 0 && (
          <section className="border-t border-gray-100 pt-20">
            <h2 className="text-3xl font-serif italic mb-12">You might also adore...</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedCakes.map((c: any) => (
                <Link href={`/cakes/${c._id}`} key={c._id} className="group">
                  <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 bg-gray-100">
                    <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-tighter">{c.name}</h4>
                  <p className="text-cake-gold font-bold text-xs">₹{c.discountPrice || c.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}