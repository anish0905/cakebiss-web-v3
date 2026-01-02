"use client";
import { useEffect, useState } from "react";

export default function ManageCakes() {
  const [cakes, setCakes] = useState([]);

  const fetchCakes = async () => {
    const res = await fetch("/api/cakes");
    const json = await res.json();
    if (json.success) setCakes(json.data);
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const deleteCake = async (id: string) => {
    if (confirm("Are you sure you want to delete this cake?")) {
      const res = await fetch(`/api/cakes/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Deleted!");
        fetchCakes(); // List refresh karne ke liye
      }
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-cake-brown mb-8">Manage All Cakes</h1>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-cake-gold/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-cake-cream">
            <tr>
              <th className="p-4 text-cake-brown font-bold">Image</th>
              <th className="p-4 text-cake-brown font-bold">Name</th>
              <th className="p-4 text-cake-brown font-bold">Category</th>
              <th className="p-4 text-cake-brown font-bold">Price</th>
              <th className="p-4 text-cake-brown font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake: any) => (
              <tr key={cake._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4">
                  <img src={cake.image} className="w-12 h-12 rounded-full object-cover" />
                </td>
                <td className="p-4 font-medium">{cake.name}</td>
                <td className="p-4 text-gray-500">{cake.category}</td>
                <td className="p-4 font-bold text-cake-brown">${cake.price}</td>
                <td className="p-4">
                  <button 
                    onClick={() => deleteCake(cake._id)}
                    className="bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}