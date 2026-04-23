"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Save, Globe, Palette, CheckCircle2, RefreshCcw } from "lucide-react";
import { useSiteSettings } from "@/lib/hooks";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: settings, isLoading: fetching, mutate } = useSiteSettings();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState({
    primary: "#0f172a",
    background: "#f8fafc",
    card: "#ffffff"
  });

  useEffect(() => {
    if (settings) {
      setTitle(settings.title || "Dicky Putra Gorden");
      if (settings.theme) setTheme(settings.theme);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "siteConfig"), {
        title: title,
        theme: theme,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
      
      await mutate();
      toast.success("Pengaturan berhasil disimpan!");
    } catch (err) {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setLoading(false);
    }
  };

  const resetTheme = () => {
    setTheme({
      primary: "#0f172a",
      background: "#f8fafc",
      card: "#ffffff"
    });
    toast.info("Pratinjau tema direset ke default.");
  };

  if (fetching) return <div className="flex justify-center p-20"><div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Pengaturan Page</h1>
        <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Konfigurasi identitas dan visual dashboard.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
            <Globe className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Identitas Situs</h2>
          </div>
          <div className="p-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Judul Utama</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none transition-all font-bold text-xs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Kustomisasi Tema</h2>
            </div>
            <button type="button" onClick={resetTheme} className="text-[9px] font-bold text-slate-400 hover:text-slate-900 flex items-center gap-1 transition-colors">
              <RefreshCcw className="w-3 h-3" /> RESET
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Warna Utama</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={theme.primary} 
                  onChange={(e) => setTheme({...theme, primary: e.target.value})}
                  className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{theme.primary}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Warna Background</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={theme.background} 
                  onChange={(e) => setTheme({...theme, background: e.target.value})}
                  className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{theme.background}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Warna Card</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={theme.card} 
                  onChange={(e) => setTheme({...theme, card: e.target.value})}
                  className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{theme.card}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
        >
          <Save className="w-4 h-4" />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
