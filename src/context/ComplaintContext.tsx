'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  image?: string | null; // Base64 string
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
  toast: { message: string; type: 'success' | 'info' | 'email' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'email') => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const initialMockData: Complaint[] = [
  { id: '1', authorId: 'E101', title: 'Coffee machine is broken', category: 'Maintenance', urgency: 'High', description: 'Leaking water', image: null, comments: [], status: 'Pending', createdAt: Date.now() - 600000 },
  { id: '2', authorId: 'E102', title: 'Wi-Fi down in sector 4', category: 'IT', urgency: 'High', description: 'No connection', image: null, comments: [], status: 'In Progress', createdAt: Date.now() - 3600000 },
];

export function ComplaintProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'employee' | 'admin' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'email' } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('smart-complaints-v2');
    if (saved) {
      setComplaints(JSON.parse(saved));
    } else {
      setComplaints(initialMockData);
      localStorage.setItem('smart-complaints-v2', JSON.stringify(initialMockData));
    }

    const savedUser = localStorage.getItem('smart-user-id');
    const savedRole = localStorage.getItem('smart-user-role');
    if (savedUser && savedRole) {
      setCurrentUserId(savedUser);
      setCurrentUserRole(savedRole as 'employee' | 'admin');
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('smart-complaints-v2', JSON.stringify(complaints));
      } catch (e) {
        console.error("Local storage full", e);
        showToast("Storage quota exceeded! Try uploading a smaller image or clearing history.", 'email');
      }
    }
  }, [complaints, isLoaded]);

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

  const showToast = (message: string, type: 'success' | 'info' | 'email' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'authorId' | 'comments'>) => {
    if (!currentUserId) return;
    const newComplaint: Complaint = {
      ...complaintData,
      id: Math.random().toString(36).substring(2, 9),
      authorId: currentUserId,
      comments: [],
      status: 'Pending',
      createdAt: Date.now(),
    };
    setComplaints([newComplaint, ...complaints]);
    showToast('Complaint submitted successfully!');
  };

  const updateStatus = (id: string, status: ComplaintStatus) => {
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
  };

  const addComment = (complaintId: string, text: string) => {
    if (!currentUserId) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      authorId: currentUserId,
      text,
      createdAt: Date.now()
    };
    setComplaints(current =>
      current.map(c => c.id === complaintId ? { ...c, comments: [...c.comments, newComment] } : c)
    );
  };

  return (
    <ComplaintContext.Provider value={{ complaints, currentUserId, currentUserRole, login, logout, addComplaint, updateStatus, addComment, toast, showToast }}>
      {children}
      
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/20' 
            : toast.type === 'email' ? 'bg-purple-600/90 border-purple-500 text-white shadow-purple-600/20'
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
