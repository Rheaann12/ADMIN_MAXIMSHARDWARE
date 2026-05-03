import { useState } from "react";
import {
    Search,
    Filter,
    Download,
    ClipboardList,
    Clock,
    CheckCircle2,
    Package,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronRight as BreadcrumbArrow,
    X
} from "lucide-react";

export default function Orders({ searchQuery: globalSearchQuery = "" }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [orderToView, setOrderToView] = useState(null);

    const [ordersData, setOrdersData] = useState([
        {
            id: "ORD-001",
            customer: "Juan Dela Cruz",
            date: "Oct 25, 2026",
            items: 12,
            total: 3500,
            payment: "Gcash",
            status: "Pending"
        },
        {
            id: "ORD-002",
            customer: "Maria Santos",
            date: "Oct 25, 2026",
            items: 3,
            total: 1200,
            payment: "Cash on Delivery",
            status: "Processing"
        },
        {
            id: "ORD-003",
            customer: "Pedro Reyes",
            date: "Oct 24, 2026",
            items: 5,
            total: 5800,
            payment: "Bank Transfer",
            status: "Shipped"
        },
        {
            id: "ORD-004",
            customer: "Ana Lopez",
            date: "Oct 23, 2026",
            items: 2,
            total: 800,
            payment: "Cash on Delivery",
            status: "Delivered"
        },
        {
            id: "ORD-005",
            customer: "Rodel Ramirez",
            date: "Oct 20, 2026",
            items: 8,
            total: 2100,
            payment: "Gcash",
            status: "Delivered"
        }
    ]);

    const handleUpdateStatusClick = (order) => {
        setSelectedOrder(order);
        setShowStatusModal(true);
    };

    const saveStatus = (newStatus) => {
        setOrdersData(ordersData.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
        setShowStatusModal(false);
    };

    const filteredOrders = ordersData.filter(order => {
        const matchesLocal = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGlobal = globalSearchQuery ? (order.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) || order.customer.toLowerCase().includes(globalSearchQuery.toLowerCase())) : true;
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesLocal && matchesGlobal && matchesStatus;
    });

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
    };

    const confirmDelete = () => {
        if (orderToDelete) {
            setOrdersData(ordersData.filter(o => o.id !== orderToDelete.id));
            setOrderToDelete(null);
        }
    };

    const handleViewClick = (order) => {
        setOrderToView(order);
    };

    const handleExport = () => {
        const headers = ['Order ID', 'Customer', 'Date', 'Items', 'Total Amount', 'Payment Method', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => 
                [order.id, `"${order.customer}"`, `"${order.date}"`, order.items, order.total, order.payment, order.status].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'orders_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.status !== 'Cancelled' ? order.total : 0), 0);
    const pendingCount = ordersData.filter(o => o.status === 'Pending').length;
    const deliveredCount = ordersData.filter(o => o.status === 'Delivered').length;

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
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
                            <ClipboardList size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-[#106A42] tracking-tight">Orders</h1>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-2">
                        <span>Dashboard</span>
                        <BreadcrumbArrow size={14} />
                        <span>Orders</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all focus:ring-2 focus:ring-slate-200 active:scale-95"
                    >
                        <Download size={18} />
                        Export Orders
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="bg-[#DBEAFE] text-[#2563EB] p-4 rounded-full">
                        <ClipboardList size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold tracking-tight">Total Orders</p>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">{ordersData.length}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="bg-[#FEF9C3] text-[#CA8A04] p-4 rounded-full">
                        <Clock size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold tracking-tight">Pending Orders</p>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">{pendingCount}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="bg-[#DCFCE7] text-[#16A34A] p-4 rounded-full">
                        <CheckCircle2 size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold tracking-tight">Delivered</p>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">{deliveredCount}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="bg-[#FCE7F3] text-[#DB2777] p-4 rounded-full">
                        <div className="w-7 h-7 flex items-center justify-center font-black text-xl">₱</div>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold tracking-tight">Total Revenue</p>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">₱{totalRevenue.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Orders List Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Table Header Controls */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-black text-[#106A42]">Order Tracking</h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:w-auto">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by ID or Name..."
                                className="w-full sm:w-64 pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-400"
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
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
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
                                <th className="px-6 py-4 rounded-tl-lg">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Payment Method</th>
                                <th className="px-6 py-4 text-center">Items</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-[#106A42]">{order.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{order.customer}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{order.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{order.payment}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700 text-center">{order.items}</td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-800">₱{order.total.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            onClick={() => handleUpdateStatusClick(order)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity border border-transparent shadow-sm ${getStatusStyles(order.status)}`}
                                            title="Click to update status"
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button 
                                                onClick={() => handleViewClick(order)}
                                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors shadow-sm" 
                                                title="View Order Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(order)}
                                                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors shadow-sm" 
                                                title="Delete Order"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                                        No orders found matching your search or filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Showing {filteredOrders.length} orders</span>
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
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#106A42] p-2 rounded-lg text-white">
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
                            <p className="text-sm text-slate-500 font-medium mb-1">Editing status for order:</p>
                            <p className="text-lg font-black text-[#106A42] mb-6">{selectedOrder.id}</p>

                            <div className="space-y-3">
                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => saveStatus(status)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${selectedOrder.status === status
                                            ? 'border-[#106A42] bg-green-50 text-[#106A42]'
                                            : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {status}
                                        {selectedOrder.status === status && <CheckCircle2 size={18} className="text-[#106A42]" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Order Modal */}
            {orderToView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-lg text-white">
                                    <ClipboardList size={20} />
                                </div>
                                <h3 className="font-black text-slate-900 text-lg">Order Details</h3>
                            </div>
                            <button
                                onClick={() => setOrderToView(null)}
                                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                                    <p className="font-black text-lg text-slate-900">{orderToView.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                    <p className="font-bold text-slate-700">{orderToView.date}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                                    <p className="font-bold text-slate-800">{orderToView.customer}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                                    <p className="font-bold text-slate-800">{orderToView.payment}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Items Count</p>
                                    <p className="font-bold text-slate-800">{orderToView.items} items</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${getStatusStyles(orderToView.status)}`}>
                                        {orderToView.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl mt-6 border border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-slate-600">Total Amount</span>
                                <span className="font-black text-2xl text-slate-900">₱{orderToView.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {orderToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl mb-2">Delete Order</h3>
                        <p className="text-sm text-slate-500 font-medium mb-6">
                            Are you sure you want to delete <strong className="text-slate-700">{orderToDelete.id}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setOrderToDelete(null)}
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
