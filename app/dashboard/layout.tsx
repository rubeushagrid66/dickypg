"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState("DPG SYSTEM");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus !== "true") {
      router.push("/");
    } else {
      setAuthorized(true);
    }

    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "siteConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteTitle(docSnap.data().title || "DPG SYSTEM");
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
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

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-helvetica">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 uppercase truncate max-w-[180px]">{siteTitle}</span>
            <span className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase">Staff Environment</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all duration-200 group text-xs font-bold",
                  isActive 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  <span className="uppercase tracking-wider">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-white/50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative max-w-full">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 sm:px-8 flex justify-between items-center z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600 bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Admin</span>
                <span className="text-slate-200">/</span>
                <span className="text-slate-900">{navItems.find(i => i.href === pathname)?.name || "Dashboard"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block">
              <p className="text-[10px] font-bold text-slate-900 leading-none">{siteTitle}</p>
              <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">Authorized Staff</p>
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs border border-slate-200">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 w-full overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>

        <footer className="px-8 py-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 {siteTitle} // Laniakea Digital</p>
          <div className="text-[9px] font-black text-slate-200 tracking-widest uppercase">
            Environment v1.0.4
          </div>
        </footer>
      </div>
    </div>
  );
}
