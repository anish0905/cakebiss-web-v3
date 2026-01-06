"use client";
import { useEffect, useState } from "react";
import { Trash2, Edit3, Package, Weight as WeightIcon, X, FileText, ImageIcon, Plus, Tag } from "lucide-react";

export default function ManageCakes() {
  const [cakes, setCakes] = useState([]);
  const [editingCake, setEditingCake] = useState<any>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCakes = async () => {
    const res = await fetch("/api/cakes");
    const json = await res.json();
    if (json.success) setCakes(json.data);
  };

  useEffect(() => { fetchCakes(); }, []);

  const handleImageUpdate = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'extra', index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'main') {
          setEditingCake({ ...editingCake, image: reader.result as string });
        } else {
          // Extra images handling
          const currentExtras = [...(editingCake.extraImagesBase64 || editingCake.extraImages || [])];
          if (index !== undefined && index < currentExtras.length) {
            currentExtras[index] = reader.result as string;
          } else {
            currentExtras.push(reader.result as string);
          }
          setEditingCake({ ...editingCake, extraImagesBase64: currentExtras.slice(0, 3) });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeExtraImage = (index: number) => {
    const currentExtras = [...(editingCake.extraImagesBase64 || editingCake.extraImages || [])];
    const updatedExtras = currentExtras.filter((_, i) => i !== index);
    setEditingCake({ ...editingCake, extraImagesBase64: updatedExtras, extraImages: updatedExtras });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...editingCake,
      extraImagesBase64: editingCake.extraImagesBase64 || editingCake.extraImages
    };

    const res = await fetch(`/api/cakes/${editingCake._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Masterpiece synchronized! ✨");
      setIsModalOpen(false);
      fetchCakes();
    }
  };

  const deleteCake = async (id: string) => {
    if (confirm("Permanently delete this creation?")) {
      const res = await fetch(`/api/cakes/${id}`, { method: "DELETE" });
      if (res.ok) fetchCakes();
    }
  };

  return (
    <div className="p-4 md:p-10 bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-black italic mb-10 text-black">Boutique Inventory</h1>

        {/* Table View */}
        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Masterpiece</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Inventory</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Pricing</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cakes.map((cake: any) => (
                  <tr key={cake._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={cake.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                        <div>
                          <p className="font-black text-black truncate max-w-[150px]">{cake.name}</p>
                          <span className="text-[9px] font-black text-cake-gold uppercase tracking-widest">{cake.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><Package size={14}/> {cake.quantity} Units</p>
                        <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><WeightIcon size={14}/> {cake.weight}{cake.unit}</p>
                      </div>
                    </td>
                    <td className="p-6">
                       <p className="font-black text-black">₹{cake.discountPrice || cake.price}</p>
                       {cake.discountPrice > 0 && <p className="text-[10px] line-through text-gray-300">₹{cake.price}</p>}
                    </td>
                    <td className="p-6 flex gap-2">
                      <button onClick={() => { setEditingCake(cake); setIsModalOpen(true); }} className="p-3 bg-black text-white rounded-xl hover:bg-cake-gold hover:text-black transition-all shadow-md"><Edit3 size={18} /></button>
                      <button onClick={() => deleteCake(cake._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- REFINED EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-3xl rounded-[3.5rem] p-8 md:p-12 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-all hover:rotate-90"><X size={28} /></button>
            
            <h2 className="text-3xl font-serif font-black italic mb-8 text-black underline decoration-cake-gold underline-offset-8">Refine Details</h2>
            
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Basic Details */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cake Name</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-black border-none outline-none focus:ring-2 focus:ring-cake-gold" value={editingCake.name} onChange={(e) => setEditingCake({...editingCake, name: e.target.value})} required />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
                <textarea rows={3} className="w-full p-4 bg-gray-50 rounded-2xl font-medium border-none outline-none focus:ring-2 focus:ring-cake-gold" value={editingCake.description} onChange={(e) => setEditingCake({...editingCake, description: e.target.value})} />
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
                <select className="w-full p-4 bg-gray-50 rounded-2xl font-black border-none outline-none" value={editingCake.category} onChange={(e) => setEditingCake({...editingCake, category: e.target.value})}>
                   <option value="Chocolate">Chocolate</option>
                   <option value="Wedding">Wedding</option>
                   <option value="Birthday">Birthday</option>
                   <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Weight Unit</label>
                <select className="w-full p-4 bg-gray-50 rounded-2xl font-black border-none outline-none" value={editingCake.unit} onChange={(e) => setEditingCake({...editingCake, unit: e.target.value})}>
                   <option value="kg">KG</option>
                   <option value="lb">Pound (LB)</option>
                </select>
              </div>

              {/* Main Image Management */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Display</label>
                <div className="relative h-40 bg-gray-100 rounded-3xl overflow-hidden group border-2 border-dashed border-gray-200">
                  <img src={editingCake.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpdate(e, 'main')} />
                    <Plus className="text-white" />
                  </div>
                </div>
              </div>

              {/* Extra Images Management (With Delete & Add) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Gallery (Max 3)</label>
                <div className="grid grid-cols-3 gap-2">
                  {(editingCake.extraImagesBase64 || editingCake.extraImages || []).map((img: string, i: number) => (
                    <div key={i} className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExtraImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(editingCake.extraImagesBase64 || editingCake.extraImages || []).length < 3 && (
                    <div className="relative aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:bg-cake-gold/5 transition-all">
                      <Plus className="text-gray-300" />
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpdate(e, 'extra')} />
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Base Price (₹)</label>
                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-black border-none" value={editingCake.price} onChange={(e) => setEditingCake({...editingCake, price: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-cake-gold">Offer Price (₹)</label>
                <input type="number" className="w-full p-4 bg-cake-gold/5 text-cake-gold rounded-2xl font-black border-none" value={editingCake.discountPrice} onChange={(e) => setEditingCake({...editingCake, discountPrice: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Weight Value</label>
                <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl font-black border-none" value={editingCake.weight} onChange={(e) => setEditingCake({...editingCake, weight: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Units in Stock</label>
                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-black border-none" value={editingCake.quantity} onChange={(e) => setEditingCake({...editingCake, quantity: e.target.value})} />
              </div>

              <button type="submit" className="md:col-span-2 w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-cake-gold hover:text-black transition-all shadow-2xl mt-4">
                Update Boutique Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}