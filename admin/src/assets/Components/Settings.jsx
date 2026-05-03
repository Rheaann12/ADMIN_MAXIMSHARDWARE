import { useState } from "react";
import {
  Save,
  User,
  Store,
  Bell,
  Lock,
  ChevronRight as BreadcrumbArrow,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // General Info State
  const [generalInfo, setGeneralInfo] = useState({
    storeName: "Maxims Hardware",
    currency: "PHP (₱)",
    email: "admin@maximshardware.com",
    phone: "+63 912 345 6789",
    address: "Gingoog City, Misamis Oriental, Philippines"
  });

  // Account State
  const [accountInfo, setAccountInfo] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@maximshardware.com"
  });

  // Notification State
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    stockAlerts: true,
    deliveryAlerts: false
  });

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#106A42] p-2 rounded-xl text-white">
              <Store size={28} />
            </div>
            <h1 className="text-3xl font-black text-[#106A42] tracking-tight">Settings</h1>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-2">
            <span>Dashboard</span>
            <BreadcrumbArrow size={14} />
            <span>Settings</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="bg-[#146c43] hover:bg-[#105634] text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Save size={18} strokeWidth={2.5} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-green-50 text-[#106A42]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Store size={18} /> General Store Info
            </button>
            <button 
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'account' ? 'bg-green-50 text-[#106A42]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <User size={18} /> Admin Account
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-green-50 text-[#106A42]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Lock size={18} /> Security
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-green-50 text-[#106A42]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Bell size={18} /> Notifications
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-black text-slate-800 mb-6">General Store Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Store Name</label>
                    <input 
                      type="text" 
                      value={generalInfo.storeName}
                      onChange={(e) => setGeneralInfo({...generalInfo, storeName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Currency</label>
                    <select 
                      value={generalInfo.currency}
                      onChange={(e) => setGeneralInfo({...generalInfo, currency: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800"
                    >
                      <option>PHP (₱)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Store Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        value={generalInfo.email}
                        onChange={(e) => setGeneralInfo({...generalInfo, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={generalInfo.phone}
                        onChange={(e) => setGeneralInfo({...generalInfo, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Store Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-3 text-slate-400" />
                      <textarea 
                        rows={3} 
                        value={generalInfo.address}
                        onChange={(e) => setGeneralInfo({...generalInfo, address: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800 resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-xl font-black text-slate-800 mb-6">Admin Profile</h2>
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                      <img src="https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&size=100" alt="Admin Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="text-sm font-bold text-[#106A42] hover:text-[#0b482b] hover:underline">Change Avatar</button>
                  </div>
                  <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                        <input 
                          type="text" 
                          value={accountInfo.firstName}
                          onChange={(e) => setAccountInfo({...accountInfo, firstName: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                        <input 
                          type="text" 
                          value={accountInfo.lastName}
                          onChange={(e) => setAccountInfo({...accountInfo, lastName: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={accountInfo.email}
                          onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-800" 
                        />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-xl font-black text-slate-800 mb-6">Security Settings</h2>
               <div className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                  </div>
                  <div className="pt-2">
                    <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95">Update Password</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-xl font-black text-slate-800 mb-6">Notification Preferences</h2>
               <div className="space-y-6">
                 
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <h3 className="text-sm font-bold text-slate-800">New Order Alerts</h3>
                     <p className="text-xs font-medium text-slate-500 mt-0.5">Receive immediate notifications when a new order is placed.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.orderAlerts}
                      onChange={(e) => setNotifications({...notifications, orderAlerts: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#106A42]"></div>
                  </label>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <h3 className="text-sm font-bold text-slate-800">Low Stock Alerts</h3>
                     <p className="text-xs font-medium text-slate-500 mt-0.5">Get notified when a product inventory drops below 20%.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.stockAlerts}
                      onChange={(e) => setNotifications({...notifications, stockAlerts: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#106A42]"></div>
                  </label>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <h3 className="text-sm font-bold text-slate-800">Delivery Status Updates</h3>
                     <p className="text-xs font-medium text-slate-500 mt-0.5">Alerts for completed and pending deliveries.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.deliveryAlerts}
                      onChange={(e) => setNotifications({...notifications, deliveryAlerts: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#106A42]"></div>
                  </label>
                 </div>

               </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast / Overlay */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-8 duration-500">
          <div className="bg-[#106A42] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-sm">
            <div className="bg-white/20 p-1 rounded-full">
              <Save size={18} />
            </div>
            <div>
              <p className="font-bold text-sm">Settings Saved Successfully!</p>
              <p className="text-xs text-green-100 mt-0.5">Your changes have been applied to the system.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
