"use client";
import { useCartStore } from "../store/useCartStore";

export default function AddToCartBtn({ cake }: { cake: any }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button 
      onClick={() => {
        addToCart(cake);
        alert(`${cake.name} added to cart! 🎂`);
      }}
      className="bg-cake-brown text-black p-2 px-4 rounded-lg hover:bg-cake-gold transition active:scale-95"
    >
      Add to Cart
    </button>
  );
}