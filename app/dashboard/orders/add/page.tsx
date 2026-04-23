"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Save, ShoppingCart, User, MapPin, Package, CheckCircle2, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatIDR } from "@/lib/utils";

export default function AddOrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } finally {
        setFetching(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const selectedProdId = formData.get("productId") as string;
    const product = products.find((p: any) => p.id === selectedProdId);

    if (!product) {
      alert("Pilih produk terlebih dahulu!");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        buyerName: formData.get("buyerName"),
        phoneNumber: formData.get("phone"),
        address: formData.get("address"),
        productId: selectedProdId,
        productSnapshot: {
          name: product.name,
          priceAtPurchase: product.price
        },
        totalPrice: product.price * Number(formData.get("qty")),
        createdAt: serverTimestamp(),
      });

      setMessage("Pesanan berhasil dibuat!");
      setTimeout(() => router.push("/dashboard/orders"), 2000);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat pesanan.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/orders"
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">BUAT PESANAN BARU</h1>
          <p className="text-slate-500 font-medium text-sm">Input data pelanggan dan produk untuk memproses pesanan baru.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 sm:p-10 space-y-8">
            <div className="flex items-center gap-4 text-slate-900">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase">Informasi Pelanggan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Nama Pembeli</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <input 
                    name="buyerName" 
                    placeholder="Masukkan nama lengkap" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Nomor HP / WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <input 
                    name="phone" 
                    placeholder="+62 812..." 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Alamat Lengkap</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-5 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <textarea 
                    name="address" 
                    rows={3}
                    placeholder="Masukkan alamat pengiriman lengkap..." 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900 resize-none" 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 sm:p-10 space-y-8">
            <div className="flex items-center gap-4 text-slate-900">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase">Detail Produk & Qty</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Pilih Produk dari Stok</label>
                <select 
                  name="productId" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900 appearance-none"
                  required
                >
                  <option value="">Cari Produk...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {formatIDR(p.price)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Jumlah (Qty)</label>
                <input 
                  name="qty" 
                  type="number" 
                  defaultValue={1}
                  min={1}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900" 
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Konfirmasi Pesanan</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight leading-tight">TOTAL PEMBAYARAN OTOMATIS</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Total harga akan dikalkulasi secara otomatis berdasarkan harga produk saat ini dan jumlah pesanan yang diinput.
                </p>
              </div>

              <div className="space-y-4">
                {message && (
                  <div className="flex items-center gap-2 p-4 bg-white/10 text-emerald-400 rounded-2xl border border-white/10 backdrop-blur-md animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">{message}</span>
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-slate-900 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-100 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {loading ? 'MEMPROSES...' : 'BUAT PESANAN'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Package className="w-4 h-4" />
              Prosedur Pesanan
            </h4>
            <ul className="space-y-3">
              {[
                "Input data pelanggan lengkap",
                "Pilih produk dari inventaris",
                "Tentukan kuantitas pesanan",
                "Klik tombol Buat Pesanan"
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs font-medium text-slate-500">
                  <span className="w-5 h-5 shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
