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
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-cake-gold/10 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Mobile Menu Button (Left on Mobile) */}
          <button 
            className="md:hidden p-2 text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          {/* 2. Brand Logo */}
          <div className="flex items-center group">
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl">🧁</span>
              <div className="ml-2 flex flex-col leading-none">
                <span className="text-xl sm:text-2xl font-serif font-black tracking-tighter text-black group-hover:text-cake-gold transition-colors italic">
                  CAKE<span className="not-italic">BISS</span>
                </span>
                <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-cake-gold font-bold">Patisserie</span>
              </div>
            </Link>
          </div>

          {/* 3. Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10 text-[12px] lg:text-sm font-black uppercase tracking-widest text-black/70">
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

          {/* 4. Actions Section */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-black">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.112 16.829a1.5 1.5 0 0 1-1.067 1.591l-11.411 3.51a1.5 1.5 0 0 1-1.393-2.126l4.474-12.82a1.5 1.5 0 0 1 1.442-1.047h7.243c.732 0 1.353.541 1.442 1.263Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Logic */}
            <div className="flex items-center border-l border-gray-100 pl-4 sm:pl-8 space-x-4">
              {status === "loading" ? (
                <div className="w-6 h-6 rounded-full border-2 border-cake-gold/20 border-t-cake-gold animate-spin" />
              ) : session ? (
                <div className="flex items-center space-x-3 sm:space-x-5">
                  {/* Profile Avatar Link */}
                  <Link href="/profile" className="flex items-center space-x-3 group">
                    <div className="hidden lg:flex flex-col text-right">
                      <span className="text-[9px] uppercase font-black text-gray-400 leading-none">Patron</span>
                      <span className="text-xs font-black text-black group-hover:text-cake-gold transition-colors">{session.user.name.split(' ')[0]}</span>
                    </div>
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-transparent group-hover:border-cake-gold transition-all shadow-md">
                       {session.user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>

                  <div className="flex items-center space-x-3">
                    {session.user.role === "admin" && (
                      <Link href="/admin" className="hidden sm:block bg-cake-gold text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-all">
                        Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="relative group overflow-hidden bg-black px-6 lg:px-10 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-500 shadow-xl hover:shadow-cake-gold/40 active:scale-95"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-cake-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 5. Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 space-y-4 flex flex-col bg-white animate-fade-in">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-black uppercase tracking-widest text-black px-4 hover:text-cake-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-gray-50 mx-4" />
            {session && (
              <Link href="/profile" className="text-sm font-black uppercase tracking-widest text-black px-4" onClick={() => setIsMobileMenuOpen(false)}>
                My Profile
              </Link>
            )}
            <div className="px-4">
              {!session ? (
                <Link href="/login" className="inline-block bg-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              ) : (
                <div className="flex flex-col space-y-4 pt-2">
                  {session.user.role === "admin" && <Link href="/admin" className="text-sm font-black uppercase text-cake-gold" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>}
                  <button onClick={handleLogout} className="text-left text-sm font-black uppercase text-red-500">Logout</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;