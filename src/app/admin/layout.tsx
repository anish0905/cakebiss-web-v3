"use client";
import Link from "next/link";
import { useState } from "react";
import { 
  Menu, X, LayoutDashboard, PlusCircle, 
  Cake, ShoppingBag, Mail, ChevronRight 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Add New Cake", href: "/admin/add-cake", icon: <PlusCircle size={20} /> },
    { name: "Manage Cakes", href: "/admin/manage-cakes", icon: <Cake size={20} /> },
    { name: "Orders List", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Messages", href: "/admin/messages", icon: <Mail size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-black font-sans">
      
      {/* --- Mobile Header --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-50">
        <h2 className="font-serif font-black italic text-xl tracking-tighter">CakeBiss Admin</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-black text-white rounded-xl"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Sidebar (Desktop & Mobile Drawer) --- */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-white border-r border-gray-100 p-8 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="mb-10 hidden lg:block">
          <h2 className="text-3xl font-serif font-black italic border-b-4 border-black pb-4">Admin.</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 text-gray-400">Control Center</p>
        </div>

        <nav className="flex flex-col space-y-2 mt-16 lg:mt-0">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between p-4 rounded-2xl hover:bg-black hover:text-white transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="opacity-70 group-hover:opacity-100">{link.icon}</span>
                <span className="text-xs font-black uppercase tracking-widest">{link.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </nav>

        {/* --- Bottom User Card --- */}
        <div className="absolute bottom-8 left-8 right-8 p-4 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="text-[10px] font-black uppercase text-gray-400">Back to Store</p>
          <Link href="/" className="text-xs font-black hover:text-cake-gold block mt-1">🏠 Main Website</Link>
        </div>
      </aside>

      {/* --- Overlay for Mobile --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Main Content --- */}
      <main className="flex-1 pt-20 lg:pt-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}