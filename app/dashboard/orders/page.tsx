"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { formatIDR } from "@/lib/utils";

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); // For the relational dropdown
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const prodSnap = await getDocs(collection(db, "products"));
      setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const orderSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
      setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedProdId = formData.get("productId") as string;
    const product = products.find((p: any) => p.id === selectedProdId) as any;

    setLoading(true);
    await addDoc(collection(db, "orders"), {
      buyerName: formData.get("buyerName"),
      phoneNumber: formData.get("phone"),
      address: formData.get("address"),
      productId: selectedProdId,
      // SNAPSHOT: Saving details here prevents broken history if product is deleted
      productSnapshot: {
        name: product.name,
        priceAtPurchase: product.price
      },
      totalPrice: product.price * Number(formData.get("qty")),
      createdAt: serverTimestamp(),
    });
    setLoading(false);
    location.reload(); // Refresh to show new order
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Pesanan</h1>
      
      <form onSubmit={handleCreateOrder} className="bg-white p-4 border rounded-lg mb-8 grid grid-cols-2 gap-4">
        <input name="buyerName" placeholder="Nama Pembeli" className="border p-2 rounded" required />
        <input name="phone" placeholder="Nomor HP (+62)" className="border p-2 rounded" required />
        <select name="productId" className="border p-2 rounded" required>
          <option value="">Pilih Produk dari Stok...</option>
          {products.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name} - {formatIDR(p.price)}</option>
          ))}
        </select>
        <input name="qty" type="number" placeholder="Jumlah (Qty)" className="border p-2 rounded" defaultValue={1} />
        <textarea name="address" placeholder="Alamat Lengkap" className="border p-2 rounded col-span-2" />
        <button disabled={loading} className="bg-green-600 text-white p-2 rounded col-span-2 hover:bg-green-700">
          {loading ? "Memproses..." : "Simpan Pesanan"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Pembeli</th>
              <th className="p-3">Produk</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 text-sm">{o.createdAt?.toDate().toLocaleDateString('id-ID')}</td>
                <td className="p-3 font-medium">{o.buyerName}</td>
                <td className="p-3">{o.productSnapshot?.name}</td>
                <td className="p-3 text-green-700 font-bold">{formatIDR(o.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
