# 🚀 Smart Complaint App

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
</div>

<br />

**Smart Complaint** is a premium, beautifully designed facility and workspace request management platform. Built to streamline issue reporting in modern offices and communities.

## 💡 Inspiration
We noticed that traditional complaint and facility management portals are often clunky, outdated, and frustrating to use. We wanted to bring an "Apple-like" aesthetic to everyday enterprise tools—making filing a complaint or maintenance request as seamless and visually pleasing as using a modern consumer app.

## 💻 What it does
The Smart Complaint App provides a centralized dashboard for users to:
- **File New Complaints**: A sleek, glassmorphic form allowing users to select categories (IT, Maintenance, HR) and urgency levels.
- **Track Recent Activity**: A real-time overview of recently filed complaints, complete with status indicators (Pending, Resolved, etc.).
- **Experience Premium Design**: The UI leverages modern design principles including translucent frosted glass (backdrop-blur), smooth mesh gradients, and elegant typography to reduce cognitive load.

## 🛠️ How we built it
- **Framework**: [Next.js](https://nextjs.org/) (React framework) for fast, optimized, and scalable routing and rendering.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for rapid UI development and implementing complex Apple-inspired glassmorphism effects.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, scalable vector icons.
- **UI Architecture**: We utilized absolute positioning for glow effects, custom CSS variables, and modern flex/grid layouts to achieve the responsive dashboard structure.

## 🧠 Challenges we ran into
- Implementing a realistic "frosted glass" effect that looks great on both light and dark backgrounds. We had to perfectly balance `backdrop-blur` and `backdrop-saturate` with semi-transparent white backgrounds.
- Designing an intuitive but aesthetically pleasing form layout without relying on heavy UI component libraries.

## 🏆 Accomplishments that we're proud of
- Achieving a highly polished, production-ready UI in a very short amount of time.
- The subtle micro-interactions and hover states on the recent activity cards that make the app feel alive.
- Designing a soft, calming mesh gradient background that enhances the user experience.

## 🚀 What's next for Smart Complaint
- **Backend Integration**: Connecting the dashboard to a database (like Supabase or Firebase) to persist complaints.
- **Admin Panel**: Creating a specialized view for the IT and Maintenance teams to manage and resolve incoming tickets.
- **AI Triage**: Implementing AI to automatically categorize complaints and predict resolution times based on historical data.

---

## ⚙️ Running Locally

First, install dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
