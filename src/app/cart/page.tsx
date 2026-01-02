"use client";
import { useCartStore } from "../../store/useCartStore";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart } = useCartStore();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-cake-brown">Your cart is empty!</h2>
        <Link href="/" className="text-cake-gold underline mt-4 inline-block">Go shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-5">
      <h1 className="text-3xl font-bold text-cake-brown mb-8">Your Shopping Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-cake-gold/10">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-cake-brown">{item.name}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-lg text-cake-brown">${item.price * item.quantity}</span>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-white rounded-xl shadow-md border-t-4 border-cake-gold">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total Amount:</span>
          <span className="text-cake-brown">${total}</span>
        </div>
        <button className="w-full mt-6 bg-cake-brown text-black py-3 rounded-lg font-bold hover:bg-cake-gold transition">
         <Link href="/checkout"> Proceed to Checkout</Link>
        </button>
      </div>
    </div>
  );
}