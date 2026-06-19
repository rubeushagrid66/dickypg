"use client";

import { useProjects } from "@/lib/hooks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Loader2, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function RevenuePage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Calculating revenue data...</p>
        </div>
      </div>
    );
  }

  const projectData = (projects as any[]) || [];
  
  // Aggregate revenue by month
  const monthlyData = projectData.reduce((acc: any, project) => {
    if (!project.projectDate) return acc;
    const date = parseISO(project.projectDate);
    const month = format(date, "MMM");
    acc[month] = (acc[month] || 0) + (project.revenue || 0);
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, value]) => ({
    month,
    revenue: value,
  }));

  const totalRevenue = projectData.reduce((acc, p) => acc + (p.revenue || 0), 0);
  const avgRevenue = projectData.length ? totalRevenue / projectData.length : 0;
  const bestMonth = chartData.length 
    ? chartData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current).month 
    : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Revenue Analytics</h1>
        <p className="text-slate-500">Financial overview of your projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">Rp {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Average per Project</p>
              <p className="text-2xl font-bold text-slate-900">Rp {Math.round(avgRevenue).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Best Month</p>
              <p className="text-2xl font-bold text-slate-900">{bestMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-6">Monthly Revenue Growth</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `Rp ${value / 1000}k`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar 
                dataKey="revenue" 
                fill="#2563eb" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
