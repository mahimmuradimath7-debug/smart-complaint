# 🚀 Smart Complaint App - Complete Technical Documentation

## 📖 Project Overview
The **Smart Complaint App** is a modern, full-stack web application designed to streamline the ticketing and complaint resolution process within organizations. It features a dual-portal system (Employee and Admin), beautiful glassmorphic UI design, real-time database syncing, interactive analytics, and automated email notifications.

---

## 🛠️ Technology Stack (End-to-End)

### Frontend (Client-Side)
- **Framework:** Next.js (App Router)
- **Library:** React 18
- **Styling:** Tailwind CSS (configured for advanced Glassmorphism)
- **Icons:** Lucide-React
- **Data Visualization:** Recharts (used for the Admin Analytics dashboard)
- **State Management:** React Context API (`ComplaintContext`)

### Backend (Database & Services)
- **Database:** Supabase (PostgreSQL BaaS)
- **Email Service:** EmailJS (Client-side email trigger service)
- **Deployment & Hosting:** Netlify (via GitHub continuous integration)

---

## 📂 Core File Structure & Architecture

### 1. The Gateway (`src/app/page.tsx`)
This is the root landing page where authentication occurs.
- **Features:** Displays two beautiful glass cards (Employee & Admin). 
- **Security:** The Admin portal is hard-locked; it requires the exact ID (`mahim`) and Email (`mahimmuradimath7@gmail.com`) to enter, rejecting unauthorized attempts with a red toast.
- **Routing:** On successful login, it pushes the user to either `/dashboard` or `/admin`.

### 2. Employee Dashboard (`src/app/dashboard/page.tsx`)
The portal where general users submit and track their tickets.
- **Smart AI Auto-Fill:** A mock AI feature that analyzes keywords in the complaint description (e.g., "water", "internet") and automatically categorizes the urgency and department.
- **Image Upload:** Users can attach photos to tickets. The file is drawn to an HTML `<canvas>`, compressed, and converted to a lightweight Base64 string before saving to prevent database quota limits.
- **Ticket Tracking:** Displays the user's previously submitted tickets with their live status.
- **Live Chat Modal:** Clicking a ticket opens a detailed view where the employee can add comments to a conversation thread.

### 3. Admin Kanban Board (`src/app/admin/page.tsx`)
The operations center for administrators.
- **Kanban Interface:** Tickets are rendered in three distinct columns (Pending, In Progress, Resolved).
- **Status Management:** Admins can transition tickets across columns using action buttons.
- **Chat System:** Admins can open any ticket, view the uploaded images, and reply directly to the employee.

### 4. Analytics Dashboard (`src/app/admin/analytics/page.tsx`)
A dedicated data visualization hub for administrators.
- **Key Performance Indicators (KPIs):** Displays total complaints, average resolution time, and resolution rate dynamically calculated from the live database.
- **Recharts Integration:** Features a Bar Chart (complaints by category) and a Pie Chart (status distribution) to give a bird's-eye view of organizational bottlenecks.

---

## 🧠 State Management & Backend Logic

### The Brain: `src/context/ComplaintContext.tsx`
This single file acts as the bridge between the frontend UI and the backend Supabase database. It wraps the entire application (`layout.tsx`).

**Key Operations handled by Context:**
1. **Authentication State:** Manages `currentUserId`, `currentUserEmail`, and `currentUserRole`.
2. **Supabase Fetching:** On load, it queries the `complaints` table from Supabase and populates the global state.
3. **Optimistic UI Updates:** When an action occurs (e.g., adding a comment), it instantly updates the React state so the UI feels lightning-fast, and *then* pushes the update to the Supabase database in the background.
4. **Automated Email Routing (EmailJS):**
   - Listens for when an Admin updates a ticket status to `Resolved`.
   - Reads the `authorEmail` attached to that specific ticket.
   - Pings the EmailJS API (`service_uzur1yn`) with the user's email, triggering a real email delivery to their inbox.
5. **Toast Notifications:** A custom built-in toast system that renders dynamic success, error, and email alerts across the entire app.

---

## 🗄️ Database Schema (Supabase PostgreSQL)

The backend data is structured in a single robust table named `complaints`. 

```sql
create table complaints (
  id text primary key,
  "authorId" text not null,
  "authorEmail" text,
  title text not null,
  category text not null,
  urgency text not null,
  description text not null,
  image text,
  status text not null,
  "createdAt" bigint not null,
  comments jsonb not null default '[]'::jsonb
);
```
*Note: Row Level Security (RLS) is disabled for this table to allow seamless client-side reading and writing for the hackathon architecture.*

---

## 🎨 Design Philosophy (The "Wow" Factor)
The UI was explicitly built to feel like premium, state-of-the-art software:
- **Glassmorphism:** Heavy use of `backdrop-blur`, semi-transparent whites (`bg-white/70`), and soft shadows to create depth.
- **Micro-Animations:** Every button, card, and modal uses Tailwind's `transition-all`, `hover:-translate-y-1`, and `animate-in zoom-in` to feel responsive and alive.
- **Curated Colors:** Moving away from standard primary colors, the app uses tailored palettes (Emeralds, Slates, Indigos) to emulate modern Apple-style aesthetics.

---
**Developed by Mahim Muradimath**
