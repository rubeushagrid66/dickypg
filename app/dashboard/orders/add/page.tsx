"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Save, ShoppingCart, User, MapPin, Package, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatIDR } from "@/lib/utils";
import { toast } from "sonner";
import { useOrders } from "@/lib/hooks";

export default function AddOrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const { mutate } = useOrders();

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
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const selectedProdId = formData.get("productId") as string;
    const product = products.find((p: any) => p.id === selectedProdId);

    if (!product) {
      toast.error("Pilih produk terlebih dahulu!");
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

      await mutate();
      toast.success("Pesanan berhasil dibuat!");
      router.push("/dashboard/orders");
    } catch (err) {
      toast.error("Gagal membuat pesanan.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center p-20"><div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/orders"
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Buat Pesanan Baru</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Lengkapi data transaksi.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 text-slate-900 mb-2">
              <User className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-tight">Pelanggan</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="buyerName" placeholder="Nama Pembeli" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
              <input name="phone" placeholder="Nomor HP" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
              <div className="sm:col-span-2">
                <textarea name="address" rows={2} placeholder="Alamat Lengkap" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs resize-none" required />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 text-slate-900 mb-2">
              <Package className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-tight">Produk</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <select name="productId" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs appearance-none" required>
                  <option value="">Pilih Produk...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {formatIDR(p.price)}</option>
                  ))}
                </select>
              </div>
              <input name="qty" type="number" defaultValue={1} min={1} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            {loading ? 'MEMPROSES...' : 'BUAT PESANAN'}
          </button>
          
          <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
              Pastikan data sudah benar. Total harga akan dihitung otomatis saat pesanan disimpan.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
