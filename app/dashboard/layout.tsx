"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  const navItems = [
    { name: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Stok", href: "/dashboard/products", icon: Package },
    { name: "Manajemen Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Pengaturan Page", href: "/dashboard/settings", icon: Settings },
  ];

  if (!authorized) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-slate-500 font-medium animate-pulse">Memverifikasi Sesi...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-slate-800">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white uppercase">DPG SYSTEM</span>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Admin Staff Only</span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 group font-medium",
                  isActive 
                    ? "bg-white text-slate-900 shadow-xl shadow-slate-950/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-300")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-sm font-bold transition-all group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Logout Akun
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative max-w-full">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b p-4 sm:p-6 flex justify-between items-center z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600 bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-slate-900 font-bold hidden sm:block">Dashboard Panel</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Laniakea Digital Environment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-700 leading-none">Dicky Putra Gorden</span>
              <span className="text-[10px] font-black text-green-600 tracking-widest uppercase mt-1">ONLINE</span>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold border-2 border-slate-100 shadow-inner">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>

        <footer className="p-6 border-t bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">© 2026 Dicky Putra Gorden // All Rights Reserved</p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span>LANIAKEA DIGITAL</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </footer>
      </div>
    </div>
  );
}
