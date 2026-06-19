"use client";

import { useState, useEffect } from "react";
import { Instagram, ExternalLink, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSiteSettings } from "@/lib/hooks";

export default function InstagramAnalytics() {
  const { data: siteSettings, updateSettings } = useSiteSettings();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToken(siteSettings?.instagramToken || "");
  }, [siteSettings]);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updateSettings({ instagramToken: token });
      // In a real scenario, we would validate the token here via an API call
      setStats({ connected: true });
    } catch (err) {
      setError("Failed to save token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Instagram Analytics</h1>
        <p className="text-slate-500">Track your Instagram growth and engagement</p>
      </div>

      {!stats ? (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Connect Instagram Graph API</h2>
              <p className="text-sm text-slate-500">Enter your Page Access Token to fetch insights</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Instagram Access Token
              </label>
              <input 
                type="password" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                placeholder="EAAG..." 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              onClick={handleConnect}
              disabled={isLoading || !token}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect Account"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-2">How to get a token?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              1. Create a Meta App in the Meta for Developers portal.<br />
              2. Add the Instagram Graph API product.<br />
              3. Generate a User Access Token with <code className="bg-slate-200 px-1 rounded">instagram_basic</code> and <code className="bg-slate-200 px-1 rounded">instagram_manage_insights</code> permissions.
            </p>
            <a 
              href="https://developers.facebook.com/" 
              target="_blank" 
              className="text-xs text-blue-600 hover:underline mt-3 inline-flex items-center gap-1"
            >
              Meta for Developers <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Followers", value: "1,234", change: "+12%", trend: "up" },
            { label: "Reach", value: "12.5K", change: "+5%", trend: "up" },
            { label: "Engagement", value: "3.2%", change: "-0.5%", trend: "down" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                <span className={stat.trend === 'up' ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
          
          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Recent Performance</h3>
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-slate-400 italic text-sm border-2 border-dashed border-slate-100 rounded-xl">
              Charts will be rendered here when API integration is fully implemented.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
