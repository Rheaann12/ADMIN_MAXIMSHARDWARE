import React from 'react';

// Reusable Sidebar Item Component
export default function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-8 py-3.5 cursor-pointer transition-all border-l-4 ${
        active
          ? "bg-[#4CAF50] text-white border-white font-bold"
          : "text-slate-300 hover:bg-white/5 border-transparent"
      }`}
    >
      <span className={active ? "text-white" : "text-white/70"}>{icon}</span>
      <span className="text-sm tracking-wide">{label}</span>
      {active && <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
    </div>
  );
}
