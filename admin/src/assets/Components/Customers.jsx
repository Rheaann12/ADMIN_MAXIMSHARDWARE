import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  UserPlus,
  ShoppingBag,
  CircleDollarSign,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronRight as BreadcrumbArrow,
  X,
  CheckCircle2
} from "lucide-react";

export default function Customers({ searchQuery: globalSearchQuery = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: ""
  });

  const [customersData, setCustomersData] = useState([
    {
      id: "CUS-001",
      name: "Juan Dela Cruz",
      contact: "0912 345 6789",
      email: "juan.delacruz@email.com",
      address: "Purok 2, Paz Village, Gingoog City",
      orders: 12,
      spent: 3500,
      status: "Active"
    },
    {
      id: "CUS-002",
      name: "Maria Santos",
      contact: "0923 456 7890",
      email: "maria.santos@email.com",
      address: "Barangay 24-A, Paz Village, Gingoog City",
      orders: 8,
      spent: 2100,
      status: "Active"
    },
    {
      id: "CUS-003",
      name: "Pedro Reyes",
      contact: "0931 234 5678",
      email: "pedro.reyes@email.com",
      address: "Purok 5, Gingoog City",
      orders: 6,
      spent: 1800,
      status: "Active"
    },
    {
      id: "CUS-004",
      name: "Ana Lopez",
      contact: "0945 678 9012",
      email: "ana.lopez@email.com",
      address: "Barangay 20, Gingoog City",
      orders: 5,
      spent: 1300,
      status: "Inactive"
    },
    {
      id: "CUS-005",
      name: "Rodel Ramirez",
      contact: "0977 890 1234",
      email: "rodel.ramirez@email.com",
      address: "Purok 1, Gingoog City",
      orders: 4,
      spent: 1000,
      status: "Active"
    }
  ]);

  const handleUpdateStatusClick = (customer) => {
    setSelectedCustomer(customer);
    setShowStatusModal(true);
  };

  const saveStatus = (newStatus) => {
    setCustomersData(customersData.map(c => c.id === selectedCustomer.id ? { ...c, status: newStatus } : c));
    setShowStatusModal(false);
  };

  const filteredCustomers = customersData.filter(customer => {
    const matchesLocal = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGlobal = globalSearchQuery ? (customer.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || customer.id.toLowerCase().includes(globalSearchQuery.toLowerCase())) : true;
    const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
    return matchesLocal && matchesGlobal && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentItems = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: customersData.length,
    new: customersData.length > 5 ? 5 : customersData.length, // Simulated
    orders: customersData.reduce((acc, curr) => acc + curr.orders, 0),
    spent: customersData.reduce((acc, curr) => acc + curr.spent, 0)
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: "", contact: "", email: "", address: "" });
    setShowAddModal(true);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      contact: customer.contact,
      email: customer.email,
      address: customer.address
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomersData(customersData.filter(c => c.id !== customerToDelete.id));
      setCustomerToDelete(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Name is required");
      return;
    }

    if (editingCustomer) {
      setCustomersData(customersData.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c));
    } else {
      const newCustomer = {
        id: `CUS-${String(customersData.length + 1).padStart(3, '0')}`,
        ...formData,
        orders: 0,
        spent: 0,
        status: "Active"
      };
      setCustomersData([newCustomer, ...customersData]);
    }
    setShowAddModal(false);
  };

  const handleExport = () => {
    const headers = ['Customer ID', 'Name', 'Contact Number', 'Email', 'Address', 'Total Orders', 'Total Spent', 'Status'];
    const csvContent = [
        headers.join(','),
        ...filteredCustomers.map(customer => 
            [customer.id, `"${customer.name}"`, `"${customer.contact}"`, `"${customer.email}"`, `"${customer.address}"`, customer.orders, customer.spent, customer.status].join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers_export.csv');
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
          <div className="flex items-center gap-3">
            <div className="bg-[#106A42] p-2 rounded-xl text-white">
              <Users size={28} />
            </div>
            <h1 className="text-3xl font-black text-[#106A42] tracking-tight">Customers</h1>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-2">
            <span>Dashboard</span>
            <BreadcrumbArrow size={14} />
            <span>Customers</span>
          </div>
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
            className="bg-[#146c43] hover:bg-[#105634] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#DCFCE7] text-[#16A34A] p-4 rounded-full">
            <Users size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">Total Customers</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.total}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#DBEAFE] text-[#2563EB] p-4 rounded-full">
            <UserPlus size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">New This Month</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.new}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#FEF9C3] text-[#CA8A04] p-4 rounded-full">
            <ShoppingBag size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">Total Orders</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.orders}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#DCFCE7] text-[#16A34A] p-4 rounded-full">
            <div className="w-7 h-7 flex items-center justify-center font-black text-xl">₱</div>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">Total Spent</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">₱{stats.spent.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Customers List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-[#106A42]">Customers List</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search customers..."
                className="w-full md:w-64 pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-green-500/20"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#146c43]">
              <tr className="text-white text-xs font-bold tracking-wider">
                <th className="px-6 py-4 rounded-tl-lg">Customer ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4 text-center">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{customer.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{customer.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{customer.contact}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-[200px] truncate" title={customer.address}>{customer.address}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 text-center">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-800">₱{customer.spent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      onClick={() => handleUpdateStatusClick(customer)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity border border-transparent shadow-sm inline-flex items-center justify-center ${
                      customer.status === 'Active' 
                        ? 'bg-[#DCFCE7] text-[#16A34A]' 
                        : 'bg-slate-100 text-slate-500'
                    }`}
                      title="Click to update status"
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => handleEditClick(customer)}
                        className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(customer)}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </span>
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm shadow-sm transition-all ${
                  currentPage === i + 1 
                    ? "bg-[#146c43] text-white" 
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-[#106A42] p-2 rounded-lg text-white">
                  <Users size={20} />
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
               <p className="text-sm text-slate-500 font-medium mb-1">Editing status for customer:</p>
               <p className="text-lg font-black text-[#106A42] mb-6">{selectedCustomer.name}</p>
               
               <div className="space-y-3">
                 {['Active', 'Inactive'].map(status => (
                   <button 
                     key={status}
                     onClick={() => saveStatus(status)}
                     className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${
                       selectedCustomer.status === status 
                         ? 'border-[#106A42] bg-green-50 text-[#106A42]' 
                         : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                     }`}
                   >
                     {status}
                     {selectedCustomer.status === status && <CheckCircle2 size={18} className="text-[#106A42]" />}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-0 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{editingCustomer ? "Edit Customer" : "New Customer"}</h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">{editingCustomer ? "Update customer details" : "Add a new customer to your store"}</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none" 
                  placeholder="e.g. Juan Dela Cruz" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Contact Number</label>
                <input 
                  type="text" 
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none" 
                  placeholder="e.g. 0912 345 6789" 
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none" 
                  placeholder="e.g. juan@email.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Address</label>
                <textarea 
                  rows="2" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none" 
                  placeholder="Full Address"
                ></textarea>
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
                  className="flex-1 py-4 bg-[#146c43] text-white font-black rounded-2xl shadow-xl shadow-green-500/30 hover:bg-[#105634] transition-all active:scale-95"
                >
                  {editingCustomer ? "Update Customer" : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 text-xl mb-2">Delete Customer</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Are you sure you want to delete <strong className="text-slate-700">{customerToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setCustomerToDelete(null)}
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
