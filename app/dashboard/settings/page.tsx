"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, Globe, Info, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "siteConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title || "Dicky Putra Gorden");
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await setDoc(doc(db, "settings", "siteConfig"), {
        title: title,
        lastUpdated: new Date().toISOString(),
      });
      setMessage("Pengaturan berhasil disimpan!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Gagal menyimpan pengaturan.");
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">PENGATURAN PAGE</h1>
        <p className="text-slate-500 font-medium">Konfigurasi identitas dan tampilan sistem dashboard.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-slate-800">Identitas Situs</h2>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              Judul Utama (Title)
              <div className="group relative cursor-help">
                <Info className="w-4 h-4 text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Judul ini akan tampil di Halaman Login dan tab browser.
                </div>
              </div>
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-medium text-slate-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Dicky Putra Gorden"
              required
            />
          </div>

          {message && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">{message}</span>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
            >
              <Save className="w-5 h-5" />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative z-10 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Info className="w-5 h-5" />
            Catatan Penting
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Perubahan judul akan langsung berdampak pada halaman utama. Pastikan identitas yang dimasukkan sudah sesuai dengan branding bisnis Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
