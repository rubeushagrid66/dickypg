import { TrendingUp, Package, ShoppingCart, DollarSign, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { name: "Total Stok", value: "1,234", icon: Package, color: "bg-blue-500", trend: "+12% dari bln lalu" },
    { name: "Pesanan Hari Ini", value: "42", icon: ShoppingCart, color: "bg-purple-500", trend: "5 pesanan baru" },
    { name: "Total Pendapatan", value: "Rp 12.5M", icon: DollarSign, color: "bg-emerald-500", trend: "+25% dari bln lalu" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">RINGKASAN DASHBOARD</h1>
        <p className="text-slate-500 font-medium">Selamat datang kembali! Berikut adalah statistik terbaru hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className={`${stat.color} p-4 rounded-2xl shadow-lg shadow-current/20 text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 tracking-tighter uppercase">
                <TrendingUp className="w-3 h-3" />
                Live Update
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</h3>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>

            {/* Decorative element */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden min-h-[300px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-black tracking-widest uppercase">System Status</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-tight max-w-md">
              SEMUA SISTEM BERJALAN OPTIMAL
            </h2>
            <p className="text-slate-400 font-medium max-w-sm">
              Server backend dan database Firestore berfungsi dengan baik. Tidak ada gangguan yang terdeteksi dalam 24 jam terakhir.
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm shadow-xl shadow-white/10">
                Check Detail
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Akses Cepat</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium leading-relaxed">Pintasan untuk manajemen data yang paling sering digunakan.</p>
          </div>
          <div className="space-y-3 mt-8">
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group">
              <span className="font-bold text-slate-700">Tambah Pesanan</span>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-all" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group">
              <span className="font-bold text-slate-700">Update Stok</span>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
