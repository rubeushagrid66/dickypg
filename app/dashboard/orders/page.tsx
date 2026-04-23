"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { formatIDR } from "@/lib/utils";
import { Plus, Search, ShoppingBag, MoreVertical, Calendar } from "lucide-react";
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = orders.filter(o => 
    o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.productSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Manajemen Pesanan</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Rekapitulasi Transaksi Dicky Putra Gorden</p>
        </div>
        <Link 
          href="/dashboard/orders/add"
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          BUAT PESANAN
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari pembeli..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold transition-all focus:border-slate-900"
            />
          </div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            {filteredOrders.length} Pesanan Terdata
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Pesanan</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Pelanggan</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={4} className="p-6"><div className="h-10 bg-slate-50 rounded-xl animate-pulse"></div></td></tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Belum ada data</td></tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 text-xs uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">{o.productSnapshot?.name}</span>
                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {o.createdAt?.toDate().toLocaleDateString('id-ID')}</span>
                          <span className="sm:hidden text-slate-300">• {o.buyerName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                      <span className="text-[9px] font-bold text-slate-900 uppercase tracking-tight">{o.buyerName}</span>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-slate-900 text-xs">{formatIDR(o.totalPrice)}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end items-center gap-1">
                        <button className="px-3 py-1.5 bg-slate-100 text-slate-900 text-[8px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all">
                          Detail
                        </button>
                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
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
