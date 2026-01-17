"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, ChevronRight, Sparkles } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Account created successfully!");
      router.push("/login");
    } else {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    // pt-28 ensures margin from the fixed Navbar
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 pt-28 pb-10 relative">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full bg-[#ff4d6d]/5 blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <Sparkles size={12} className="text-[#ff4d6d]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-100">The Club Membership</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none mb-4">
            Join <span className="text-[#ff4d6d]">Us</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-200 uppercase tracking-[0.4em]">
            Start your luxury dessert journey
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
          <form onSubmit={handleSignup} className="space-y-7">
            
            {/* Full Name */}
            <div className="group space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-200 group-focus-within:text-[#ff4d6d] transition-colors">
                Full Name
              </label>
              <div className="relative border-b border-white/10 group-focus-within:border-[#ff4d6d] transition-all">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full py-4 pl-8 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-100"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="group space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-200 group-focus-within:text-[#ff4d6d] transition-colors">
                Email Identity
              </label>
              <div className="relative border-b border-white/10 group-focus-within:border-[#ff4d6d] transition-all">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full py-4 pl-8 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-100"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-200 group-focus-within:text-[#ff4d6d] transition-colors">
                Pass-Key
              </label>
              <div className="relative border-b border-white/10 group-focus-within:border-[#ff4d6d] transition-all">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                <input
                  type="password"
                  placeholder="Create Secure Password"
                  className="w-full py-4 pl-8 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-100"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#ff4d6d] hover:text-white transition-all active:scale-95 shadow-xl disabled:opacity-50"
            >
              {loading ? "Registering..." : "Create Account"}
              {!loading && <ChevronRight size={14} />}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-[9px] text-gray-200 font-bold uppercase tracking-widest leading-loose">
              Already have an account? <br />
              <Link href="/login" className="text-white hover:text-[#ff4d6d] transition-colors underline underline-offset-4 decoration-[#ff4d6d]/30">
                Log In Here
              </Link>
            </p>
          </div>
        </div>

        {/* Policy Notice */}
        <p className="mt-10 text-[8px] text-gray-700 font-bold uppercase tracking-[0.3em] text-center leading-relaxed">
          By registering, you agree to the <br /> 
          <span className="text-gray-500">Terms of Service & Privacy Protocol</span>
        </p>
      </motion.div>
    </div>
  );
}