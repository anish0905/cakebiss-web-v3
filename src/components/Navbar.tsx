"use client";
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useCartStore } from "../store/useCartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const { data: session, status }: any = useSession();
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Cakes", href: "/cakes" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-cake-gold/10 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex justify-between items-center h-20">
          
        

          {/* 2. Brand Logo */}
          <div className="flex items-center group">
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl">🧁</span>
              <div className="ml-2 flex flex-col leading-none">
                <span className="text-xl sm:text-2xl font-serif font-black tracking-tighter text-cake-brown group-hover:text-cake-gold transition-colors italic">
                  CAKE<span className="not-italic">BISS</span>
                </span>
                <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-cake-gold font-bold">Patisserie</span>
              </div>
            </Link>
          </div>

          {/* 3. Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10 text-[12px] lg:text-sm font-bold uppercase tracking-widest text-cake-brown/80">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="hover:text-cake-gold transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-cake-gold hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 4. Actions Section (Always Visible) */}
          <div className="flex items-center space-x-3 sm:space-x-6 lg:space-x-8">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cake-brown">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.112 16.829a1.5 1.5 0 0 1-1.067 1.591l-11.411 3.51a1.5 1.5 0 0 1-1.393-2.126l4.474-12.82a1.5 1.5 0 0 1 1.442-1.047h7.243c.732 0 1.353.541 1.442 1.263Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-cake-brown text-black text-[12px] font-black w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth Logic */}
            <div className="hidden sm:flex items-center border-l border-gray-100 pl-4 sm:pl-8 space-x-4 lg:space-x-6">
              {status === "loading" ? (
                <div className="w-6 h-6 rounded-full border-2 border-cake-gold/20 border-t-cake-gold animate-spin" />
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-[9px] uppercase font-bold text-gray-400 leading-none">Patron</span>
                    <span className="text-xs font-serif font-bold text-cake-brown">{session.user.name.split(' ')[0]}</span>
                  </div>
                  {session.user.role === "admin" && (
                    <Link href="/admin" className="bg-cake-brown text-cake-gold px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter hover:bg-amber-200 transition-all">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase">
                    Logout
                  </button>
                </div>
              ) : (
               <Link 
  href="/login" 
  className="relative group overflow-hidden bg-cake-brown px-6 lg:px-10 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-500 ease-out shadow-[0_4px_20px_rgba(61,37,20,0.2)] hover:shadow-cake-gold/40 active:scale-95"
>
  {/* Hover Layer: Ye layer niche se upar ki taraf fill hogi */}
  <span className="absolute inset-0 w-full h-full bg-cake-gold transition-transform duration-500 ease-out transform translate-y-full group-hover:translate-y-0"></span>

  {/* Button Text: Relative z-10 taaki ye layer ke upar dikhe */}
  <span className="relative z-10 flex items-center group-hover:text-cake-brown transition-colors duration-500 text-black">
    Login
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-3 w-3 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </span>
</Link>
              )}
            </div>
          </div>
            {/* 1. Mobile Menu Button (Left on Mobile) */}
          <button 
            className="md:hidden p-2 text-cake-brown"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* 5. Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 space-y-4 flex flex-col bg-white">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold uppercase tracking-widest text-cake-brown px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-gray-50" />
            {!session ? (
              <Link href="/login" className="text-sm font-bold uppercase text-cake-gold px-2">Login</Link>
            ) : (
              <>
                {session.user.role === "admin" && <Link href="/admin" className="text-sm font-bold uppercase text-cake-gold px-2">Dashboard</Link>}
                <button onClick={handleLogout} className="text-left text-sm font-bold uppercase text-red-500 px-2">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;