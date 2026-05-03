import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Filter,
  X,
  Package,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Download
} from "lucide-react";

export default function Product({ searchQuery: globalSearchQuery = "" }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Cement",
    price: "",
    stock: "",
    image: ""
  });
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Portland Cement",
      category: "Cement",
      price: 275,
      stock: 120,
      status: "In Stock",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Galvanized Nails (2 inch)",
      category: "Nails",
      price: 55,
      stock: 15,
      status: "Low Stock",
      image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Heavy Duty Hammer",
      category: "Tools",
      price: 450,
      stock: 0,
      status: "Out of Stock",
      image: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=200&auto=format&fit=crop"
    }
  ]);

  const filteredProducts = products.filter(p => {
    const matchesLocal = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGlobal = globalSearchQuery ? (p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || p.category.toLowerCase().includes(globalSearchQuery.toLowerCase())) : true;
    
    let matchesStatus = true;
    if (statusFilter === "In Stock") {
      matchesStatus = p.status === "In Stock" || p.status === "Low Stock";
    } else if (statusFilter === "Out of Stock") {
      matchesStatus = p.status === "Out of Stock";
    }

    return matchesLocal && matchesGlobal && matchesStatus;
  });

  const handleUpdateStatusClick = (product) => {
    setSelectedProduct(product);
    setShowStatusModal(true);
  };

  const saveStatus = (newStatus) => {
    setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, status: newStatus } : p));
    setShowStatusModal(false);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Please fill out all required fields.");
      return;
    }

    const stockNum = parseInt(formData.stock);
    const calculatedStatus = stockNum === 0 ? "Out of Stock" : stockNum < 20 ? "Low Stock" : "In Stock";

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { 
        ...p, 
        ...formData, 
        price: parseFloat(formData.price),
        stock: stockNum,
        status: calculatedStatus 
      } : p));
    } else {
      const newProduct = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        ...formData,
        price: parseFloat(formData.price),
        stock: stockNum,
        status: calculatedStatus,
        image: formData.image || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop"
      };
      setProducts([...products, newProduct]);
    }
    
    setShowAddModal(false);
    setShowAddModal(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Product Name', 'Category', 'Price', 'Stock', 'Status'];
    const csvContent = [
        headers.join(','),
        ...filteredProducts.map(product => 
            [product.id, `"${product.name}"`, `"${product.category}"`, product.price, product.stock, product.status].join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'products_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Cement",
      price: "",
      stock: "",
      image: ""
    });
    setShowAddModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage your hardware inventory, prices, and stock levels.</p>
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
            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 group"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name, category, or SKU..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-full lg:w-auto">
            <button 
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${statusFilter === "All" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("In Stock")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${statusFilter === "In Stock" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"}`}
            >
              In Stock
            </button>
            <button 
              onClick={() => setStatusFilter("Out of Stock")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${statusFilter === "Out of Stock" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"}`}
            >
              Out of Stock
            </button>
          </div>
          <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-slate-500 text-[11px] font-black tracking-widest uppercase">
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Stock Level</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 group-hover:scale-105 transition-transform">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">SKU: MAX-{1000 + product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200/50">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">
                    ₱{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">{product.stock} Units</span>
                        <span className={product.stock < 20 ? "text-orange-500" : "text-emerald-500"}>
                          {Math.min(100, Math.round((product.stock / 200) * 100))}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            product.stock === 0 ? "bg-red-500" : 
                            product.stock < 20 ? "bg-orange-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.status === "In Stock" && (
                      <span 
                        onClick={() => handleUpdateStatusClick(product)}
                        title="Click to update status"
                        className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100 cursor-pointer hover:opacity-80 transition-opacity">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        In Stock
                      </span>
                    )}
                    {product.status === "Low Stock" && (
                      <span 
                        onClick={() => handleUpdateStatusClick(product)}
                        title="Click to update status"
                        className="flex items-center gap-1.5 text-orange-600 font-bold text-xs bg-orange-50 px-3 py-1 rounded-full w-fit border border-orange-100 cursor-pointer hover:opacity-80 transition-opacity">
                        <AlertCircle size={12} strokeWidth={3} />
                        Low Stock
                      </span>
                    )}
                    {product.status === "Out of Stock" && (
                      <span 
                        onClick={() => handleUpdateStatusClick(product)}
                        title="Click to update status"
                        className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-3 py-1 rounded-full w-fit border border-red-100 cursor-pointer hover:opacity-80 transition-opacity">
                        <X size={12} strokeWidth={3} />
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition-all shadow-sm"
                        title="Edit Product"
                      >
                        <Edit3 size={16} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="p-2.5 bg-white text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-all shadow-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
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
      {showStatusModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-[#10B981] p-2 rounded-lg text-white">
                  <Package size={20} />
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
              <p className="text-sm text-slate-500 font-medium mb-1">Editing status for product:</p>
              <p className="text-lg font-black text-emerald-600 mb-6">{selectedProduct.name}</p>

              <div className="space-y-3">
                {['In Stock', 'Low Stock', 'Out of Stock'].map(status => (
                  <button
                    key={status}
                    onClick={() => saveStatus(status)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${selectedProduct.status === status
                      ? 'border-[#10B981] bg-emerald-50 text-[#10B981]'
                      : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {status}
                    {selectedProduct.status === status && <CheckCircle2 size={18} className="text-[#10B981]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal (Sleek Overlay) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Enter product details below</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    placeholder="e.g. Portland Cement" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    <option>Cement</option>
                    <option>Tools</option>
                    <option>Nails</option>
                    <option>Electrical</option>
                    <option>Plumbing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Price (₱)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    placeholder="0.00" 
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    placeholder="0" 
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Image URL</label>
                  <input 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    placeholder="https://..." 
                  />
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
                  className="flex-1 py-4 bg-[#10B981] text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 hover:bg-[#059669] transition-all active:scale-95"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 text-xl mb-2">Delete Product</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Are you sure you want to delete <strong className="text-slate-700">{productToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
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
