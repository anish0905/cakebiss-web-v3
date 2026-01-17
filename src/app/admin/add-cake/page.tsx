"use client";
import { useState } from "react";
import { Upload, X, ImageIcon, Tag, Weight, Sparkles, Plus, Trash2 } from "lucide-react";

export default function AddCake() {
  const [loading, setLoading] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  
  // Naye States for Dynamic Lists
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  
  // Variant state with Discount Price
  const [variantInput, setVariantInput] = useState({ weight: "", price: "", discountPrice: "" });
  const [priceVariants, setPriceVariants] = useState<{ weight: number, price: number, discountPrice: number }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "10",
    category: "Birthday",
    flavor: "Chocolate",
    isEggless: false,
    unit: "kg",
    image: "", 
  });

  // --- Highlights Add Logic ---
  const addHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  // --- Price & Discount Variant Logic ---
  const addVariant = () => {
    if (variantInput.weight && variantInput.price) {
      setPriceVariants([...priceVariants, {
        weight: parseFloat(variantInput.weight),
        price: parseFloat(variantInput.price),
        discountPrice: parseFloat(variantInput.discountPrice || "0")
      }]);
      setVariantInput({ weight: "", price: "", discountPrice: "" });
    }
  };

  // --- Main Image Handler ---
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // --- Extra Images Handler (Max 3) ---
  const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (extraImages.length + files.length > 3) {
      alert("Sirf 3 extra images allowed hain!");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setExtraImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (priceVariants.length === 0) return alert("Kam se kam ek weight aur price add karein!");
    
    setLoading(true);
    const payload = {
      ...formData,
      highlights,
      priceVariants,
      extraImagesBase64: extraImages,
    };

    try {
      const response = await fetch("/api/cakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Success! Masterpiece added with Discounts 🎂");
        window.location.reload(); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 mb-20 font-sans">
      <h2 className="text-4xl font-serif font-black italic text-black mb-8">Add New Masterpiece</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Side: General Info & Variants */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cake Title</label>
            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-black" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Description</label>
            <textarea rows={3} className="w-full p-4 bg-gray-50 rounded-2xl font-medium border-none outline-none focus:ring-2 focus:ring-black" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          {/* Highlights Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-bold">Product Highlights (List)</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 p-3 bg-gray-50 rounded-xl outline-none text-sm" placeholder="e.g. Serves: 2-3 people" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} />
              <button type="button" onClick={addHighlight} className="bg-black text-white px-4 rounded-xl font-bold"><Plus size={18}/></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {highlights.map((h, i) => (
                <span key={i} className="bg-gray-100 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                  {h} <X size={12} className="cursor-pointer text-red-500" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} />
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic Weight, Price & Discount Section */}
          <div className="bg-gray-50 p-5 rounded-3xl space-y-4 border border-gray-100">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Weight size={14}/> Weight, Price & Discount</label>
            <div className="grid grid-cols-4 gap-2">
              <input type="number" step="0.1" placeholder="Wt" className="p-3 rounded-xl border-none outline-none text-sm" value={variantInput.weight} onChange={(e)=>setVariantInput({...variantInput, weight: e.target.value})} />
              <input type="number" placeholder="Price" className="p-3 rounded-xl border-none outline-none text-sm" value={variantInput.price} onChange={(e)=>setVariantInput({...variantInput, price: e.target.value})} />
              <input type="number" placeholder="Disc" className="p-3 rounded-xl border-none outline-none text-sm bg-cake-gold/10" value={variantInput.discountPrice} onChange={(e)=>setVariantInput({...variantInput, discountPrice: e.target.value})} />
              <button type="button" onClick={addVariant} className="bg-black text-white rounded-xl flex items-center justify-center"><Plus size={20}/></button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {priceVariants.map((v, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs">{v.weight} KG — ₹{v.price}</span>
                    {v.discountPrice > 0 && <span className="text-[10px] text-green-600 font-bold">Discounted: ₹{v.discountPrice}</span>}
                  </div>
                  <Trash2 size={14} className="text-red-400 cursor-pointer" onClick={() => setPriceVariants(priceVariants.filter((_, idx) => idx !== i))} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Media & Classification */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Bento Cake">Bento Cake</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Flavor</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" value={formData.flavor} onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}>
                <option value="Chocolate">Chocolate</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Vanilla">Vanilla</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dietary Choice</label>
            <div className="flex bg-gray-50 rounded-2xl p-1 h-[56px]">
              <button type="button" onClick={() => setFormData({ ...formData, isEggless: false })} className={`flex-1 rounded-xl font-bold transition-all ${!formData.isEggless ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>With Egg</button>
              <button type="button" onClick={() => setFormData({ ...formData, isEggless: true })} className={`flex-1 rounded-xl font-bold transition-all ${formData.isEggless ? 'bg-green-500 text-white shadow-sm' : 'text-gray-400'}`}>Eggless 🌿</button>
            </div>
          </div>

          {/* Main Image Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-bold">Main Image & Extra Details (Max 3)</label>
            <div className="grid grid-cols-4 gap-2 h-24">
               {/* Main Image Select */}
               <div className="relative rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                 {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <Upload size={16} className="text-gray-300" />}
                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMainImage} />
               </div>
               
               {/* Extra Images Previews */}
               {extraImages.map((img, i) => (
                 <div key={i} className="relative rounded-xl overflow-hidden group">
                   <img src={img} className="w-full h-full object-cover" />
                   <button type="button" onClick={() => setExtraImages(extraImages.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><X size={14}/></button>
                 </div>
               ))}

               {/* Add Extra Button */}
               {extraImages.length < 3 && (
                 <div className="relative rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
                   <ImageIcon size={16} className="text-gray-400" />
                   <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleExtraImages} />
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Status (Qty)</label>
            <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-black/90 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? "SAVING..." : <><Sparkles size={18} /> Launch Masterpiece</>}
          </button>
        </div>
      </form>
    </div>
  );
}