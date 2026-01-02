"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const result = await signIn("credentials", {
    email,
    password,
    redirect: true, // Isse Next.js khud handle karega
    callbackUrl: "/", // Login ke baad kahan jana hai
  });
  
  // Agar redirect: true hai, toh niche wala code sirf error ke liye chalega
  if (result?.error) {
    alert("Login failed! Check your email/password.");
  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-cake-gold/10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-cake-brown">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Login to manage your sweet orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-cake-brown mb-2">Email Address</label>
            <input
              type="email"
              placeholder="bakery@example.com"
              className="w-full p-4 bg-cake-cream/30 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cake-gold/50 transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cake-brown mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-cake-cream/30 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cake-gold/50 transition"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cake-brown text-black font-bold py-4 rounded-xl hover:bg-cake-gold shadow-lg shadow-cake-brown/20 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-cake-gold font-bold hover:underline">
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
}