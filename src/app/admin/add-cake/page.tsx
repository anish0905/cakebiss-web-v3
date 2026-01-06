"use client";
import { useState } from "react";
import { Upload, X, ImageIcon, Tag, Weight } from "lucide-react";

export default function AddCake() {
  const [loading, setLoading] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>([]); 
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "", // Added
    quantity: "",
    category: "Chocolate",
    weight: "0.5",     // Added
    unit: "kg",        // Added
    image: "", 
  });

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (extraImages.length + files.length > 3) {
      alert("Sirf 3 extra images allowed hain (Total 4)");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setExtraImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeExtraImage = (index: number) => {
    setExtraImages(extraImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      extraImagesBase64: extraImages,
    };

    try {
      const response = await fetch("/api/cakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Success! Masterpiece with discount & weight added 🎂");
        setFormData({ name: "", description: "", price: "", discountPrice: "", quantity: "", category: "Chocolate", weight: "0.5", unit: "kg", image: "" });
        setExtraImages([]);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 mb-20">
      <h2 className="text-4xl font-serif font-black italic text-black mb-8">Add New Masterpiece</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Info Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cake Title</label>
            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-cake-gold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
            <textarea rows={4} className="w-full p-4 bg-gray-50 rounded-2xl font-medium border-none outline-none focus:ring-2 focus:ring-cake-gold" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Regular Price (₹)</label>
              <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-cake-gold">Discount Price (₹)</label>
              <input type="number" className="w-full p-4 bg-cake-gold/5 rounded-2xl font-bold border-none text-cake-gold outline-none" placeholder="Optional" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} />
            </div>
          </div>

          {/* Weight & Stock Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Weight</label>
              <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unit</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                <option value="kg">KG</option>
                <option value="lb">LB</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Qty</label>
              <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
            </div>
          </div>
        </div>

        {/* Right: Images Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Display Image</label>
            <div className="relative h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" />
              ) : (
                <Upload className="text-gray-300" />
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMainImage} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Extra Details (3 Images)</label>
            <div className="grid grid-cols-3 gap-4">
              {extraImages.map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExtraImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {extraImages.length < 3 && (
                <div className="relative aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <ImageIcon className="text-gray-300" />
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleExtraImages} />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-cake-gold hover:text-black transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? "Uploading 4 Images..." : "Launch to Boutique"}
          </button>
        </div>
      </form>
    </div>
  );
}