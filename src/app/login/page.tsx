"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });
    if (result?.error) {
      alert("Invalid Credentials");
      setLoading(false);
    }
  };

  return (
    // pt-28 ensures Navbar margin
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 pt-28 pb-10 relative">
      
      {/* Soft Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full bg-[#ff4d6d]/5 blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none mb-4">
            Sign <span className="text-[#ff4d6d]">In</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-200 uppercase tracking-[0.4em]">
            Access your private collection
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 shadow-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Email Input */}
            <div className="group space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-200 group-focus-within:text-[#ff4d6d] transition-colors">
                Email Address
              </label>
              <div className="relative border-b border-white/10 group-focus-within:border-[#ff4d6d] transition-all">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-100" size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-4 pl-8 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-100"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-200 group-focus-within:text-[#ff4d6d] transition-colors">
                  Password
                </label>
                <Link href="#" className="text-[8px] font-bold text-gray-100 uppercase hover:text-[#ff4d6d]">Forgot?</Link>
              </div>
              <div className="relative border-b border-white/10 group-focus-within:border-[#ff4d6d] transition-all">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-100" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full py-4 pl-8 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-100"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#ff4d6d] hover:text-white transition-all active:scale-95 disabled:opacity-50 shadow-lg"
            >
              {loading ? "Verifying..." : "Authenticate"}
              {!loading && <ChevronRight size={14} />}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-12 text-center border-t border-white/5 pt-8">
            <p className="text-[9px] text-gray-200 font-bold uppercase tracking-widest">
              New to CakeBiss?{" "}
              <Link href="/signup" className="text-white hover:text-[#ff4d6d] transition-colors underline underline-offset-4 decoration-[#ff4d6d]/30">
                Join the club
              </Link>
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-10 flex items-center justify-center gap-4 opacity-30">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[8px] text-gray-200 font-bold uppercase tracking-[0.2em]">Secure Cloud Gate Active</span>
        </div>
      </motion.div>
    </div>
  );
}