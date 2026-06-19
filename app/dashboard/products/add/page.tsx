"use client";
import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Save, Upload, Package, Info, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProducts } from "@/lib/hooks";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const router = useRouter();
  const { mutate } = useProducts();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snap = await getDocs(collection(db, "categories"));
      const cats = snap.docs.map(d => ({ id: d.id, name: d.data().name as string }));
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Kategori sudah ada.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "categories"), { name: trimmed });
      setCategories(prev => [...prev, { id: docRef.id, name: trimmed }]);
      setNewCategory("");
      setShowAddCategory(false);
      toast.success(`Kategori "${trimmed}" ditambahkan.`);
    } catch (err) {
      toast.error("Gagal menambahkan kategori.");
    }
  };

  const handleRemoveCategory = async (cat: { id: string; name: string }) => {
    try {
      await deleteDoc(doc(db, "categories", cat.id));
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      toast.success(`Kategori "${cat.name}" dihapus.`);
    } catch (err) {
      toast.error("Gagal menghapus kategori.");
    }
  };

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
            <div className="space-y-5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Informasi Produk</label>
              
              {/* Nama Produk */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama Produk</label>
                <input name="name" placeholder="Masukkan nama produk" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
              </div>

              {/* Kategori Produk */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kategori Produk</label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="text-[9px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Tambah
                  </button>
                </div>

                {showAddCategory && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                      placeholder="Nama kategori baru"
                      className="flex-1 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg outline-none font-bold text-xs focus:border-blue-400 transition-colors"
                      autoFocus
                    />
                    <button type="button" onClick={handleAddCategory} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-[10px] font-bold hover:bg-blue-600 transition-colors">
                      Simpan
                    </button>
                    <button type="button" onClick={() => { setShowAddCategory(false); setNewCategory(""); }} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors">
                      Batal
                    </button>
                  </div>
                )}

                <select name="category" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs appearance-none" required>
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {categories.map((cat) => (
                      <span key={cat.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold group">
                        {cat.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(cat)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                          title={`Hapus ${cat.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Satuan */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Satuan</label>
                <input name="unit" placeholder="Contoh: Meter, Set, Pcs" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" required />
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
                  <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
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
