"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Search, Filter, X } from "lucide-react";
import { useProjects } from "@/lib/hooks";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { format } from "date-fns";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ProjectStatus = "Planning" | "On Going" | "Finish";

interface Project {
  id?: string;
  projectDate: string;
  pic: string;
  scope: string;
  material: string;
  priceGross: number;
  revenue: number;
  status: ProjectStatus;
}

export default function ProjectPage() {
  const { data: projects, mutate, isLoading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Project>({
    projectDate: format(new Date(), "yyyy-MM-dd"),
    pic: "",
    scope: "",
    material: "",
    priceGross: 0,
    revenue: 0,
    status: "Planning",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateDoc(doc(db, "projects", editingProject.id!), { ...formData });
      } else {
        await addDoc(collection(db, "projects"), { 
          ...formData, 
          createdAt: serverTimestamp() 
        });
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({
        projectDate: format(new Date(), "yyyy-MM-dd"),
        pic: "",
        scope: "",
        material: "",
        priceGross: 0,
        revenue: 0,
        status: "Planning",
      });
      mutate();
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        mutate();
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  const filteredProjects = (projects as Project[] || []).filter(p => 
    p.pic.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.scope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "Planning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "On Going": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Finish": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
          <p className="text-slate-500">Manage your ongoing production and work queue</p>
        </div>
        <button 
          onClick={() => {
            setEditingProject(null);
            setFormData({
              projectDate: format(new Date(), "yyyy-MM-dd"),
              pic: "",
              scope: "",
              material: "",
              priceGross: 0,
              revenue: 0,
              status: "Planning",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by PIC or Scope..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">PIC</th>
                <th className="px-6 py-4">Scope</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Price (Gross)</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading projects...
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{p.projectDate}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{p.pic}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{p.scope}</td>
                    <td className="px-6 py-4 text-slate-600">{p.material}</td>
                    <td className="px-6 py-4 text-slate-600">Rp {p.priceGross?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">Rp {p.revenue?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-1 rounded-full text-[11px] font-bold border uppercase", getStatusColor(p.status))}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setEditingProject(p);
                          setFormData(p);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id!)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">{editingProject ? "Edit Project" : "Add New Project"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Project Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.projectDate}
                    onChange={(e) => setFormData({...formData, projectDate: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">PIC</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.pic}
                    onChange={(e) => setFormData({...formData, pic: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name of PIC"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Scope</label>
                <textarea 
                  required 
                  value={formData.scope}
                  onChange={(e) => setFormData({...formData, scope: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Work description"
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Material</label>
                <input 
                  type="text" 
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Materials used"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Price (Gross)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.priceGross}
                    onChange={(e) => setFormData({...formData, priceGross: Number(e.target.value)})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Revenue</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.revenue}
                    onChange={(e) => setFormData({...formData, revenue: Number(e.target.value)})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as ProjectStatus})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="On Going">On Going</option>
                  <option value="Finish">Finish</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
