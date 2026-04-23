export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ringkasan Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Total Stok</p>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Pesanan Hari Ini</p>
          <p className="text-2xl font-bold">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-green-600">Rp 12.500.000</p>
        </div>
      </div>
    </div>
  );
}
