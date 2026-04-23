"use client";
import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { formatIDR } from "@/lib/utils";

export default function Products() {
  const [prods, setProds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProds = async () => {
    const q = query(collection(db, "products"), where("isArchived", "==", false));
    const snap = await getDocs(q);
    setProds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchProds(); }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const file = form.image.files[0];

    try {
      const sRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);

      await addDoc(collection(db, "products"), {
        name: form.name.value,
        category: form.category.value,
        price: Number(form.price.value),
        unit: form.unit.value,
        imageUrl: url,
        isArchived: false
      });
      form.reset();
      fetchProds();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border grid grid-cols-4 gap-4 shadow-sm">
        <input name="name" placeholder="Nama Produk" className="border p-2 rounded" required />
        <select name="category" className="border p-2 rounded">
          <option>Blackout</option>
          <option>Vitrase</option>
          <option>Roller Blind</option>
        </select>
        <input name="price" type="number" placeholder="Harga" className="border p-2 rounded" required />
        <input name="unit" placeholder="Unit (e.g Meter)" className="border p-2 rounded" required />
        <input name="image" type="file" className="col-span-3 border p-1 rounded" required />
        <button disabled={loading} className="bg-blue-600 text-white rounded font-medium">{loading ? 'Saving...' : 'Tambah Stok'}</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {prods.map(p => (
          <div key={p.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <img src={p.imageUrl} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-blue-600 font-semibold">{formatIDR(p.price)} / {p.unit}</p>
              <button onClick={async () => {
                if(confirm("Archive product?")) {
                   await updateDoc(doc(db, "products", p.id), { isArchived: true });
                   fetchProds();
                }
              }} className="mt-2 text-xs text-red-500 underline">Archive</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
