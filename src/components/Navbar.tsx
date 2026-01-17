"use client";
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useCartStore } from "../store/useCartStore";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { data: session, status } = useSession();
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Collection", href: "/cakes" },
    { name: "The Story", href: "/about" },
    { name: "Bespoke", href: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
        ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-3" 
        : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex justify-between items-center">
            
            {/* Logo Section */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl drop-shadow-md">🧁</span>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black tracking-tighter text-white italic group-hover:text-[#ff4d6d] transition-colors leading-none">
                  CAKE<span className="not-italic text-[#ff4d6d]">BISS</span>
                </span>
                <span className="text-[7px] tracking-[0.4em] uppercase text-gray-500 font-bold">Patisserie</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ff4d6d] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Icons Section */}
            <div className="flex items-center gap-5">
              <Link href="/cart" className="relative group">
                <ShoppingBag size={20} className="text-white group-hover:text-[#ff4d6d] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff4d6d] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-5">
                {session ? (
                  <div className="flex items-center gap-4">
                    <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4d6d] to-[#7209b7] flex items-center justify-center border border-white/20">
                      <User size={14} className="text-white" />
                    </Link>
                    <button onClick={() => signOut()} className="text-gray-500 hover:text-red-500 transition-colors">
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="text-[9px] font-black uppercase tracking-widest bg-white text-black px-5 py-2 rounded-full hover:bg-[#ff4d6d] hover:text-white transition-all">
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white z-50">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-6">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold italic text-white uppercase tracking-tighter">
                    {link.name}
                  </Link>
                ))}
                {session?.user.role === "admin" && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[#ff4d6d] font-bold">Admin Panel</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;