import { useState } from "react";
import {
  Search,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  History,
  Filter,
  Package,
  ArrowRight
} from "lucide-react";

export default function Inventory({ searchQuery: globalSearchQuery = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Cement",
    stock: "",
    minStock: "",
    location: ""
  });

  const [inventoryData, setInventoryData] = useState([
    { id: 1, name: "Premium Portland Cement", sku: "MX-CEM-001", category: "Cement", stock: 120, minStock: 50, location: "Aisle 4", lastUpdated: "2026-05-01" },
    { id: 2, name: "Galvanized Nails (2 inch)", sku: "MX-NAI-042", category: "Hardware", stock: 15, minStock: 100, location: "Bin 12", lastUpdated: "2026-04-30" },
    { id: 3, name: "Heavy Duty Hammer", sku: "MX-TOO-089", category: "Tools", stock: 0, minStock: 20, location: "Shelf B2", lastUpdated: "2026-04-28" },
    { id: 4, name: "PVC Pipe 1/2 inch", sku: "MX-PLU-112", category: "Plumbing", stock: 245, minStock: 100, location: "Aisle 8", lastUpdated: "2026-05-02" },
    { id: 5, name: "Electrical Wire #14", sku: "MX-ELE-205", category: "Electrical", stock: 18, minStock: 40, location: "Shelf D1", lastUpdated: "2026-04-25" },
    { id: 6, name: "Steel Rebar 10mm", sku: "MX-CON-005", category: "Construction", stock: 85, minStock: 50, location: "Yard B", lastUpdated: "2026-05-01" }
  ]);

  const getStatus = (stock, minStock) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600 bg-red-50 border-red-100", icon: <XCircle size={12} /> };
    if (stock < minStock) return { label: "Low Stock", color: "text-orange-600 bg-orange-50 border-orange-100", icon: <AlertTriangle size={12} /> };
    return { label: "In Stock", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={12} /> };
  };

  const filteredInventory = inventoryData.filter(item => {
    const matchesLocal = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGlobal = globalSearchQuery ? (item.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || item.sku.toLowerCase().includes(globalSearchQuery.toLowerCase())) : true;

    const status = getStatus(item.stock, item.minStock).label;
    const matchesStatus = filterStatus === "All" || status === filterStatus;

    return matchesLocal && matchesGlobal && matchesStatus;
  });

  const handleRestock = (product) => {
    setSelectedProduct(product);
    setRestockAmount("");
    setShowRestockModal(true);
  };

  const confirmRestock = () => {
    if (!restockAmount || isNaN(restockAmount)) return;
    setInventoryData(inventoryData.map(item =>
      item.id === selectedProduct.id
        ? { ...item, stock: item.stock + parseInt(restockAmount), lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
    setShowRestockModal(false);
  };

  const handleHistory = (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      sku: `MX-${Math.random().toString(36).substr(2, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      category: "Cement",
      stock: "",
      minStock: "",
      location: ""
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Math.max(0, ...inventoryData.map(i => i.id)) + 1,
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (editingItem) {
      setInventoryData(inventoryData.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setInventoryData([...inventoryData, newItem]);
    }
    setShowAddModal(false);
  };

  const handleExport = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Stock Level', 'Min Stock', 'Location', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...filteredInventory.map(item =>
        [`"${item.sku}"`, `"${item.name}"`, `"${item.category}"`, item.stock, item.minStock, `"${item.location}"`, item.lastUpdated].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventory_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 font-medium mt-1">Track stock levels, SKUs, and warehouse locations across your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all active:scale-95"
          >
            <Download size={18} />
            Export Report
          </button>
          <button
            onClick={openAddModal}
            className="bg-[#106A42] hover:bg-[#0b482b] text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            Update Inventory
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total SKU</p>
            <h3 className="text-2xl font-black text-slate-900">{inventoryData.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Healthy Stock</p>
            <h3 className="text-2xl font-black text-slate-900">{inventoryData.filter(i => i.stock >= i.minStock).length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Low Stock</p>
            <h3 className="text-2xl font-black text-slate-900">{inventoryData.filter(i => i.stock > 0 && i.stock < i.minStock).length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-xl text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Out of Stock</p>
            <h3 className="text-2xl font-black text-slate-900">{inventoryData.filter(i => i.stock === 0).length}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU or Item Name..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/10 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-green-500/10 outline-none"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200/50">
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Product SKU</th>
                <th className="px-8 py-5">Product Name</th>
                <th className="px-8 py-5 text-center">Stock Level</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const status = getStatus(item.stock, item.minStock);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <span className="font-bold text-[#106A42] text-xs px-3 py-1 bg-green-50 rounded-lg border border-green-100/50">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">{item.category}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-1.5 w-32 mx-auto">
                        <span className="text-sm font-black text-slate-900">{item.stock} Units</span>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${item.stock === 0 ? "bg-red-500" :
                              item.stock < item.minStock ? "bg-orange-500" : "bg-emerald-500"
                              }`}
                            style={{ width: `${Math.min(100, (item.stock / (item.minStock * 2)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`flex items-center gap-1.5 font-black text-[10px] px-3 py-1 rounded-full border w-fit uppercase tracking-wider ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        {item.location}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRestock(item)}
                          className="bg-white border border-slate-200 text-[#106A42] hover:bg-green-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => handleHistory(item)}
                          className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                          <History size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight">Restock Inventory</h3>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Update stock levels for your items</p>
              </div>
              <button onClick={() => setShowRestockModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <XCircle size={24} className="text-slate-300" />
              </button>
            </div>
            <div className="p-8">
              <div className="bg-green-50 p-6 rounded-3xl border border-green-100 mb-8 flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-[#106A42]">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#106A42] uppercase tracking-widest mb-0.5">Selected Item</p>
                  <p className="text-lg font-black text-slate-900">{selectedProduct.name}</p>
                  <p className="text-xs font-bold text-slate-500">Current: {selectedProduct.stock} Units</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Restock Amount</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-black focus:ring-4 focus:ring-green-500/10 focus:border-[#106A42] transition-all outline-none"
                      placeholder="0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-400 uppercase text-xs tracking-widest">Units</div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowRestockModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRestock}
                    className="flex-1 py-4 bg-[#106A42] text-white font-black rounded-2xl shadow-xl shadow-green-900/20 hover:bg-[#0b482b] transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Confirm Restock
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight">{editingItem ? "Edit Inventory Item" : "Add to Inventory"}</h3>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Fill in the technical details below</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <XCircle size={24} className="text-slate-300" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#106A42] outline-none transition-all"
                    placeholder="e.g. Premium Portland Cement"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#106A42] outline-none transition-all"
                    placeholder="MX-XXX-000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#106A42] outline-none transition-all"
                  >
                    <option>Cement</option>
                    <option>Hardware</option>
                    <option>Tools</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Construction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#106A42] outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Min. Stock Level</label>
                  <input
                    type="number"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#106A42] outline-none transition-all"
                    placeholder="Reorder point"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Warehouse Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#106A42] outline-none transition-all"
                    placeholder="e.g. Aisle 4, Shelf B"
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
                  className="flex-1 py-4 bg-[#106A42] text-white font-black rounded-2xl shadow-xl shadow-green-900/20 hover:bg-[#0b482b] transition-all active:scale-95"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight">Stock History</h3>
                <p className="text-slate-500 text-sm font-medium mt-0.5">{selectedProduct.name}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <XCircle size={24} className="text-slate-300" />
              </button>
            </div>
            <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                <div className="flex gap-4 relative">
                  <div className="w-9 h-9 bg-emerald-500 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center text-white">
                    <TrendingUp size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Stock Updated</p>
                    <p className="text-xs text-slate-500 font-medium">Automatic system adjustment</p>
                    <p className="text-[10px] text-[#106A42] font-black mt-1 uppercase tracking-widest">{selectedProduct.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex gap-4 relative opacity-60">
                  <div className="w-9 h-9 bg-blue-500 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center text-white">
                    <History size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Initial Registry</p>
                    <p className="text-xs text-slate-500 font-medium">Item added to main database</p>
                    <p className="text-[10px] text-blue-600 font-black mt-1 uppercase tracking-widest">2026-04-01</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
