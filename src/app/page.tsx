import AddToCartBtn from "../components/AddToCartBtn";
import FallingCakes from "../components/FallingCakes";
import dbConnect from "../lib/dbConnect";
import Cake from "../models/Cake";
import Link from "next/link";

async function getCakes() {
  await dbConnect();
  const cakes = await Cake.find({}).limit(4).lean(); // Home par sirf top 4 best sellers
  return JSON.parse(JSON.stringify(cakes));
}

export default async function Home() {
  const cakes = await getCakes();

  return (
    <main className="min-h-screen bg-[#fffcf9]">
      <FallingCakes/>
      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-cake-cream/30 px-6">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-cake-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-cake-brown/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center z-10">
          <span className="text-cake-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block animate-fade-in">
            Est. 2024 • Artisanal Patisserie
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-cake-brown mb-6 leading-[1.1] italic">
            Handcrafted <span className="not-italic font-black text-cake-gold">Happiness</span> <br /> 
            in Every Bite
          </h1>
          <p className="text-base md:text-xl text-cake-brown/70 mb-10 max-w-2xl mx-auto font-medium">
            Experience the finest organic ingredients blended with master craftsmanship. 
            Delivered fresh from our oven to your celebration.
          </p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
  {/* Primary Button: Dark Brown with Gold Hover */}
 <Link 
  href="/cakes" 
  className="w-full sm:w-auto bg-cake-brown text-black px-10 py-4 rounded-full font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(61,37,20,0.3)] hover:bg-cake-gold hover:shadow-cake-gold/40 hover:-translate-y-1 text-sm uppercase tracking-[0.2em] text-center"
>
  Explore Collection
</Link>

  {/* Secondary Button: Outline style for balanced UI */}
  <Link href="/about" className="w-full sm:w-auto bg-white border border-cake-brown/20 text-cake-brown px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cake-cream/50 transition-all duration-500 text-center">
    Our Story
  </Link>
</div>
        </div>
      </section>

      {/* --- QUICK CATEGORIES (NEW) --- */}
      <section className="py-12 bg-white border-y border-cake-gold/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
          {['Chocolate', 'Wedding', 'Birthday', 'Custom'].map((cat) => (
            <div key={cat} className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <span className="text-2xl">🍰</span>
              <span className="font-serif font-bold text-cake-brown">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- BEST SELLERS GRID --- */}
      <section className="py-20 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-cake-brown italic">Our Best Sellers</h2>
            <div className="h-1 w-20 bg-cake-gold mt-4" />
          </div>
          <Link href="/cakes" className="text-cake-gold font-bold border-b-2 border-cake-gold pb-1 hover:text-cake-brown hover:border-cake-brown transition-all">
            View All Creations →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {cakes.map((cake: any) => (
            <div key={cake._id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(61,37,20,0.1)] transition-all duration-500 border border-cake-gold/5 flex flex-col h-full">
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={cake.image} 
                  alt={cake.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-cake-brown shadow-sm">
                    {cake.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow text-center items-center">
                <h3 className="text-xl font-serif font-bold text-cake-brown mb-2">{cake.name}</h3>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed italic">
                  "{cake.description}"
                </p>
                
                <div className="mt-auto w-full pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] block text-gray-400 font-bold uppercase">Price</span>
                    <span className="text-xl font-bold text-cake-brown">${cake.price}</span>
                  </div>
                  <AddToCartBtn cake={cake} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PROMO BANNER (NEW) --- */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-cake-brown rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-80 text-9xl">🎂</div>
          <h2 className="text-3xl md:text-5xl font-serif text-cake-gold italic mb-6">Planning a grand celebration?</h2>
          <p className="text-cake-cream/70 max-w-xl mx-auto mb-10 text-lg">
            Hum customized wedding aur event cakes mein specialize karte hain. Aaj hi apna slot book karein.
          </p>
          <Link href="/contact" className="bg-cake-gold text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-cake-brown transition-all">
            Get a Quote
          </Link>
        </div>
      </section>
    </main>
  );
}