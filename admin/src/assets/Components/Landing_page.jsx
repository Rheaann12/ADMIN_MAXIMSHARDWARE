import { useState } from "react";
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Hammer
} from "lucide-react";
import logo from "./maximshardwarelogo.png";

export default function LandingPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a brief loading state for "premium" feel
    setTimeout(() => {
      if (username === "MAXIMS HARDWARE" && password === "MAXIMS123") {
        onLogin();
      } else {
        setError("Invalid username or password. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="w-full max-w-[1000px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex overflow-hidden border border-white relative z-10">
        
        {/* Left Side: Branding/Visual */}
        <div className="hidden lg:flex w-1/2 bg-[#106A42] p-12 flex-col justify-between relative overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Quality Tools for <br/>Every Project.
            </h2>
            <p className="text-green-100/70 font-medium">
              Access the Maxims Hardware administrative control center to manage inventory, orders, and deliveries.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-black/10 backdrop-blur-sm p-6 rounded-3xl border border-white/5">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Hammer className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Professional Admin Suite</p>
              <p className="text-green-100/50 text-xs mt-0.5">Secure Management System v2.0</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
               <img src={logo} alt="Maxims Hardware" className="h-16 w-auto" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Please sign in to your administrator account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Admin Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#106A42] transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-[#106A42] transition-all outline-none placeholder:text-slate-300"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[10px] font-black text-[#106A42] hover:underline uppercase tracking-widest">Forgot Password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#106A42] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-[#106A42] transition-all outline-none placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#106A42] focus:ring-[#106A42]" />
              <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer select-none">Remember this device</label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#106A42] text-white font-black rounded-2xl shadow-xl shadow-green-900/20 hover:bg-[#0b482b] transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="uppercase tracking-widest text-xs">Authenticating...</span>
                </div>
              ) : (
                <>
                  <span className="uppercase tracking-[0.1em]">Login to Dashboard</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Maxims Hardware Management
          </p>
        </div>
      </div>
    </div>
  );
}
