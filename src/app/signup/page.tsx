"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Account created! Please login.");
      router.push("/login");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-cake-brown mb-6 text-center">Join Our Bakery</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 bg-gray-50 border rounded-xl"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 bg-gray-50 border rounded-xl"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-gray-50 border rounded-xl"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button className="w-full bg-cake-gold text-black font-bold py-4 rounded-xl">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}