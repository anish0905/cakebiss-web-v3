"use client";
import { useState } from "react";

export default function AddCake() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Chocolate",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch("/api/cakes", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    console.log(response);

    if (response.ok) {
      alert("Cake added successfully! 🎂");
      setFormData({ name: "", description: "", price: "", image: "", category: "Chocolate" });
    } else {
      alert("Error adding cake");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-cake-gold/10">
      <h2 className="text-3xl font-bold text-cake-brown mb-6">Add New Premium Cake</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-cake-brown">Cake Name</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cake-gold"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cake-brown">Description</label>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cake-gold"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-cake-brown">Price ($)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cake-gold"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-cake-brown">Category</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cake-gold"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Chocolate">Chocolate</option>
              <option value="Vanilla">Vanilla</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cake-brown">Image URL (Use Unsplash for now)</label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cake-gold"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cake-brown text-black font-bold py-3 rounded-lg hover:bg-opacity-90 transition duration-300"
        >
          Add Cake to Shop
        </button>
      </form>
    </div>
  );
}