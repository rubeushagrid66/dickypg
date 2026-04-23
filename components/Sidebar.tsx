"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const menu = [
    { name: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Stok", href: "/dashboard/products", icon: Package },
    { name: "Manajemen Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl">
      <div className="p-6 text-white font-bold text-xl tracking-tight border-b border-slate-800">
        DPG ADMIN
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {menu.map((item) => (
          <Link key={item.name} href={item.href} className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>
      <button onClick={handleLogout} className="m-4 flex items-center gap-3 p-3 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded-lg transition-all">
        <LogOut size={20} />
        Keluar
      </button>
    </aside>
  );
}
