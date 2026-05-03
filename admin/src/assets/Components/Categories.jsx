import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  X,
  LayoutGrid,
  Package,
  Wrench,
  Activity,
  Droplets,
  Home,
  MoreVertical,
  Layers,
  ChevronRight,
  CheckCircle2,
  Download
} from "lucide-react";

export default function Categories({ searchQuery: globalSearchQuery = "" }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconIndex: 0
  });

  const availableIcons = [Wrench, Droplets, Activity, Package, Home];
  const availableColors = [
    "bg-blue-100 text-blue-600", 
    "bg-emerald-100 text-emerald-600", 
    "bg-cyan-100 text-cyan-600", 
    "bg-orange-100 text-orange-600", 
    "bg-purple-100 text-purple-600"
  ];

  const [categoryData, setCategoryData] = useState([
    {
      id: 1,
      name: "Construction Materials",
      icon: <Home size={20} />,
      productCount: 45,
      status: "Active",
      description: "Basic building materials like cement, sand, and gravel.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      name: "Hand & Power Tools",
      icon: <Wrench size={20} />,
      productCount: 28,
      status: "Active",
      description: "Manual and electric tools for construction and DIY.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 3,
      name: "Plumbing Supplies",
      icon: <Droplets size={20} />,
      productCount: 15,
      status: "Active",
      description: "Pipes, fittings, and bathroom fixtures.",
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      id: 4,
      name: "Electrical & Lighting",
      icon: <Activity size={20} />,
      productCount: 22,
      status: "Active",
      description: "Wiring, switches, bulbs, and electrical components.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: 5,
      name: "Paints & Finishings",
      icon: <Package size={20} />,
      productCount: 10,
      status: "Inactive",
      description: "Interior and exterior paints, varnishes, and brushes.",
      color: "bg-purple-100 text-purple-600"
    }
  ]);

  const filteredCategories = categoryData.filter(cat => {
    const matchesLocal = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGlobal = globalSearchQuery ? cat.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) : true;
    return matchesLocal && matchesGlobal;
  });

  const handleUpdateStatusClick = (category) => {
    setSelectedCategory(category);
    setShowStatusModal(true);
  };

  const handleExport = () => {
    const headers = ['ID', 'Category Name', 'Product Count', 'Status', 'Description'];
    const csvContent = [
        headers.join(','),
        ...filteredCategories.map(cat => 
            [cat.id, `"${cat.name}"`, cat.productCount, cat.status, `"${cat.description}"`].join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'categories_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveStatus = (newStatus) => {
    setCategoryData(categoryData.map(c => c.id === selectedCategory.id ? { ...c, status: newStatus } : c));
    setShowStatusModal(false);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      iconIndex: 0
    });
    setShowAddModal(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    let iconIndex = 0;
    // Basic heuristic to find icon index (not perfect since icons are React elements)
    if (category.name.includes("Tool")) iconIndex = 0;
    else if (category.name.includes("Plumb")) iconIndex = 1;
    else if (category.name.includes("Electric")) iconIndex = 2;
    else if (category.name.includes("Paint")) iconIndex = 3;
    else if (category.name.includes("Construction")) iconIndex = 4;

    setFormData({
      name: category.name,
      description: category.description,
      iconIndex: iconIndex
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategoryData(categoryData.filter(c => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please enter a category name.");
      return;
    }

    const SelectedIcon = availableIcons[formData.iconIndex];
    const color = availableColors[formData.iconIndex % availableColors.length];

    if (editingCategory) {
      setCategoryData(categoryData.map(c => c.id === editingCategory.id ? { 
        ...c, 
        name: formData.name,
        description: formData.description,
        icon: <SelectedIcon size={20} />,
        color: color
      } : c));
    } else {
      const newCategory = {
        id: Math.max(0, ...categoryData.map(c => c.id)) + 1,
        name: formData.name,
        description: formData.description,
        icon: <SelectedIcon size={20} />,
        productCount: 0,
        status: "Active",
        color: color
      };
      setCategoryData([...categoryData, newCategory]);
    }
    
    setShowAddModal(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Categories</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Organize your inventory with custom categories and descriptions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all focus:ring-2 focus:ring-slate-200 active:scale-95"
          >
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={openAddModal}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            Add New Category
          </button>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Categories</p>
          <h3 className="text-2xl font-black text-slate-900">{categoryData.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Categories</p>
          <h3 className="text-2xl font-black text-emerald-600">{categoryData.filter(c => c.status === "Active").length}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Top Category</p>
          <h3 className="text-xl font-black text-slate-900 truncate">Construction</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Products Assigned</p>
          <h3 className="text-2xl font-black text-indigo-600">{categoryData.reduce((acc, curr) => acc + curr.productCount, 0)}</h3>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search categories..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
          <LayoutGrid size={18} />
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-slate-500 text-[11px] font-black tracking-widest uppercase">
                <th className="px-6 py-5">Category Name</th>
                <th className="px-6 py-5">Summary / Description</th>
                <th className="px-6 py-5">Products</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        {category.icon}
                      </div>
                      <div className="font-bold text-slate-900 text-sm whitespace-nowrap">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-xs font-medium max-w-[200px] truncate lg:max-w-md lg:whitespace-normal">
                    {category.description}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-indigo-500" />
                      <span className="font-black text-slate-800 text-sm">{category.productCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span 
                      onClick={() => handleUpdateStatusClick(category)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-opacity ${
                      category.status === "Active" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-slate-100 text-slate-400 border-slate-200"
                    }`}
                      title="Click to update status"
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(category)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-[#6366F1] p-2 rounded-lg text-white">
                  <Activity size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-lg">Update Status</h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 font-medium mb-1">Editing status for category:</p>
              <p className="text-lg font-black text-indigo-600 mb-6">{selectedCategory.name}</p>

              <div className="space-y-3">
                {['Active', 'Inactive'].map(status => (
                  <button
                    key={status}
                    onClick={() => saveStatus(status)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${selectedCategory.status === status
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {status}
                    {selectedCategory.status === status && <CheckCircle2 size={18} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-0 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{editingCategory ? "Edit Category" : "New Category"}</h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">{editingCategory ? "Update category details" : "Define a group for your products"}</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none" 
                  placeholder="e.g. Plumbing Supplies" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none" 
                  placeholder="Briefly describe what goes into this category..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Assigned Icon</label>
                <div className="grid grid-cols-5 gap-3">
                  {availableIcons.map((Icon, i) => (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => setFormData({...formData, iconIndex: i})}
                      className={`p-4 flex items-center justify-center rounded-2xl border-2 transition-all ${formData.iconIndex === i ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-600/10" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"}`}
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-[#6366F1] text-white font-black rounded-2xl shadow-xl shadow-indigo-500/30 hover:bg-[#4F46E5] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 text-xl mb-2">Delete Category</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Are you sure you want to delete <strong className="text-slate-700">{categoryToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
