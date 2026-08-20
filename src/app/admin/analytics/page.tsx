'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowLeft, BarChart3, TrendingUp, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { useComplaint } from '@/context/ComplaintContext';

export default function AnalyticsDashboard() {
  const router = useRouter();
  const { complaints, currentUserId, currentUserRole } = useComplaint();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!currentUserId || currentUserRole !== 'admin') {
      router.push('/');
    }
  }, [currentUserId, currentUserRole, router]);

  if (!isClient) return null;

  // Compute Data for Charts
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const statusCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Pending', value: statusCounts['Pending'] || 0, color: '#f97316' }, // Orange
    { name: 'In Progress', value: statusCounts['In Progress'] || 0, color: '#3b82f6' }, // Blue
    { name: 'Resolved', value: statusCounts['Resolved'] || 0, color: '#10b981' }, // Emerald
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen text-slate-800 bg-slate-50/50 pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">Analytics Overview</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pt-10 flex flex-col gap-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-slate-200"><Activity className="w-12 h-12" /></div>
            <span className="text-slate-500 font-medium">Total Complaints</span>
            <span className="text-4xl font-bold text-slate-800">{complaints.length}</span>
            <span className="text-sm text-emerald-600 mt-2 flex items-center gap-1 font-medium"><TrendingUp className="w-4 h-4"/> +12% this week</span>
          </div>

          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-slate-200"><Clock className="w-12 h-12" /></div>
            <span className="text-slate-500 font-medium">Avg Resolution Time</span>
            <span className="text-4xl font-bold text-slate-800">4.2h</span>
            <span className="text-sm text-emerald-600 mt-2 flex items-center gap-1 font-medium"><TrendingUp className="w-4 h-4"/> -1.5h improvement</span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-slate-900/10 rounded-3xl p-6 flex flex-col gap-2 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-6 text-slate-700"><CheckCircle2 className="w-12 h-12" /></div>
            <span className="text-slate-400 font-medium">Resolution Rate</span>
            <span className="text-4xl font-bold">{Math.round(((statusCounts['Resolved'] || 0) / complaints.length) * 100) || 0}%</span>
            <span className="text-sm text-slate-300 mt-2 font-medium">Based on all time data</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bar Chart */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Complaints by Category</h2>
              <p className="text-sm text-slate-500">Volume of tickets across departments</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}/>
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 6, 6]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Current Status Distribution</h2>
              <p className="text-sm text-slate-500">Overview of ticket pipeline</p>
            </div>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}/>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '14px', color: '#64748b'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
