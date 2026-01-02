import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-cake-brown text-black p-6 space-y-6">
        <h2 className="text-xl font-bold border-b border-white/20 pb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
  <Link href="/admin" className="hover:text-cake-gold transition">📊 Dashboard Overview</Link>
  <Link href="/admin/add-cake" className="hover:text-cake-gold transition">➕ Add New Cake</Link>
  <Link href="/admin/manage-cakes" className="hover:text-cake-gold transition">🍰 Manage Cakes</Link>
  <Link href="/admin/orders" className="hover:text-cake-gold transition">📦 Orders List</Link>
  <Link href="/admin/messages" className="hover:text-cake-gold transition">📧 Messages</Link>
</nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}