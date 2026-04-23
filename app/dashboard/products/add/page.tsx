"use client";
import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Save, Upload, Package, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
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

      setMessage("Produk berhasil ditambahkan!");
      setTimeout(() => router.push("/dashboard/products"), 2000);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/products"
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">TAMBAH STOK BARU</h1>
          <p className="text-slate-500 font-medium text-sm">Lengkapi formulir di bawah untuk menambah item baru ke inventaris.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 sm:p-10 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest block">Informasi Produk</label>
              <input 
                name="name" 
                placeholder="Nama Produk (Contoh: Gorden Blackout Emboss)" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900" 
                required 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select 
                  name="category" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900 appearance-none"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option>Blackout</option>
                  <option>Vitrase</option>
                  <option>Roller Blind</option>
                  <option>Aksesoris</option>
                </select>
                <input 
                  name="unit" 
                  placeholder="Unit (Meter, Set, PCS)" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest block text-emerald-600">Informasi Harga</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 font-bold">
                  Rp
                </div>
                <input 
                  name="price" 
                  type="number" 
                  placeholder="Harga per unit" 
                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-slate-900" 
                  required 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <Package className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Validasi Stok Otomatis</h3>
                <p className="text-slate-400 text-xs font-medium">Sistem akan secara otomatis menyinkronkan data stok baru ini ke seluruh panel dashboard admin.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image Upload */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-6">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest block">Foto Produk</label>
            <div 
              className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden group ${preview ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400 bg-slate-50'}`}
            >
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setPreview(null)} className="bg-white text-slate-900 p-2 rounded-xl font-bold text-xs">Hapus & Ganti</button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm inline-block">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Klik atau tarik foto ke sini</p>
                  <input 
                    name="image" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    required 
                  />
                </div>
              )}
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-blue-700 font-bold leading-relaxed">Gunakan foto berkualitas tinggi (JPG/PNG) dengan ukuran maksimal 2MB untuk tampilan terbaik.</p>
            </div>
          </div>

          <div className="space-y-4">
            {message && (
              <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase">{message}</span>
              </div>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3"
            >
              <Save className="w-6 h-6" />
              {loading ? 'MENYIMPAN...' : 'SIMPAN PRODUK'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
