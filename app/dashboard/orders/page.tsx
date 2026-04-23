"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { formatIDR } from "@/lib/utils";
import { Plus, Search, ShoppingBag, MoreVertical, Filter, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = orders.filter(o => 
    o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.productSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">MANAJEMEN PESANAN</h1>
          <p className="text-slate-500 font-medium text-sm">Monitor dan kelola seluruh transaksi pesanan pelanggan.</p>
        </div>
        <Link 
          href="/dashboard/orders/add"
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Buat Pesanan Baru
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari pembeli atau nama produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Status: Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Pesanan</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bayar</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="p-6"><div className="h-12 bg-slate-100 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <ShoppingBag className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada pesanan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 tracking-tight">{o.productSnapshot?.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {o.createdAt?.toDate().toLocaleDateString('id-ID')}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">ID: {o.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-slate-900/10">
                          {o.buyerName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{o.buyerName}</span>
                          <span className="text-[10px] font-bold text-slate-400">{o.phoneNumber || "No Phone"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-emerald-600 text-lg tracking-tight">{formatIDR(o.totalPrice)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pembayaran Lunas</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end items-center gap-2">
                        <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                          Detail
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
