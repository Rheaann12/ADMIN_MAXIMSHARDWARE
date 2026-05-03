import { useState } from "react";
import {
  Search,
  Bell,
  Package,
  ClipboardList,
  Truck,
  Users,
  Settings as SettingsIcon,
  LogOut,
  LayoutDashboard,
  Plus,
  Eye,
  Trash2,
  Edit3,
  CheckCircle2,
  ChevronDown,
  X,
  TrendingUp
} from "lucide-react";
import logo from "./maximshardwarelogo.png";
import Product from "./Product";
import SidebarItem from "./Productsidebar";
import Categories from "./Categories";
import Customers from "./Customers";
import Settings from "./Settings";
import Orders from "./Orders";
import Delivery from "./Delivery";
import Inventory from "./Inventory";

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedViewItem, setSelectedViewItem] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [recentOrders, setRecentOrders] = useState([
    { id: '#001', customer: 'Juan Dela Cruz', total: '₱500', status: 'Pending' },
    { id: '#002', customer: 'Maria Santos', total: '₱1,200', status: 'Delivered' }
  ]);

  const [deliveryRequests, setDeliveryRequests] = useState([
    { id: 'DEL-001', customer: 'Juan Dela Cruz', address: 'Gingoog City, Misamis Oriental', status: 'Pending' }
  ]);

  const handleUpdateStatusClick = (item, type) => {
    setSelectedItem({ type, data: item });
    setShowStatusModal(true);
  };

  const saveStatus = (newStatus) => {
    if (selectedItem.type === 'order') {
      setRecentOrders(recentOrders.map(o => o.id === selectedItem.data.id ? { ...o, status: newStatus } : o));
    } else {
      setDeliveryRequests(deliveryRequests.map(d => d.id === selectedItem.data.id ? { ...d, status: newStatus } : d));
    }
    setShowStatusModal(false);
  };

  const handleApproveDelivery = (delivery) => {
    setDeliveryRequests(deliveryRequests.map(d => d.id === delivery.id ? { ...d, status: 'Approved' } : d));
  };

  const handleViewOrder = (order) => {
    setSelectedViewItem(order);
    setShowViewModal(true);
  };

  const filteredRecentOrders = recentOrders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeliveryRequests = deliveryRequests.filter(delivery => 
    delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-[#374151] font-sans overflow-hidden">

      {/* =========================================================
          1. SIDEBAR NAVIGATION (Left Side)
          ========================================================= */}
      <aside className="w-64 bg-[#2C343F] text-white flex flex-col shadow-lg overflow-hidden shrink-0">

        {/* Logo Section */}
        <div className="p-6 pb-2">
          <Logo />
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex-1 space-y-0.5 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={<CheckCircle2 size={20} />} 
            label="Dashboard" 
            active={activeTab === "Dashboard"} 
            onClick={() => setActiveTab("Dashboard")}
          />
          <SidebarItem 
            icon={<Package size={20} />} 
            label="Products" 
            active={activeTab === "Products"} 
            onClick={() => setActiveTab("Products")}
          />
          <SidebarItem 
            icon={<TrendingUp size={20} />} 
            label="Inventory" 
            active={activeTab === "Inventory"} 
            onClick={() => setActiveTab("Inventory")}
          />
          <SidebarItem 
            icon={<ClipboardList size={20} />} 
            label="Categories" 
            active={activeTab === "Categories"} 
            onClick={() => setActiveTab("Categories")}
          />
          <SidebarItem 
            icon={<ClipboardList size={20} />} 
            label="Orders" 
            active={activeTab === "Orders"} 
            onClick={() => setActiveTab("Orders")}
          />
          <SidebarItem 
            icon={<Truck size={20} />} 
            label="Delivery" 
            active={activeTab === "Delivery"} 
            onClick={() => setActiveTab("Delivery")}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Customers" 
            active={activeTab === "Customers"} 
            onClick={() => setActiveTab("Customers")}
          />
          <SidebarItem 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            active={activeTab === "Settings"} 
            onClick={() => setActiveTab("Settings")}
          />
          <div className="px-5 mt-2 mb-4">
            <div 
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-all border border-red-500/30 rounded-xl hover:bg-red-500/10 group"
            >
              <span className="text-[#EF4444]"><LogOut size={20} /></span>
              <span className="text-sm tracking-wide text-slate-200 group-hover:text-white">Logout</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* =========================================================
          2. MAIN CONTENT AREA (Right Side)
          ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header / Navbar */}
        <header className="flex items-center justify-between bg-white px-8 py-4 border-b border-slate-200 shrink-0">

          {/* Top Search Bar */}
          <div className="flex items-center bg-[#F3F4F6] px-4 py-2.5 rounded-lg w-full max-w-xl group focus-within:ring-2 focus-within:ring-green-500/10 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <input
              className="bg-transparent outline-none ml-3 w-full text-sm font-medium"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Notifications & Admin Profile */}
          <div className="flex items-center gap-6 relative">
            <div 
              className="relative cursor-pointer p-1 text-slate-500 hover:text-slate-800 transition-colors"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              <Bell size={22} />
              <span className="absolute -top-0.5 -right-0.5 bg-[#EF4444] text-white text-[9px] font-bold px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white">
                1
              </span>
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-12 right-20 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                  <button className="text-xs text-blue-600 font-bold hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0 mt-0.5">
                        <ClipboardList size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 mb-0.5">New Order #003</p>
                        <p className="text-xs text-slate-500 line-clamp-2">Maria Clara placed a new order for Hardware Tools.</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                     <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0 mt-0.5">
                        <Truck size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 mb-0.5">Delivery DEL-001 Approved</p>
                        <p className="text-xs text-slate-500 line-clamp-2">Delivery request has been approved and is ready for dispatch.</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 text-center border-t border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-xs font-bold text-blue-600">View All Notifications</span>
                </div>
              </div>
            )}

            <div className="h-8 w-px bg-slate-200 mx-2" />

            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                <img src="https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff" alt="Profile" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-800">Admin</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-12 right-0 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-black text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">admin@maximshardware.com</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {
                      setActiveTab("Settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                  >
                    <SettingsIcon size={16} />
                    Account Settings
                  </button>
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button 
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="p-8 overflow-auto custom-scrollbar flex-1 bg-slate-50/50">

          {activeTab === "Dashboard" && (
            <div className="animate-in fade-in duration-500">
              {/* STATISTICS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Products"
                  value="120"
                  icon={<div className="bg-[#D1D5DB] p-2.5 rounded shadow-inner"><Package size={28} className="text-[#374151]" /></div>}
                />
                <StatCard
                  title="Orders"
                  value="45"
                  icon={<div className="bg-[#D1D5DB] p-2.5 rounded shadow-inner"><ClipboardList size={28} className="text-[#374151]" /></div>}
                />
                <StatCard
                  title="Total Sales"
                  value="₱12,000"
                  icon={<div className="bg-[#059669] p-2.5 rounded shadow-lg"><div className="w-7 h-7 flex items-center justify-center font-black text-white text-xl">₱</div></div>}
                />
                <StatCard
                  title="Customers"
                  value="30"
                  icon={<div className="bg-[#2563EB] p-2.5 rounded shadow-lg"><Users size={28} className="text-white" /></div>}
                />
              </div>

              {/* RECENT ORDERS */}
              <Section title="Recent Orders Overview">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAFB] border-b border-slate-200">
                      <tr className="text-slate-400 text-xs font-bold tracking-wider uppercase">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRecentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{order.id}</td>
                          <td className="px-6 py-4 font-medium">{order.customer}</td>
                          <td className="px-6 py-4 font-black">{order.total}</td>
                          <td className="px-6 py-4">
                            <span 
                              onClick={() => handleUpdateStatusClick(order, 'order')}
                              className={`px-3 py-1 rounded-md text-xs font-bold text-center inline-block min-w-[80px] cursor-pointer hover:opacity-80 transition-opacity ${
                                order.status === 'Pending' ? 'bg-[#FEF3C7] text-[#92400E]' : 
                                order.status === 'Delivered' ? 'bg-[#DCFCE7] text-[#15803D]' : 
                                'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => handleViewOrder(order)} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 active:scale-95">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* DELIVERY REQUESTS */}
              <Section title="Pending Delivery Requests">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAFB] border-b border-slate-200">
                      <tr className="text-slate-400 text-xs font-bold tracking-wider uppercase">
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Address</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDeliveryRequests.map((delivery) => (
                        <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium">{delivery.customer}</td>
                          <td className="px-6 py-4">{delivery.address}</td>
                          <td className="px-6 py-4">
                            <span 
                              onClick={() => handleUpdateStatusClick(delivery, 'delivery')}
                              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity ${
                                delivery.status === 'Pending' ? 'bg-[#FEF3C7] text-[#92400E]' : 
                                delivery.status === 'Approved' ? 'bg-[#DCFCE7] text-[#15803D]' :
                                'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {delivery.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => handleApproveDelivery(delivery)} className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all focus:ring-2 focus:ring-green-500/20 active:scale-95">Approve</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}

          {activeTab === "Products" && <Product searchQuery={searchQuery} />}
          {activeTab === "Categories" && <Categories searchQuery={searchQuery} />}
          {activeTab === "Orders" && <Orders searchQuery={searchQuery} />}
          {activeTab === "Customers" && <Customers searchQuery={searchQuery} />}
          {activeTab === "Inventory" && <Inventory searchQuery={searchQuery} />}
          {activeTab === "Settings" && <Settings />}
          {activeTab === "Delivery" && <Delivery searchQuery={searchQuery} />}

          {/* Placeholders for other tabs */}
          {activeTab !== "Dashboard" && activeTab !== "Products" && activeTab !== "Categories" && activeTab !== "Orders" && activeTab !== "Customers" && activeTab !== "Settings" && activeTab !== "Delivery" && activeTab !== "Inventory" && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in zoom-in-95 duration-500">
              <LayoutDashboard size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold">{activeTab} Section</h2>
              <p className="text-sm font-medium">Coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
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
              <p className="text-sm text-slate-500 font-medium mb-1">Editing status for:</p>
              <p className="text-lg font-black text-slate-800 mb-6">{selectedItem.data.id || selectedItem.data.customer}</p>

              <div className="space-y-3">
                {selectedItem.type === 'order' 
                  ? ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => saveStatus(status)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${selectedItem.data.status === status
                        ? 'border-[#10B981] bg-emerald-50 text-[#10B981]'
                        : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {status}
                      {selectedItem.data.status === status && <CheckCircle2 size={18} className="text-[#10B981]" />}
                    </button>
                  ))
                  : ['Pending', 'Approved', 'In Transit', 'Delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => saveStatus(status)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${selectedItem.data.status === status
                        ? 'border-[#10B981] bg-emerald-50 text-[#10B981]'
                        : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {status}
                      {selectedItem.data.status === status && <CheckCircle2 size={18} className="text-[#10B981]" />}
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && selectedViewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-[#2563EB] p-2 rounded-lg text-white">
                  <Eye size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-lg">Order Details</h3>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order ID</p>
                  <p className="text-sm font-black text-slate-900">{selectedViewItem.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</p>
                  <p className="text-sm font-black text-blue-600">{selectedViewItem.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Customer</p>
                  <p className="text-sm font-black text-slate-900">{selectedViewItem.customer}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Amount</p>
                  <p className="text-lg font-black text-emerald-600">{selectedViewItem.total}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowViewModal(false)}
                className="w-full mt-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <LogOut size={36} className="text-red-500 translate-x-1" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Log Out</h2>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Are you sure you want to log out<br/>from your account?
            </p>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
                className="flex-1 py-3 px-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                <LogOut size={18} strokeWidth={2.5} />
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HELPER COMPONENTS (Used above)
   ========================================================= */


// Small summary box for statistics
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
      <div className="flex items-center gap-5">
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
          <h2 className="text-3xl font-black text-slate-900 mt-0.5">{value}</h2>
        </div>
      </div>
    </div>
  );
}

// Wrapper for a major table section (adds a Title)
function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-black text-slate-800 mb-5 leading-none">{title}</h2>
      {children}
    </div>
  );
}

// Single row of data in the Products table
function TableRow({ name, price, category, image }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="w-14 h-14 bg-slate-50 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center p-1 group-hover:border-green-500 transition-colors shadow-sm">
          <img src={image} alt={name} className="w-full h-full object-cover rounded-md" />
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-slate-800">{name}</td>
      <td className="px-6 py-4 font-black text-slate-900">{price}</td>
      <td className="px-6 py-4 font-medium text-slate-500 text-sm">{category}</td>
      <td className="px-6 py-4 text-center">
        <div className="flex gap-2 justify-center">
          <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 active:scale-95">Edit</button>
          <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all focus:ring-2 focus:ring-red-500/20 active:scale-95">Delete</button>
        </div>
      </td>
    </tr>
  );
}

// Logo Component (Uses the specific maximshardwarelogo.png with a white background)
function Logo() {
  return (
    <div className="flex justify-center items-center py-4 px-3 bg-white rounded-2xl shadow-sm border border-slate-200/50">
      <img
        src={logo}
        alt="Maxims Hardware Logo"
        className="w-full h-auto max-h-24 object-contain shadow-sm"
      />
    </div>
  );
}

