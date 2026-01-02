"use client";
import AddToCartBtn from "../../components/AddToCartBtn";
import { useEffect, useState } from "react";


export default function CakesPage() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Chocolate", "Vanilla", "Wedding", "Birthday"];

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCakes(json.data);
          setFilteredCakes(json.data);
        }
      });
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = cakes;

    if (activeCategory !== "All") {
      result = result.filter((c: any) => c.category === activeCategory);
    }

    if (search) {
      result = result.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCakes(result);
  }, [search, activeCategory, cakes]);

  return (
    <div className="min-h-screen p-10 bg-cake-cream/20">
      <h1 className="text-4xl font-serif text-cake-brown text-center mb-10">Our Sweet Collection</h1>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-12 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Search for cakes..."
          className="p-3 rounded-full border border-cake-gold/30 w-full md:w-1/3 outline-none focus:ring-2 focus:ring-cake-gold"
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border transition ${
                activeCategory === cat
                  ? "bg-cake-gold text-white border-cake-gold"
                  : "bg-white text-cake-brown border-gray-200 hover:border-cake-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filteredCakes.map((cake: any) => (
          <div key={cake._id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition group">
            <div className="h-56 overflow-hidden rounded-xl mb-4">
              <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <h3 className="text-lg font-bold text-cake-brown">{cake.name}</h3>
            <p className="text-cake-gold font-bold mb-4">${cake.price}</p>
            <AddToCartBtn cake={cake} />
          </div>
        ))}
      </div>
      
      {filteredCakes.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No cakes found matching your search. 🍰</p>
      )}
    </div>
  );
}