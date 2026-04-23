"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("Dicky Putra Gorden");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1. Hardcoded fallback (temporary)
      if (username === "admin" && password === "dickypg") {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
        return;
      }

      // 2. Firestore check
      const q = query(
        collection(db, "admins"), 
        where("username", "==", username),
        where("password", "==", password)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError("Username atau Password salah!");
      }
    } catch (err) {
      setError("Gagal menghubungi server.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-2">
            <ShieldCheck className="w-6 h-6 text-slate-900" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
            Internal Access Only
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-sm border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input
                  type="text"
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm font-medium"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-tight">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.1em] hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
            >
              {submitting ? "Memproses..." : "Masuk Dashboard"}
            </button>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-[9px] text-slate-300 font-bold tracking-[0.3em] uppercase">
            Laniakea Digital Environment
          </p>
        </div>
      </div>
    </div>
  );
}
