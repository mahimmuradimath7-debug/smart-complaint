'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { useComplaint } from '@/context/ComplaintContext';

export default function LoginGateway() {
  const router = useRouter();
  const { login } = useComplaint();
  const [activePortal, setActivePortal] = useState<'employee' | 'admin' | null>(null);
  const [idNumber, setIdNumber] = useState('');

  const handleLogin = (e: React.FormEvent, type: 'employee' | 'admin') => {
    e.preventDefault();
    if (!idNumber.trim()) return;
    
    login(idNumber.trim(), type);
    
    if (type === 'employee') {
      router.push('/dashboard');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-20">
      <div className="w-full max-w-4xl flex flex-col items-center gap-12">
        
        <header className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
            Welcome to Smart Complaint
          </h1>
          <p className="text-slate-500 mt-4 text-xl">
            Choose your portal and enter your ID to continue
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          
          {/* Employee Portal Card */}
          <div 
            onClick={() => { if (activePortal !== 'employee') { setActivePortal('employee'); setIdNumber(''); } }}
            className={`bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-10 flex flex-col items-center text-center gap-6 transition-all duration-300 relative overflow-hidden cursor-pointer ${activePortal === 'employee' ? 'ring-2 ring-blue-500/50 shadow-[0_20px_40px_rgb(0,0,0,0.08)] scale-[1.02]' : 'hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1'}`}
          >
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 transition-opacity ${activePortal === 'employee' ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className={`w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2 transition-transform duration-300 ${activePortal === 'employee' ? 'scale-110' : ''}`}>
              <User className="w-10 h-10" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Employee Portal</h2>
              <p className="text-slate-500 mt-3 text-base leading-relaxed">
                File new complaints, track your requests, and view recent activity.
              </p>
            </div>

            <div className="mt-auto w-full pt-4 h-[72px]">
              {activePortal === 'employee' ? (
                <form onSubmit={(e) => handleLogin(e, 'employee')} className="relative animate-in fade-in zoom-in duration-300">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Enter Employee ID..." 
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-white/80 border border-blue-200 rounded-2xl pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-slate-700 shadow-sm"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center h-full gap-2 text-blue-600 font-medium">
                  Click to login <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Admin Portal Card */}
          <div 
            onClick={() => { if (activePortal !== 'admin') { setActivePortal('admin'); setIdNumber(''); } }}
            className={`bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-10 flex flex-col items-center text-center gap-6 transition-all duration-300 relative overflow-hidden cursor-pointer ${activePortal === 'admin' ? 'ring-2 ring-emerald-500/50 shadow-[0_20px_40px_rgb(0,0,0,0.08)] scale-[1.02]' : 'hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1'}`}
          >
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-teal-500/5 transition-opacity ${activePortal === 'admin' ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className={`w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2 transition-transform duration-300 ${activePortal === 'admin' ? 'scale-110' : ''}`}>
              <ShieldCheck className="w-10 h-10" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Admin Panel</h2>
              <p className="text-slate-500 mt-3 text-base leading-relaxed">
                Review incoming tickets, assign tasks, and manage facility operations.
              </p>
            </div>

            <div className="mt-auto w-full pt-4 h-[72px]">
              {activePortal === 'admin' ? (
                <form onSubmit={(e) => handleLogin(e, 'admin')} className="relative animate-in fade-in zoom-in duration-300">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Enter Admin ID..." 
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-2xl pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all text-slate-700 shadow-sm"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center h-full gap-2 text-emerald-600 font-medium">
                  Click to login <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

        </div>
        
        <footer className="mt-8 text-center text-slate-400 font-medium text-sm animate-in fade-in duration-500 delay-300">
          Developed by Mahim Muradimath
        </footer>
      </div>
    </div>
  );
}
