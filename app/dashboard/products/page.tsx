"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { formatIDR } from "@/lib/utils";
import { Plus, Search, Archive, Package, MoreVertical, Filter } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [prods, setProds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProds = async () => {
    try {
      const q = query(collection(db, "products"), where("isArchived", "==", false));
      const snap = await getDocs(q);
      setProds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProds(); }, []);

  const handleArchive = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin mengarsipkan produk ini?")) {
      await updateDoc(doc(db, "products", id), { isArchived: true });
      fetchProds();
    }
  };

  const filteredProds = prods.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">MANAJEMEN STOK</h1>
          <p className="text-slate-500 font-medium text-sm">Kelola inventaris barang dan produk gorden Anda.</p>
        </div>
        <Link 
          href="/dashboard/products/add"
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Tambah Stok Baru
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari nama produk atau kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Info Produk</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga / Unit</th>
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
              ) : filteredProds.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Package className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Produk tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProds.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-tight">{p.name}</p>
                          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-1">ID: {p.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{formatIDR(p.price)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Per {p.unit}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => handleArchive(p.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Arsipkan"
                        >
                          <Archive className="w-5 h-5" />
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
