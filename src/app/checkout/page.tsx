"use client";
import { useCartStore } from "../../store/useCartStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart }: any = useCartStore(); // clearCart function store mein add karna hoga
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({ items: cart, totalAmount: total, address, phone }),
    });

 // Checkout Page mein handleOrder ke andar
if (res.ok) {
  alert("Order Placed Successfully!");
  useCartStore.getState().clearCart(); // Cart khali
  router.push("/");
}
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-cake-brown mb-8">Shipping Details</h1>
      <form onSubmit={handleOrder} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-cake-gold/10">
        <div>
          <label className="block font-semibold mb-2">Delivery Address</label>
          <textarea 
            className="w-full p-3 border rounded-xl" rows={3} required
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block font-semibold mb-2">Phone Number</label>
          <input 
            type="text" className="w-full p-3 border rounded-xl" required
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="border-t pt-4">
          <p className="text-xl font-bold">Total: ${cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0)}</p>
        </div>
        <button className="w-full bg-cake-gold text-black font-bold py-4 rounded-xl hover:bg-cake-brown transition">
          Confirm & Pay on Delivery
        </button>
      </form>
    </div>
  );
}
