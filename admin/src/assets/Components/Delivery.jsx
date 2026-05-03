import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronRight as BreadcrumbArrow,
  Map,
  ClipboardList,
  X
} from "lucide-react";

export default function Delivery({ searchQuery: globalSearchQuery = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryToTrack, setDeliveryToTrack] = useState(null);
  const [deliveryToView, setDeliveryToView] = useState(null);

  const [deliveryData, setDeliveryData] = useState([
    {
      id: "TRK-1001",
      orderId: "ORD-001",
      customer: "Juan Dela Cruz",
      address: "Purok 2, Paz Village, Gingoog City",
      driver: "Mike Santos",
      date: "Oct 25, 2026",
      status: "In Transit"
    },
    {
      id: "TRK-1002",
      orderId: "ORD-003",
      customer: "Pedro Reyes",
      address: "Purok 5, Gingoog City",
      driver: "Alex Cruz",
      date: "Oct 24, 2026",
      status: "Dispatched"
    },
    {
      id: "TRK-1003",
      orderId: "ORD-004",
      customer: "Ana Lopez",
      address: "Barangay 20, Gingoog City",
      driver: "Ramon Perez",
      date: "Oct 23, 2026",
      status: "Delivered"
    },
    {
      id: "TRK-1004",
      orderId: "ORD-005",
      customer: "Rodel Ramirez",
      address: "Purok 1, Gingoog City",
      driver: "Unassigned",
      date: "Oct 25, 2026",
      status: "Pending Dispatch"
    },
    {
      id: "TRK-1005",
      orderId: "ORD-006",
      customer: "Lito Sy",
      address: "Barangay 24-A, Paz Village",
      driver: "Mike Santos",
      date: "Oct 25, 2026",
      status: "In Transit"
    }
  ]);

  const handleUpdateStatusClick = (delivery) => {
    setSelectedDelivery(delivery);
    setShowStatusModal(true);
  };

  const saveStatus = (newStatus) => {
    setDeliveryData(deliveryData.map(d => d.id === selectedDelivery.id ? { ...d, status: newStatus } : d));
    setShowStatusModal(false);
  };

  const filteredDeliveries = deliveryData.filter(delivery => {
    const matchesLocal = delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGlobal = globalSearchQuery ? (
                          delivery.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                          delivery.customer.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                          delivery.orderId.toLowerCase().includes(globalSearchQuery.toLowerCase())) : true;
    const matchesStatus = statusFilter === "All" || delivery.status === statusFilter;
    return matchesLocal && matchesGlobal && matchesStatus;
  });

  const handleTrackClick = (delivery) => setDeliveryToTrack(delivery);
  const handleViewClick = (delivery) => setDeliveryToView(delivery);

  const handleExport = () => {
    const headers = ['Tracking ID', 'Order Ref', 'Customer', 'Delivery Address', 'Driver', 'Date', 'Status'];
    const csvContent = [
        headers.join(','),
        ...filteredDeliveries.map(delivery => 
            [delivery.id, delivery.orderId, `"${delivery.customer}"`, `"${delivery.address}"`, `"${delivery.driver}"`, `"${delivery.date}"`, delivery.status].join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'delivery_routes_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const transitCount = deliveryData.filter(d => d.status === 'In Transit' || d.status === 'Dispatched').length;
  const deliveredCount = deliveryData.filter(d => d.status === 'Delivered').length;
  const pendingCount = deliveryData.filter(d => d.status === 'Pending Dispatch').length;

  // Active drivers logic could be dynamic, hardcoding for now based on data
  const activeDrivers = new Set(deliveryData.filter(d => d.driver !== 'Unassigned').map(d => d.driver)).size;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending Dispatch': return 'bg-yellow-100 text-yellow-700';
      case 'Dispatched': return 'bg-blue-100 text-blue-700';
      case 'In Transit': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Failed Delivery': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#106A42] p-2 rounded-xl text-white">
              <Truck size={28} />
            </div>
            <h1 className="text-3xl font-black text-[#106A42] tracking-tight">Delivery Management</h1>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-2">
            <span>Dashboard</span>
            <BreadcrumbArrow size={14} />
            <span>Delivery</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all focus:ring-2 focus:ring-slate-200 active:scale-95"
          >
            <Download size={18} />
            Export Routes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#DBEAFE] text-[#2563EB] p-4 rounded-full">
            <Truck size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">Out for Delivery</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{transitCount}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#DCFCE7] text-[#16A34A] p-4 rounded-full">
            <CheckCircle2 size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">Delivered Today</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{deliveredCount}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#FEF9C3] text-[#CA8A04] p-4 rounded-full">
            <Package size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">Pending Dispatch</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{pendingCount}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-[#F3E8FF] text-[#9333EA] p-4 rounded-full">
            <Users size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold tracking-tight">Active Drivers</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{activeDrivers}</h2>
          </div>
        </div>
      </div>

      {/* Delivery Tracking List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-[#106A42]">Active Deliveries</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search tracking ID or customer..."
                className="w-full sm:w-72 pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-colors focus:ring-2 focus:ring-green-500/20 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending Dispatch">Pending Dispatch</option>
                <option value="Dispatched">Dispatched</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Failed Delivery">Failed Delivery</option>
              </select>

              <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-sm transition-colors">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
             <thead className="bg-[#146c43]">
              <tr className="text-white text-xs font-bold tracking-wider">
                <th className="px-6 py-4 rounded-tl-lg">Tracking ID</th>
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Customer Info</th>
                <th className="px-6 py-4">Delivery Address</th>
                <th className="px-6 py-4">Assigned Driver</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center rounded-tr-lg">Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeliveries.length > 0 ? filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-black text-[#106A42]">
                    <div className="flex items-center gap-2">
                       <MapPin size={16} className="text-[#106A42]/50" />
                       {delivery.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{delivery.orderId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    {delivery.customer}
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{delivery.date}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-[200px] truncate" title={delivery.address}>{delivery.address}</td>
                  <td className="px-6 py-4 text-sm">
                    {delivery.driver === 'Unassigned' ? (
                       <span className="text-slate-400 font-bold italic text-xs">Unassigned</span>
                    ) : (
                       <span className="font-bold text-slate-700 flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                           <img src={`https://ui-avatars.com/api/?name=${delivery.driver.replace(' ', '+')}&background=random&color=fff&size=24`} alt={delivery.driver} />
                         </div>
                         {delivery.driver}
                       </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      onClick={() => handleUpdateStatusClick(delivery)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity border border-transparent shadow-sm ${getStatusStyles(delivery.status)}`}
                      title="Click to update status"
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => handleTrackClick(delivery)}
                        className="p-2 bg-[#106A42]/10 text-[#106A42] hover:bg-[#106A42]/20 rounded-lg transition-colors shadow-sm" 
                        title="View Tracking Map"
                      >
                        <Map size={16} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleViewClick(delivery)}
                        className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors shadow-sm" 
                        title="View Order Details"
                      >
                        <ClipboardList size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                    No delivery records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Showing {filteredDeliveries.length} deliveries</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#146c43] text-white font-bold text-sm shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-[#106A42] p-2 rounded-lg text-white">
                  <Truck size={20} />
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
               <p className="text-sm text-slate-500 font-medium mb-1">Editing status for delivery:</p>
               <p className="text-lg font-black text-[#106A42] mb-6">{selectedDelivery.id}</p>
               
               <div className="space-y-3">
                 {['Pending Dispatch', 'Dispatched', 'In Transit', 'Delivered', 'Failed Delivery'].map(status => (
                   <button 
                     key={status}
                     onClick={() => saveStatus(status)}
                     className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${
                       selectedDelivery.status === status 
                         ? 'border-[#106A42] bg-green-50 text-[#106A42]' 
                         : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                     }`}
                   >
                     {status}
                     {selectedDelivery.status === status && <CheckCircle2 size={18} className="text-[#106A42]" />}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Map Modal */}
      {deliveryToTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-[#106A42] p-2 rounded-lg text-white">
                  <Map size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-lg">Live Tracking: {deliveryToTrack.id}</h3>
              </div>
              <button 
                onClick={() => setDeliveryToTrack(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6">
               <div className="w-full h-80 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center mb-6 overflow-hidden relative">
                 <iframe 
                   title="Live Tracking Map"
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   scrolling="no" 
                   marginHeight="0" 
                   marginWidth="0" 
                   src="https://www.openstreetmap.org/export/embed.html?bbox=125.07415771484376%2C8.804368143431057%2C125.13286590576173%2C8.847113110292676&amp;layer=mapnik" 
                   className="absolute inset-0"
                 ></iframe>
                 <div className="z-10 absolute bottom-4 right-4 bg-white/95 backdrop-blur px-6 py-4 rounded-2xl shadow-xl border border-slate-200 text-center animate-in slide-in-from-bottom-4 duration-500">
                    <MapPin size={28} className="text-[#106A42] mx-auto mb-1" />
                    <p className="font-black text-slate-900 text-sm">Destination</p>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{deliveryToTrack.address}</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Driver</p>
                   <p className="font-bold text-slate-800">{deliveryToTrack.driver}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                   <p className={`font-bold ${deliveryToTrack.status === 'Delivered' ? 'text-green-600' : 'text-[#106A42]'}`}>{deliveryToTrack.status}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details View Modal */}
      {deliveryToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <ClipboardList size={32} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 text-2xl mb-2">Order Details</h3>
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Ref</p>
                <p className="font-black text-lg text-slate-800">{deliveryToView.orderId}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</p>
                <p className="font-bold text-slate-600">{deliveryToView.customer}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</p>
                <p className="font-bold text-slate-600">{deliveryToView.date}</p>
              </div>
            </div>
            <button 
              onClick={() => setDeliveryToView(null)}
              className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
