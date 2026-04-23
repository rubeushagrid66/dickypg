"use client";
import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Save, Upload, Package, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProducts } from "@/lib/hooks";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const { mutate } = useProducts();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = (formData.get("image") as File);

    try {
      let imageUrl = "";
      if (file && file.size > 0) {
        const sRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(sRef, file);
        imageUrl = await getDownloadURL(sRef);
      }

      await addDoc(collection(db, "products"), {
        name: formData.get("name"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        unit: formData.get("unit"),
        imageUrl: imageUrl,
        isArchived: false,
        createdAt: new Date().toISOString()
      });

      await mutate();
      toast.success("Produk berhasil ditambahkan!");
      router.push("/dashboard/products");
    } catch (err) {
      toast.error("Gagal menambahkan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/products"
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">TAMBAH STOK BARU</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Lengkapi formulir di bawah.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Informasi Produk</label>
              <input name="name" placeholder="Nama Produk" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
              <div className="grid grid-cols-2 gap-4">
                <select name="category" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs appearance-none" required>
                  <option value="">Pilih Kategori</option>
                  <option>Blackout</option>
                  <option>Vitrase</option>
                  <option>Roller Blind</option>
                  <option>Aksesoris</option>
                </select>
                <input name="unit" placeholder="Unit (Meter, Set)" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Harga</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">Rp</div>
                <input name="price" type="number" placeholder="0" className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Foto Produk</label>
            <div className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden group ${preview ? 'border-slate-900' : 'border-slate-200 bg-slate-50'}`}>
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setPreview(null)} className="bg-white text-black px-3 py-1.5 rounded-lg font-bold text-[10px]">GANTI</button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Upload className="w-5 h-5 text-slate-300 mx-auto" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Klik untuk upload</p>
                  <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'MENYIMPAN...' : 'SIMPAN PRODUK'}
          </button>
        </div>
      </form>
    </div>
  );
}
