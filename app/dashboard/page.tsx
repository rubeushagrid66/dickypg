"use client";
import React from 'react';
import { 
  Instagram, Package, Scissors, CircleDollarSign, TrendingUp, 
  ChevronDown, Calendar as CalendarIcon, Users, Heart, UserPlus, MousePointerClick, PlaySquare, Image as ImageIcon,
  AlertTriangle, CheckCircle2, ChevronRight, Download, Component, ClipboardList, ShoppingCart
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function DashboardPage() {
  const instaData = [
    { date: 'May 14', value: 12000 },
    { date: 'May 15', value: 19000 },
    { date: 'May 16', value: 26000 },
    { date: 'May 17', value: 19000 },
    { date: 'May 18', value: 14000 },
    { date: 'May 19', value: 16000 },
    { date: 'May 20', value: 24000 },
  ];

  const revenueData = [
    { date: 'Apr 21', value: 30000000 },
    { date: 'Apr 28', value: 45000000 },
    { date: 'May 5', value: 65000000 },
    { date: 'May 12', value: 40000000 },
    { date: 'May 19', value: 87500000 },
  ];

  const topPosts = [
    { type: 'Reel', title: 'Elegant Sheer Curtains', date: 'May 18, 2024', views: '42K' },
    { type: 'Reel', title: 'Blackout Curtains Ideas', date: 'May 16, 2024', views: '31K' },
    { type: 'Post', title: 'Minimalist Living Room', date: 'May 14, 2024', views: '12K' },
  ];

  const lowStock = [
    { name: 'Blackout Fabric', qty: '12 m' },
    { name: 'Rail Set', qty: '5 pcs' },
    { name: 'Hook Set', qty: '10 pcs' },
    { name: 'Curtain Ring', qty: '15 pcs' },
  ];

  const formatYAxisK = (tickItem: number) => {
    if (tickItem === 0) return '0';
    return `${tickItem / 1000}K`;
  };

  const formatYAxisM = (tickItem: number) => {
    if (tickItem === 0) return '0';
    return `${tickItem / 1000000}M`;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* Date Picker Header */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          <CalendarIcon className="w-4 h-4 text-slate-500" />
          May 20 – May 26, 2024
          <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
        </button>
      </div>

      {/* Top 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Instagram Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Instagram Followers</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">24,500</h3>
                <div className="flex items-center gap-1 mt-2 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">4.2%</span>
                  <span className="text-slate-400 font-normal">vs last 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Stock Available</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">1,280</h3>
                  <span className="text-sm font-semibold text-slate-500">pcs</span>
                </div>
                <p className="text-sm font-semibold text-blue-600 mt-2">Ready to sell</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Work Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Ongoing Work</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">32</h3>
                  <span className="text-sm font-semibold text-slate-500">Orders</span>
                </div>
                <p className="text-sm font-semibold text-blue-600 mt-2">In production</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0">
                <CircleDollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Revenue (This Month)</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">Rp 87.5 M</h3>
                <div className="flex items-center gap-1 mt-2 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">15.6%</span>
                  <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Instagram Performance & Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">Instagram Performance</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Connected
              </span>
              <span className="text-sm font-medium text-slate-500">@curtain.studio</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Last 7 Days
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Reach</p>
                <p className="text-xl font-bold text-slate-900 mt-1">125K</p>
              </div>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Engagement Rate</p>
                <p className="text-xl font-bold text-slate-900 mt-1">5.8%</p>
              </div>
              <Heart className="w-5 h-5 text-blue-500" />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Profile Visits</p>
                <p className="text-xl font-bold text-slate-900 mt-1">3,500</p>
              </div>
              <UserPlus className="w-5 h-5 text-blue-500" />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Website Clicks</p>
                <p className="text-xl font-bold text-slate-900 mt-1">980</p>
              </div>
              <MousePointerClick className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={instaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={formatYAxisK}
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Top Performing Posts</h2>
            <button className="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              View All
            </button>
          </div>
          
          <div className="flex-1 space-y-4 flex flex-col">
            {topPosts.map((post, idx) => (
              <div key={idx} className="flex items-center gap-4 flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-20 h-16 bg-slate-200 rounded-lg overflow-hidden relative shrink-0">
                  <div className="absolute inset-0 bg-slate-800/10"></div>
                  <div className="absolute bottom-1 left-1 bg-black/50 p-1 rounded backdrop-blur-sm">
                    {post.type === 'Reel' ? <PlaySquare className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{post.type}</span>
                    <span className="text-sm font-semibold text-slate-900 truncate">{post.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{post.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-slate-900">{post.views}</p>
                  <p className="text-xs text-slate-500 font-medium">Views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Stock, Alerts, Ongoing Work */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stock Availability */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">Stock Availability</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Ready Stock
                </span>
                <span className="text-sm font-bold text-slate-900">1,280 <span className="text-slate-400 font-medium text-xs">pcs</span></span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  Reserved Stock
                </span>
                <span className="text-sm font-bold text-slate-900">450 <span className="text-slate-400 font-medium text-xs">pcs</span></span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <Component className="w-4 h-4 text-blue-500" />
                  Material Stock
                </span>
                <span className="text-sm font-bold text-slate-900">82%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1e40af] rounded-full" style={{ width: '82%' }}></div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-xs font-bold text-slate-900">82%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-lg font-bold text-slate-900">Low Stock Alert</h2>
            </div>
            <button className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors">
              View All
            </button>
          </div>
          
          <div className="flex-1 space-y-4">
            {lowStock.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-red-600">{item.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ongoing Work */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Ongoing Work</h2>
            </div>
            <button className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              View All Orders
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {/* Queue Col */}
            <div className="min-w-[140px] snap-center">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-3">
                <span className="text-xs font-bold text-slate-600">Queue</span>
                <span className="text-xs font-bold text-slate-900">5</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1387</p>
                  <p className="text-xs font-semibold text-slate-900">Sarah A.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 22</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1388</p>
                  <p className="text-xs font-semibold text-slate-900">David H.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 22</p>
                </div>
                <p className="text-xs text-center text-slate-400 font-semibold">+3 more</p>
              </div>
            </div>

            {/* Measuring Col */}
            <div className="min-w-[140px] snap-center">
              <div className="flex justify-between items-center bg-orange-50 border border-orange-100 rounded-lg p-2.5 mb-3">
                <span className="text-xs font-bold text-orange-700">Measuring</span>
                <span className="text-xs font-bold text-orange-900">8</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1385</p>
                  <p className="text-xs font-semibold text-slate-900">Michael T.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 21</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1386</p>
                  <p className="text-xs font-semibold text-slate-900">Anna L.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 21</p>
                </div>
                <p className="text-xs text-center text-slate-400 font-semibold">+6 more</p>
              </div>
            </div>

            {/* Sewing Col */}
            <div className="min-w-[140px] snap-center">
              <div className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-lg p-2.5 mb-3">
                <span className="text-xs font-bold text-blue-700">Sewing</span>
                <span className="text-xs font-bold text-blue-900">9</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1382</p>
                  <p className="text-xs font-semibold text-slate-900">Emily R.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 20</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1383</p>
                  <p className="text-xs font-semibold text-slate-900">James P.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 20</p>
                </div>
                <p className="text-xs text-center text-slate-400 font-semibold">+7 more</p>
              </div>
            </div>

            {/* Installation Col */}
            <div className="min-w-[140px] snap-center">
              <div className="flex justify-between items-center bg-purple-50 border border-purple-100 rounded-lg p-2.5 mb-3">
                <span className="text-xs font-bold text-purple-700">Installation</span>
                <span className="text-xs font-bold text-purple-900">4</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1378</p>
                  <p className="text-xs font-semibold text-slate-900">Rina W.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 19</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1379</p>
                  <p className="text-xs font-semibold text-slate-900">Budi K.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 19</p>
                </div>
                <p className="text-xs text-center text-slate-400 font-semibold">+2 more</p>
              </div>
            </div>

            {/* Completed Col */}
            <div className="min-w-[140px] snap-center">
              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 mb-3">
                <span className="text-xs font-bold text-emerald-700">Completed</span>
                <span className="text-xs font-bold text-emerald-900">17</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1375</p>
                  <p className="text-xs font-semibold text-slate-900">Lina M.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 18</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-bold text-blue-600 mb-1">#ORD-1376</p>
                  <p className="text-xs font-semibold text-slate-900">Tommy S.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">May 18</p>
                </div>
                <p className="text-xs text-center text-emerald-500 font-semibold">+15 more</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Row 4: Revenue Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Revenue Overview</h2>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-md transition-colors">7D</button>
              <button className="px-3 py-1 text-xs font-bold bg-white text-blue-600 shadow-sm rounded-md transition-colors border border-slate-200">30D</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-md transition-colors">3M</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-md transition-colors">6M</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-md transition-colors">1Y</button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Revenue (This Month)</p>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Rp 87.5 M</h3>
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">15.6%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>

          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={formatYAxisM}
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:w-64 flex flex-col gap-6 lg:border-l lg:border-slate-100 lg:pl-8 justify-center">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shrink-0">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Orders</p>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">156</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shrink-0">
              <CircleDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Average Order Value</p>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">Rp 560K</h4>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm mt-4">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

    </div>
  );
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
