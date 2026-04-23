"use client";
import { TrendingUp, Package, ShoppingCart, DollarSign, Plus } from "lucide-react";
import { useSummary } from "@/lib/hooks";
import { formatIDR } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const { totalStock, ordersToday, totalRevenue, isLoading } = useSummary();

  const stats = [
    { 
      name: "Total Stok", 
      value: isLoading ? "..." : totalStock?.toLocaleString(), 
      icon: Package, 
      color: "bg-slate-100 text-slate-900", 
      trend: "Live Data" 
    },
    { 
      name: "Pesanan Hari Ini", 
      value: isLoading ? "..." : ordersToday?.toLocaleString(), 
      icon: ShoppingCart, 
      color: "bg-slate-100 text-slate-900", 
      trend: "Hari ini" 
    },
    { 
      name: "Total Pendapatan", 
      value: isLoading ? "..." : formatIDR(totalRevenue || 0), 
      icon: DollarSign, 
      color: "bg-slate-100 text-slate-900", 
      trend: "Total" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Ringkasan Dashboard</h1>
        <p className="text-slate-400 font-medium text-xs">Statistik terkini operasional Dicky Putra Gorden.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={`${stat.color} p-3 rounded-xl shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                {stat.trend}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between min-h-[200px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Akses Cepat</h3>
            <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">Kelola data inventaris dan pesanan dengan cepat melalui pintasan di bawah.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link 
              href="/dashboard/orders/add"
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Pesanan Baru
            </Link>
            <Link 
              href="/dashboard/products/add"
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Update Stok
            </Link>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col justify-center border-dashed">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Laniakea Digital</p>
            <p className="text-xs text-slate-400 font-medium">Sistem Dashboard v1.0.4 - Terverifikasi Aman</p>
          </div>
        </div>
      </div>
    </div>
  );
}
