'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  MoreHorizontal,
  LogOut,
  User,
  Sparkles,
  Image as ImageIcon,
  MessageCircle,
  X,
  Send
} from 'lucide-react';
import { useComplaint, Urgency, Complaint } from '@/context/ComplaintContext';

const CATEGORIES = ["IT", "Maintenance", "HR", "Other"];
const URGENCY: Urgency[] = ["Low", "Medium", "High"];

export default function SmartComplaintApp() {
  const router = useRouter();
  const { complaints, addComplaint, addComment, currentUserId, currentUserRole, logout } = useComplaint();
  
  const [activeCategory, setActiveCategory] = useState("IT");
  const [activeUrgency, setActiveUrgency] = useState<Urgency>("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [activeChatModal, setActiveChatModal] = useState<Complaint | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (!currentUserId || currentUserRole !== 'employee') {
      router.push('/');
    }
  }, [currentUserId, currentUserRole, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress heavily (0.6 quality) to save localStorage space
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          setImagePreview(compressedBase64);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiTriage = () => {
    if (!description.trim()) {
      alert("Please enter a description first so the AI can analyze it.");
      return;
    }
    
    setIsAiLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const text = description.toLowerCase();
      if (text.includes('leak') || text.includes('water') || text.includes('ac')) {
        setTitle("Water Leak / AC Issue");
        setActiveCategory("Maintenance");
        setActiveUrgency("High");
      } else if (text.includes('wifi') || text.includes('internet') || text.includes('computer')) {
        setTitle("Network / IT Connectivity Issue");
        setActiveCategory("IT");
        setActiveUrgency("High");
      } else if (text.includes('pay') || text.includes('salary') || text.includes('hr')) {
        setTitle("Payroll Inquiry");
        setActiveCategory("HR");
        setActiveUrgency("Medium");
      } else {
        setTitle("General Request");
        setActiveCategory("Other");
        setActiveUrgency("Low");
      }
      setIsAiLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addComplaint({
      title,
      category: activeCategory,
      urgency: activeUrgency,
      description,
      image: imagePreview
    });

    setTitle("");
    setDescription("");
    setActiveCategory("IT");
    setActiveUrgency("Medium");
    setImagePreview(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeChatModal) return;
    addComment(activeChatModal.id, commentText);
    setCommentText("");
    
    // update local modal state so chat refreshes without closing
    const updated = complaints.find(c => c.id === activeChatModal.id);
    if (updated) setActiveChatModal(updated);
  };
  
  if (!isClient || !currentUserId) return null;

  const userComplaints = complaints.filter(c => c.authorId === currentUserId);

  return (
    <div className="min-h-screen text-slate-800 selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Smart Complaint</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-semibold text-slate-800">ID: {currentUserId}</span>
                <span className="text-xs text-slate-500">Employee</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 text-blue-700 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pt-12 flex flex-col gap-10">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Welcome back, {currentUserId}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Manage and track your facility requests in one place.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* New Complaint Form */}
          <section className="md:col-span-7 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-800 ml-1">File a New Complaint</h2>
            
            <div className="bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 relative overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-slate-600 ml-1">Description</label>
                    <button 
                      type="button" 
                      onClick={handleAiTriage}
                      disabled={isAiLoading}
                      className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                      {isAiLoading ? 'Analyzing...' : 'AI Auto-Fill'}
                    </button>
                  </div>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue... (Click AI Auto-Fill to categorize)" 
                    className="w-full bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all resize-none placeholder:text-slate-400 shadow-sm"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Coffee machine is broken" 
                    className="w-full bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-slate-400 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-600 ml-1">Category</label>
                    <div className="relative">
                      <select 
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className="w-full appearance-none bg-white/50 border border-slate-200/60 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-slate-700 shadow-sm"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-600 ml-1">Urgency</label>
                    <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-white/60">
                      {URGENCY.map(u => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setActiveUrgency(u)}
                          className={`flex-1 text-sm font-medium py-2 rounded-xl transition-all ${activeUrgency === u ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">Attachment (Optional)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors ${imagePreview ? 'border-blue-300 bg-blue-50/50' : ''}`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Click to upload photo</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="mt-2 w-full bg-slate-900 text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5" />
                  Submit Complaint
                </button>
              </form>
            </div>
          </section>

          {/* Recent Complaints */}
          <section className="md:col-span-5 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-800 ml-1">Your Recent Activity</h2>
            
            <div className="flex flex-col gap-3">
              {userComplaints.length === 0 && (
                <p className="text-slate-500 text-sm mt-4 text-center">You have no recent activity.</p>
              )}
              {userComplaints.map(complaint => (
                <div 
                  key={complaint.id} 
                  onClick={() => setActiveChatModal(complaint)}
                  className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm rounded-3xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                        complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                        complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {complaint.status === 'Resolved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                         complaint.status === 'In Progress' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {complaint.status}
                      </span>
                      <span className="text-slate-400 text-xs font-medium">{complaint.category}</span>
                    </div>
                    {complaint.comments.length > 0 && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> {complaint.comments.length}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold transition-colors ${complaint.status === 'Resolved' ? 'text-slate-500 line-through' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {complaint.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Chat Modal */}
      {activeChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{activeChatModal.title}</h3>
                <p className="text-sm text-slate-500">Ticket #{activeChatModal.id}</p>
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
                      <span className="text-xs text-slate-400 mb-1 px-1">{comment.authorId} • {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${comment.authorId === currentUserId ? 'bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
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
                placeholder="Add a comment..."
                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
              <button type="submit" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0 shadow-sm shadow-blue-500/20">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
