'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = 'https://sqcautxsrdsyakdonifg.supabase.co';
const supabaseKey = 'sb_publishable_awC1YTfItx6_dSaZq6e1uw_DDviUCJX';
const supabase = createClient(supabaseUrl, supabaseKey);

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';
export type Urgency = 'Low' | 'Medium' | 'High';

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
}

export interface Complaint {
  id: string;
  authorId: string;
  title: string;
  category: string;
  urgency: Urgency;
  description: string;
  image?: string | null;
  comments: Comment[];
  status: ComplaintStatus;
  createdAt: number;
}

interface ComplaintContextType {
  complaints: Complaint[];
  currentUserId: string | null;
  currentUserRole: 'employee' | 'admin' | null;
  login: (id: string, role: 'employee' | 'admin') => void;
  logout: () => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'authorId' | 'comments'>) => void;
  updateStatus: (id: string, status: ComplaintStatus) => void;
  addComment: (complaintId: string, text: string) => void;
  toast: { message: string; type: 'success' | 'info' | 'email' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'email' | 'error') => void;
  isLoading: boolean;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export function ComplaintProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'employee' | 'admin' | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'email' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load User Auth
  useEffect(() => {
    const savedUser = localStorage.getItem('smart-user-id');
    const savedRole = localStorage.getItem('smart-user-role');
    if (savedUser && savedRole) {
      setCurrentUserId(savedUser);
      setCurrentUserRole(savedRole as 'employee' | 'admin');
    }
  }, []);

  // Fetch Complaints from Supabase
  const fetchComplaints = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Error fetching complaints:", error);
      showToast("Error loading database.", "error");
    } else if (data) {
      setComplaints(data as Complaint[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
    
    // Subscribe to realtime changes (if RLS allows)
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, (payload) => {
        fetchComplaints();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const login = (id: string, role: 'employee' | 'admin') => {
    setCurrentUserId(id);
    setCurrentUserRole(role);
    localStorage.setItem('smart-user-id', id);
    localStorage.setItem('smart-user-role', role);
  };

  const logout = () => {
    setCurrentUserId(null);
    setCurrentUserRole(null);
    localStorage.removeItem('smart-user-id');
    localStorage.removeItem('smart-user-role');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'email' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'authorId' | 'comments'>) => {
    if (!currentUserId) return;
    const newComplaint: Complaint = {
      ...complaintData,
      id: Math.random().toString(36).substring(2, 9),
      authorId: currentUserId,
      comments: [],
      status: 'Pending',
      createdAt: Date.now(),
    };
    
    // Optimistic UI update
    setComplaints(prev => [newComplaint, ...prev]);
    showToast('Complaint submitted successfully!');

    // Push to Supabase
    const { error } = await supabase.from('complaints').insert([newComplaint]);
    if (error) {
      console.error("Insert Error", error);
      showToast("Failed to sync to database.", "error");
      fetchComplaints(); // revert
    }
  };

  const updateStatus = async (id: string, status: ComplaintStatus) => {
    // Optimistic UI update
    setComplaints(current =>
      current.map(c => {
        if (c.id === id) {
          if (status === 'Resolved' && c.status !== 'Resolved') {
            showToast(`📧 Automated Email sent to ${c.authorId} regarding resolved ticket!`, 'email');
          } else if (status === 'In Progress') {
            showToast('Ticket assigned!', 'info');
          }
          return { ...c, status };
        }
        return c;
      })
    );

    // Push to Supabase
    const { error } = await supabase.from('complaints').update({ status }).eq('id', id);
    if (error) {
      console.error("Update Status Error", error);
      fetchComplaints(); // revert on failure
    }
  };

  const addComment = async (complaintId: string, text: string) => {
    if (!currentUserId) return;
    
    const targetComplaint = complaints.find(c => c.id === complaintId);
    if (!targetComplaint) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      authorId: currentUserId,
      text,
      createdAt: Date.now()
    };

    const updatedComments = [...targetComplaint.comments, newComment];

    // Optimistic UI update
    setComplaints(current =>
      current.map(c => c.id === complaintId ? { ...c, comments: updatedComments } : c)
    );

    // Push to Supabase
    const { error } = await supabase.from('complaints').update({ comments: updatedComments }).eq('id', complaintId);
    if (error) {
      console.error("Add Comment Error", error);
      fetchComplaints(); // revert on failure
    }
  };

  return (
    <ComplaintContext.Provider value={{ complaints, currentUserId, currentUserRole, login, logout, addComplaint, updateStatus, addComment, toast, showToast, isLoading }}>
      {children}
      
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/20' 
            : toast.type === 'email' ? 'bg-purple-600/90 border-purple-500 text-white shadow-purple-600/20'
            : toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white shadow-red-500/20'
            : 'bg-blue-500/90 border-blue-400 text-white shadow-blue-500/20'
          }`}>
            <span className="font-medium text-lg leading-tight">{toast.message}</span>
          </div>
        </div>
      )}
    </ComplaintContext.Provider>
  );
}

export function useComplaint() {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaint must be used within a ComplaintProvider');
  }
  return context;
}
