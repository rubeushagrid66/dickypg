"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { formatIDR } from "@/lib/utils";
import { Plus, Search, Archive, Package, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/lib/hooks";

export default function ProductsPage() {
  const { data: prods, error, mutate, isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const handleArchive = async (id: string) => {
    if (confirm("Arsip produk ini?")) {
      // Optimistic update
      mutate(prods?.filter(p => p.id !== id), false);
      await updateDoc(doc(db, "products", id), { isArchived: true });
      mutate(); // Sync with server
    }
  };

  const filteredProds = prods?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Manajemen Stok</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Inventaris Produk Dicky Putra Gorden</p>
        </div>
        <Link 
          href="/dashboard/products/add"
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          TAMBAH STOK
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold transition-all focus:border-slate-900"
            />
          </div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            Total {filteredProds.length} Items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Produk</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Kategori</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Harga</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={4} className="p-6"><div className="h-10 bg-slate-50 rounded-xl animate-pulse"></div></td></tr>
                ))
              ) : filteredProds.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Tidak ada data</td></tr>
              ) : (
                filteredProds.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 text-xs truncate uppercase tracking-tight">{p.name}</span>
                          <span className="text-[8px] font-bold text-slate-300 tracking-widest mt-1 sm:hidden uppercase">{p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">{formatIDR(p.price)}</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">/ {p.unit}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end items-center gap-1">
                        <button onClick={() => handleArchive(p.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors" title="Arsip">
                          <Archive className="w-4 h-4" />
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
