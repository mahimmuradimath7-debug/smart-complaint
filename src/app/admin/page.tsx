'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Wrench,
  AlertCircle,
  LogOut,
  BarChart3,
  MessageCircle,
  X,
  Send
} from 'lucide-react';
import { useComplaint, Complaint } from '@/context/ComplaintContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { complaints, updateStatus, addComment, currentUserId, currentUserRole, logout } = useComplaint();
  const [isClient, setIsClient] = useState(false);
  const [activeChatModal, setActiveChatModal] = useState<Complaint | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (!currentUserId || currentUserRole !== 'admin') {
      router.push('/');
    }
  }, [currentUserId, currentUserRole, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeChatModal) return;
    addComment(activeChatModal.id, commentText);
    setCommentText("");
    
    // update local modal state
    const updated = complaints.find(c => c.id === activeChatModal.id);
    if (updated) setActiveChatModal(updated);
  };

  if (!isClient || !currentUserId) return null; // Avoid hydration mismatch
  
  const pending = complaints.filter(c => c.status === 'Pending');
  const inProgress = complaints.filter(c => c.status === 'In Progress');
  const resolved = complaints.filter(c => c.status === 'Resolved');

  return (
    <div className="min-h-screen text-slate-800 selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      {/* Admin Glass Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Admin Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/analytics" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-emerald-50 text-emerald-600 font-medium text-sm transition-colors mr-2 border border-transparent hover:border-emerald-100">
              <BarChart3 className="w-4 h-4" /> Analytics
            </Link>
            
            <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-500 hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-500 relative hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-semibold text-slate-800">Admin {currentUserId}</span>
                <span className="text-xs text-slate-500">Superuser</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/60 shadow-sm">
                <span className="text-white text-xs font-semibold">AD</span>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pt-12 flex flex-col gap-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Ticket Management
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Review and assign incoming complaints across all departments.
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm rounded-xl px-4 py-2 flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-800">{pending.length + inProgress.length}</span>
              <span className="text-xs text-slate-500">Open Tickets</span>
            </div>
            <div className="bg-emerald-50/70 backdrop-blur-xl border border-emerald-100 shadow-sm rounded-xl px-4 py-2 flex flex-col items-center">
              <span className="text-sm font-semibold text-emerald-700">{resolved.length}</span>
              <span className="text-xs text-emerald-600">Total Resolved</span>
            </div>
          </div>
        </header>

        {/* Kanban Board Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column: Pending */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <h2 className="font-semibold text-lg text-slate-800">Pending</h2>
              <span className="bg-slate-200/50 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">{pending.length}</span>
            </div>
            {pending.map((complaint) => (
              <div key={complaint.id} className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_12px_rgb(0,0,0,0.03)] rounded-3xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start" onClick={() => setActiveChatModal(complaint)}>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${complaint.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {complaint.urgency} Priority
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">ID: {complaint.authorId}</span>
                  </div>
                  {complaint.comments.length > 0 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" /> {complaint.comments.length}
                    </span>
                  )}
                </div>
                <div onClick={() => setActiveChatModal(complaint)} className="cursor-pointer">
                  <h3 className="font-semibold text-slate-800 text-lg leading-tight group-hover:text-emerald-600 transition-colors">{complaint.title}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-slate-500 font-medium">{complaint.category}</span>
                    <span className="text-xs text-slate-400">{new Date(complaint.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                <button onClick={() => updateStatus(complaint.id, 'In Progress')} className="mt-2 w-full bg-slate-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-slate-800 transition-all active:scale-[0.98]">
                  Assign Ticket
                </button>
              </div>
            ))}
          </div>

          {/* Column: In Progress */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-lg text-slate-800">In Progress</h2>
              <span className="bg-slate-200/50 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">{inProgress.length}</span>
            </div>
            {inProgress.map((complaint) => (
              <div key={complaint.id} className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_12px_rgb(0,0,0,0.03)] rounded-3xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start" onClick={() => setActiveChatModal(complaint)}>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${complaint.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {complaint.urgency} Priority
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">ID: {complaint.authorId}</span>
                  </div>
                  {complaint.comments.length > 0 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" /> {complaint.comments.length}
                    </span>
                  )}
                </div>
                <div onClick={() => setActiveChatModal(complaint)} className="cursor-pointer">
                  <h3 className="font-semibold text-slate-800 text-lg leading-tight group-hover:text-emerald-600 transition-colors">{complaint.title}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-slate-500 font-medium">{complaint.category}</span>
                    <span className="text-xs text-slate-400">{new Date(complaint.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                <button onClick={() => updateStatus(complaint.id, 'Resolved')} className="mt-2 w-full bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-xl py-2.5 text-sm font-medium hover:bg-emerald-200 transition-all active:scale-[0.98]">
                  Mark Resolved
                </button>
              </div>
            ))}
          </div>

          {/* Column: Resolved */}
          <div className="flex flex-col gap-4 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="font-semibold text-lg text-slate-800">Resolved</h2>
              <span className="bg-slate-200/50 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">{resolved.length}</span>
            </div>
            {resolved.map((complaint) => (
              <div key={complaint.id} className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 shadow-sm rounded-3xl p-5 flex flex-col gap-4 grayscale-[0.2]">
                <div className="flex justify-between items-start" onClick={() => setActiveChatModal(complaint)}>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {complaint.urgency} Priority
                    </span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-200">ID: {complaint.authorId}</span>
                  </div>
                  {complaint.comments.length > 0 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" /> {complaint.comments.length}
                    </span>
                  )}
                </div>
                <div onClick={() => setActiveChatModal(complaint)} className="cursor-pointer">
                  <h3 className="font-medium text-slate-600 text-lg leading-tight line-through decoration-slate-300">{complaint.title}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-slate-400">{complaint.category}</span>
                    <span className="text-xs text-slate-400">{new Date(complaint.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Chat Modal (Admin Side) */}
      {activeChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{activeChatModal.title}</h3>
                <p className="text-sm text-slate-500">Filed by Employee: {activeChatModal.authorId}</p>
              </div>
              <button onClick={() => setActiveChatModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 bg-slate-50/50">
              {/* Original Description */}
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Description</span>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{activeChatModal.description}</p>
                {activeChatModal.image && (
                  <img src={activeChatModal.image} alt="Attachment" className="mt-3 rounded-xl border border-slate-100 max-h-48 object-cover" />
                )}
              </div>

              {/* Chat Thread */}
              {activeChatModal.comments.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Discussion</span>
                  {activeChatModal.comments.map(comment => (
                    <div key={comment.id} className={`flex flex-col max-w-[85%] ${comment.authorId === currentUserId ? 'self-end items-end' : 'self-start items-start'}`}>
                      <span className="text-xs text-slate-400 mb-1 px-1">
                        {comment.authorId === currentUserId ? 'You (Admin)' : `Emp: ${comment.authorId}`} • {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${comment.authorId === currentUserId ? 'bg-emerald-600 text-white rounded-br-sm shadow-sm shadow-emerald-500/20' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                        {comment.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendComment} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Reply to employee..."
                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
              <button type="submit" className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shrink-0 shadow-sm shadow-emerald-500/20">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
