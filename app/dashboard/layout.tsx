"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Home, Instagram, CalendarDays, Package, Component, AlertTriangle, 
  ClipboardList, ListTodo, CircleDollarSign, FileText, Settings, 
  Headphones, Menu, X, Bell, ChevronDown, Camera, ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSiteSettings } from "@/lib/hooks";

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
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.replace("/");
  };

  const navGroups = [
    {
      title: "SOCIAL MEDIA",
      items: [
        { name: "Instagram Analytics", href: "/dashboard/instagram", icon: Instagram },
        { name: "Content Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      ]
    },
    {
      title: "INVENTORY",
      items: [
        { name: "Stock", href: "/dashboard/products", icon: Package },
        { name: "Materials", href: "/dashboard/materials", icon: Component },
        { name: "Low Stock Alert", href: "/dashboard/alerts", icon: AlertTriangle },
      ]
    },
    {
      title: "PRODUCTION",
      items: [
        { name: "Ongoing Work", href: "/dashboard/ongoing", icon: ClipboardList },
        { name: "Work Queue", href: "/dashboard/queue", icon: ListTodo },
      ]
    },
    {
      title: "FINANCE",
      items: [
        { name: "Revenue", href: "/dashboard/revenue", icon: CircleDollarSign },
        { name: "Orders", href: "/dashboard/orders", icon: FileText },
      ]
    }
  ];

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-helvetica text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 xl:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-300 flex flex-col z-50 transition-transform duration-300 xl:translate-x-0 xl:static xl:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tight uppercase">Curtain</span>
              <span className="text-xs tracking-widest uppercase font-light text-slate-400">Studio</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <Link 
            href="/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-sm font-medium",
              pathname === "/dashboard" 
                ? "bg-blue-600/20 text-white border-l-4 border-blue-500 pl-2" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto pb-4">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 text-sm",
                        isActive 
                          ? "bg-blue-600/20 text-white border-l-4 border-blue-500 pl-1.5" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-white/5">
          <Link 
            href="/dashboard/settings"
            onClick={() => setIsSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 text-sm text-slate-400 hover:text-white hover:bg-white/5",
              pathname === "/dashboard/settings" && "bg-blue-600/20 text-white border-l-4 border-blue-500 pl-1.5"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button 
            className="flex items-center justify-between w-full p-2.5 rounded-lg transition-all duration-200 text-sm text-slate-400 hover:text-white hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-4 h-4" />
              Need Help?
            </div>
            <ChevronRight className="w-3 h-3 opacity-50" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative max-w-full">
        {/* Header */}
        <header className="h-24 bg-white border-b border-slate-200 px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-30 sticky top-0 py-4 sm:py-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="xl:hidden p-2 text-slate-600 bg-slate-100 rounded-lg shrink-0" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Good morning, Admin <span className="text-xl">👋</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Here's what's happening with your business today.</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Camera className="w-4 h-4 text-slate-600" />
              Connect Instagram
            </button>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
              </button>
              
              <div className="flex items-center gap-2 pl-4 border-l border-slate-200 cursor-pointer">
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <div className="hidden sm:flex items-center gap-1 text-sm font-semibold text-slate-700">
                  Admin
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 w-full overflow-y-auto bg-slate-50">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
