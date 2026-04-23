"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus !== "true") {
      router.push("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  if (!authorized) return <div className="p-10 text-center">Checking Authorization...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 font-bold text-lg border-b border-slate-700">DPG Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block p-2 hover:bg-slate-800 rounded">Ringkasan</Link>
          <Link href="/dashboard/products" className="block p-2 hover:bg-slate-800 rounded">Manajemen Stok</Link>
          <Link href="/dashboard/orders" className="block p-2 hover:bg-slate-800 rounded">Manajemen Pesanan</Link>
        </nav>
        <button 
          onClick={handleLogout}
          className="m-4 p-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <span className="text-gray-500 italic">Dicky Putra Gorden // Laniakea Digital</span>
          <span className="text-sm font-semibold text-slate-700">Admin Staff</span>
        </header>
        {children}
      </main>
    </div>
  );
}
