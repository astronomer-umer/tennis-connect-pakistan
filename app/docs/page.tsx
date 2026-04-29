"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const currentCanvas = canvas;
    currentCanvas.width = window.innerWidth;
    currentCanvas.height = window.innerHeight;
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * currentCanvas.width,
        y: Math.random() * currentCanvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? "#22c55e" : "#f97316",
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
    
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > currentCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > currentCanvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        particles.forEach((p2, j) => {
          if (i >= j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#22c55e";
            ctx.globalAlpha = 0.1 * (1 - dist / 150);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      currentCanvas.width = window.innerWidth;
      currentCanvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sections = [
    { id: "overview", label: "Overview", icon: "🎾" },
    { id: "features", label: "Features", icon: "⚡" },
    { id: "workflows", label: "User Flows", icon: "🔄" },
    { id: "usecases", label: "Use Cases", icon: "💡" },
    { id: "admin", label: "Admin Panel", icon: "🛡️" },
    { id: "technical", label: "Technical", icon: "⚙️" },
  ];

  const features = [
    {
      category: "Authentication",
      icon: "🔐",
      items: [
        { name: "Email/Password Login", desc: "Secure authentication with session management" },
        { name: "Password Reset", desc: "Email-based password recovery flow" },
        { name: "Onboarding Wizard", desc: "4-step guided profile setup" },
        { name: "Session Persistence", desc: "Stay logged in across sessions" },
      ],
    },
    {
      category: "Discovery",
      icon: "🔍",
      items: [
        { name: "Swipe Cards", desc: "Tinder-style player discovery interface" },
        { name: "City Filtering", desc: "Filter by 5 Pakistani cities" },
        { name: "Level Matching", desc: "Find players at your skill level" },
        { name: "Hot Carousel", desc: "Featured players auto-scroll" },
      ],
    },
    {
      category: "Courts",
      icon: "🏟️",
      items: [
        { name: "Browse Courts", desc: "Search and filter tennis venues" },
        { name: "Surface Types", desc: "Hard, Clay, and Grass courts" },
        { name: "Amenities", desc: "Parking, Floodlights, Coaching" },
        { name: "Real-time Availability", desc: "Check opening hours" },
      ],
    },
    {
      category: "Bookings",
      icon: "📅",
      items: [
        { name: "3-Step Booking", desc: "Select → Pay → Confirm" },
        { name: "Conflict Detection", desc: "No double-booking allowed" },
        { name: "Payment Integration", desc: "JazzCash & EasyPaisa UI" },
        { name: "Booking History", desc: "Track all your sessions" },
      ],
    },
    {
      category: "Social",
      icon: "💬",
      items: [
        { name: "Match System", desc: "Connect with players you like" },
        { name: "In-App Chat", desc: "Message matches directly" },
        { name: "WhatsApp Link", desc: "One-tap external messaging" },
        { name: "Confetti Animation", desc: "Celebrate new matches!" },
      ],
    },
    {
      category: "Profile",
      icon: "👤",
      items: [
        { name: "Photo Upload", desc: "Base64 profile pictures" },
        { name: "Level Slider", desc: "NTRP rating from 2.5 to 5.0" },
        { name: "Stats Tracking", desc: "Wins, losses, Golden Sets" },
        { name: "Multi-City", desc: "Play in multiple cities" },
      ],
    },
  ];

  const workflows = [
    {
      title: "New User Journey",
      emoji: "🌟",
      steps: [
        { step: 1, title: "Sign Up", desc: "Create account with email & password", icon: "📧" },
        { step: 2, title: "Onboarding", desc: "Complete 4-step profile setup", icon: "📝" },
        { step: 3, title: "Discover", desc: "Browse & swipe through players", icon: "👀" },
        { step: 4, title: "Match", desc: "Connect when you both swipe right", icon: "✨" },
        { step: 5, title: "Chat", desc: "Message or share WhatsApp", icon: "💬" },
      ],
    },
    {
      title: "Booking a Court",
      emoji: "🏟️",
      steps: [
        { step: 1, title: "Browse", desc: "View courts in your city", icon: "🔍" },
        { step: 2, title: "Select", desc: "Pick date, time & duration", icon: "📅" },
        { step: 3, title: "Pay", desc: "JazzCash or EasyPaisa", icon: "💳" },
        { step: 4, title: "Confirm", desc: "Get booking confirmation", icon: "✅" },
        { step: 5, title: "Play!", desc: "Show up and enjoy tennis", icon: "🎾" },
      ],
    },
    {
      title: "Finding Players",
      emoji: "🤝",
      steps: [
        { step: 1, title: "Filter", desc: "Select city & skill level", icon: "🎯" },
        { step: 2, title: "Swipe", desc: "Right to like, left to pass", icon: "👆" },
        { step: 3, title: "Match", desc: "Both like each other = Match!", icon: "💥" },
        { step: 4, title: "Connect", desc: "Chat or use WhatsApp", icon: "📱" },
        { step: 5, title: "Play", desc: "Schedule and hit the court", icon: "🏃" },
      ],
    },
  ];

  const useCases = [
    {
      title: "Weekend Tennis Partner",
      emoji: "🎾",
      desc: "A working professional wants to find tennis partners for weekend matches. They filter by their city, set their NTRP level, and swipe through potential partners. When they match, they can chat and coordinate a time to meet at a local court.",
      flow: ["Sign Up → Set Level → Swipe → Match → Chat → Book Court"],
    },
    {
      title: "Tournament Training",
      emoji: "🏆",
      desc: "A competitive player wants to prepare for an upcoming tournament. They can find higher-level players in their area, book practice sessions at premium courts, and track their win/loss record to monitor improvement.",
      flow: ["Filter High Level → Match with Pro → Practice → Track Stats"],
    },
    {
      title: "Casual Social Play",
      emoji: "😊",
      desc: "A beginner wants to get into tennis socially. They complete onboarding with a beginner-friendly level, discover other beginners, and gradually increase their network while having fun.",
      flow: ["Onboard (Level 2.5) → Find Beginners → Social Matches"],
    },
    {
      title: "Court Discovery",
      emoji: "🏟️",
      desc: "A tennis enthusiast visiting a new city wants to find quality courts. They browse courts by city, check amenities and surface types, read ratings, and book a session to try out the venue.",
      flow: ["Select City → Browse Courts → Check Details → Book Session"],
    },
  ];

  const adminFeatures = [
    {
      title: "Dashboard",
      emoji: "📊",
      desc: "Overview of all key metrics including total courts, players, bookings, and revenue.",
      capabilities: ["Real-time stats", "Quick actions", "Revenue tracking"],
    },
    {
      title: "Courts Management",
      emoji: "🏟️",
      desc: "Full CRUD operations for tennis court venues across Pakistan.",
      capabilities: ["Add/Edit/Delete courts", "Set pricing", "Manage availability", "Feature courts"],
    },
    {
      title: "Players Management",
      emoji: "👥",
      desc: "View and manage all registered player profiles and their stats.",
      capabilities: ["Search & filter", "Edit profiles", "View win/loss", "Track activity"],
    },
    {
      title: "Bookings Control",
      emoji: "📅",
      desc: "Monitor and manage all court bookings with status controls.",
      capabilities: ["View all bookings", "Confirm/Pending/Cancel", "Conflict prevention"],
    },
    {
      title: "Contact Inquiries",
      emoji: "📬",
      desc: "Review and manage inquiries from potential new users.",
      capabilities: ["View submissions", "Contact details", "Priority tracking"],
    },
    {
      title: "User Management",
      emoji: "⚙️",
      desc: "Complete overview of all registered user accounts and their activity.",
      capabilities: ["User list", "Activity stats", "Booking counts", "Match history"],
    },
  ];

  const techStack = [
    { category: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui"] },
    { category: "Backend", items: ["Next.js API Routes", "better-auth", "Turso (libSQL)"] },
    { category: "Mobile", items: ["PWA Ready", "Service Worker", "Offline Support", "Mobile-First"] },
    { category: "Design", items: ["Dark Navy Theme", "Lime Green Accent", "Clay Orange", "Smooth Animations"] },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white relative overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50" />
      
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce">🎾</div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-green-400 to-orange-400 bg-clip-text text-transparent">
                    PlayPlan
                  </h1>
                  <p className="text-xs text-gray-400">Complete Documentation & Demo</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/" className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium">
                  Live App →
                </Link>
                <Link href="/admin-login" className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors font-medium">
                  Admin →
                </Link>
              </div>
            </div>
          </div>
        </header>

        <nav className="sticky top-[73px] z-40 glass border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? "bg-green-500 text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
          <section id="overview" className="scroll-mt-32">
            <div className="text-center mb-16">
              <div className="inline-block mb-6 px-4 py-2 bg-green-500/20 rounded-full">
                <span className="text-green-400 font-bold">🎉 Now Complete & Production-Ready</span>
              </div>
              <h2 className="text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-green-400 via-white to-orange-400 bg-clip-text text-transparent">
                  PlayPlan
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Pakistan's premier tennis networking platform. Find players, book courts, 
                and grow the tennis community — all from your phone.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { emoji: "👥", value: "1,000+", label: "Players", color: "from-blue-500 to-cyan-500" },
                { emoji: "🏟️", value: "89", label: "Courts", color: "from-green-500 to-emerald-500" },
                { emoji: "📅", value: "3,421", label: "Bookings", color: "from-purple-500 to-pink-500" },
                { emoji: "💰", value: "₨2.8M", label: "Revenue", color: "from-orange-500 to-yellow-500" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all hover:scale-105"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`text-5xl mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.emoji}
                  </div>
                  <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-3xl p-8 border border-green-500/30">
                <div className="text-6xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold mb-2">Secure Auth</h3>
                <p className="text-gray-400">Better-auth with session management, password reset, and protected routes.</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-3xl p-8 border border-orange-500/30">
                <div className="text-6xl mb-4">💾</div>
                <h3 className="text-2xl font-bold mb-2">Persistent Data</h3>
                <p className="text-gray-400">Turso SQLite database with real-time persistence for matches, messages, and bookings.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-3xl p-8 border border-purple-500/30">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold mb-2">PWA Ready</h3>
                <p className="text-gray-400">Progressive Web App with offline support, service worker, and mobile-first design.</p>
              </div>
            </div>
          </section>

          <section id="features" className="scroll-mt-32">
            <div className="text-center mb-16">
              <span className="text-6xl mb-4 block">⚡</span>
              <h2 className="text-5xl font-black mb-4">Features</h2>
              <p className="text-gray-400 text-lg">Everything you need to connect and play tennis</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={feature.category}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl group-hover:animate-spin">{feature.icon}</span>
                    <h3 className="text-xl font-bold">{feature.category}</h3>
                  </div>
                  <div className="space-y-4">
                    {feature.items.map((item) => (
                      <div key={item.name} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-green-400 text-xs">✓</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-green-500/10 via-orange-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-center">🎨 Design System</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0a1628] border border-green-500 mb-3 flex items-center justify-center">
                    <span className="text-green-400 font-bold">BG</span>
                  </div>
                  <p className="font-medium">Dark Navy</p>
                  <p className="text-xs text-gray-500">#0a1628</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#22c55e] mb-3 flex items-center justify-center">
                    <span className="text-black font-bold">PRI</span>
                  </div>
                  <p className="font-medium">Lime Green</p>
                  <p className="text-xs text-gray-500">#22c55e</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f97316] mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">ACC</span>
                  </div>
                  <p className="font-medium">Clay Orange</p>
                  <p className="text-xs text-gray-500">#f97316</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">TXT</span>
                  </div>
                  <p className="font-medium">White</p>
                  <p className="text-xs text-gray-500">#ffffff</p>
                </div>
              </div>
            </div>
          </section>

          <section id="workflows" className="scroll-mt-32">
            <div className="text-center mb-16">
              <span className="text-6xl mb-4 block">🔄</span>
              <h2 className="text-5xl font-black mb-4">User Flows</h2>
              <p className="text-gray-400 text-lg">Step-by-step journeys through the app</p>
            </div>

            <div className="space-y-8">
              {workflows.map((workflow, wi) => (
                <div key={workflow.title} className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">{workflow.emoji}</span>
                    <h3 className="text-2xl font-bold">{workflow.title}</h3>
                  </div>
                  <div className="grid md:grid-cols-5 gap-4">
                    {workflow.steps.map((step, si) => (
                      <div key={step.step} className="relative">
                        <div className="bg-gradient-to-b from-green-500/20 to-transparent rounded-2xl p-4 border border-green-500/20 hover:border-green-500/50 transition-all">
                          <div className="w-10 h-10 rounded-full bg-green-500 text-black font-bold flex items-center justify-center mb-3">
                            {step.step}
                          </div>
                          <div className="text-3xl mb-2">{step.icon}</div>
                          <h4 className="font-bold mb-1">{step.title}</h4>
                          <p className="text-sm text-gray-400">{step.desc}</p>
                        </div>
                        {si < workflow.steps.length - 1 && (
                          <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-green-500">
                            →
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white/5 rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🏗️</span> System Architecture
              </h3>
              <div className="bg-[#0a1628] rounded-2xl p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400">{`
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │   /     │  │Courts   │  │Matches  │  │Profile  │           │
│  │ Discover│  │         │  │         │  │         │           │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │
└───────┼────────────┼───────────┼────────────┼─────────────────┘
        │            │           │            │
        └────────────┴─────┬─────┴────────────┘
                          │
                    ┌─────▼─────┐
                    │  API Layer │
                    │  Next.js   │
                    └─────┬─────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐     ┌─────▼─────┐    ┌─────▼─────┐
   │ better- │     │   Turso    │    │  Local     │
   │  auth   │     │   SQLite   │    │  Storage   │
   └─────────┘     └───────────┘    └───────────┘
                `}</pre>
              </div>
            </div>
          </section>

          <section id="usecases" className="scroll-mt-32">
            <div className="text-center mb-16">
              <span className="text-6xl mb-4 block">💡</span>
              <h2 className="text-5xl font-black mb-4">Use Cases</h2>
              <p className="text-gray-400 text-lg">Real-world scenarios the app solves</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {useCases.map((uc, i) => (
                <div
                  key={uc.title}
                  className="bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{uc.emoji}</span>
                    <h3 className="text-xl font-bold">{uc.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-6">{uc.desc}</p>
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-2">USER FLOW</p>
                    <p className="text-green-400 font-medium">{uc.flow}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-orange-500/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🎯</span> Key Differentiators
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Pakistan-First", desc: "Built specifically for Pakistani cities, payment methods, and tennis culture" },
                  { title: "Swipe Discovery", desc: "Modern Tinder-style matching instead of boring search forms" },
                  { title: "Booking + Social", desc: "Combine court bookings with player discovery in one app" },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-orange-400">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="admin" className="scroll-mt-32">
            <div className="text-center mb-16">
              <span className="text-6xl mb-4 block">🛡️</span>
              <h2 className="text-5xl font-black mb-4">Admin Panel</h2>
              <p className="text-gray-400 text-lg">Complete backend management system</p>
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">🔑</span>
                <div>
                  <h3 className="text-xl font-bold">Secure Admin Access</h3>
                  <p className="text-gray-400 text-sm">HMAC-signed tokens with 24-hour expiry</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
                <p className="text-gray-500">Route: /admin-login</p>
                <p className="text-green-400">Auth: TCP-ADMIN-TOKEN (signed)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{feature.emoji}</span>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{feature.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.capabilities.map((cap) => (
                      <span key={cap} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-bold mb-4">📊 Admin Dashboard</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">1247</p>
                    <p className="text-xs text-gray-400">Total Players</p>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">89</p>
                    <p className="text-xs text-gray-400">Active Courts</p>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">3421</p>
                    <p className="text-xs text-gray-400">Bookings</p>
                  </div>
                  <div className="bg-orange-500/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-orange-400">₨2.8M</p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-bold mb-4">🗄️ Database Schema</h4>
                <div className="space-y-2 font-mono text-sm">
                  {["user_profiles", "courts", "bookings", "matches", "messages", "swipes", "contacts"].map((table) => (
                    <div key={table} className="flex items-center gap-2">
                      <span className="text-green-400">table</span>
                      <span className="text-white">{table}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="technical" className="scroll-mt-32">
            <div className="text-center mb-16">
              <span className="text-6xl mb-4 block">⚙️</span>
              <h2 className="text-5xl font-black mb-4">Technical Stack</h2>
              <p className="text-gray-400 text-lg">Built with modern, production-ready technologies</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {techStack.map((tech) => (
                <div key={tech.category} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="font-bold mb-4 text-green-400">{tech.category}</h3>
                  <div className="space-y-2">
                    {tech.items.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="text-green-500">▹</span>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">📡</span> API Endpoints
              </h3>
              <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
                {[
                  { method: "GET", path: "/api/courts", desc: "List courts" },
                  { method: "GET", path: "/api/players", desc: "List players" },
                  { method: "GET", path: "/api/discover", desc: "Discover feed" },
                  { method: "GET/POST", path: "/api/bookings", desc: "Manage bookings" },
                  { method: "GET/POST", path: "/api/profile", desc: "User profile" },
                  { method: "GET/POST", path: "/api/matches", desc: "Match management" },
                  { method: "POST", path: "/api/messages", desc: "Send messages" },
                  { method: "POST", path: "/api/swipes", desc: "Record swipes" },
                  { method: "POST", path: "/api/contact", desc: "Submit inquiry" },
                  { method: "POST", path: "/api/forgot-password", desc: "Password reset" },
                ].map((endpoint) => (
                  <div key={endpoint.path} className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      endpoint.method === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-gray-300 flex-1">{endpoint.path}</span>
                    <span className="text-gray-500">{endpoint.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl p-8 border border-green-500/20">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="text-4xl">🚀</span> Getting Started
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
                  <p className="text-gray-500 mb-2"># Clone & Install</p>
                  <p className="text-green-400">git clone &lt;repo&gt;</p>
                  <p className="text-green-400">npm install</p>
                  <p className="text-gray-500 mt-4 mb-2"># Environment</p>
                  <p className="text-yellow-400">TURSO_DATABASE_URL=...</p>
                  <p className="text-yellow-400">TURSO_AUTH_TOKEN=...</p>
                  <p className="text-yellow-400">ADMIN_PASSWORD=...</p>
                  <p className="text-gray-500 mt-4 mb-2"># Run</p>
                  <p className="text-green-400">npm run dev</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="font-bold mb-2">🌐 Live Demo</h4>
                    <Link href="/" className="text-green-400 hover:underline">playplan.vercel.app</Link>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="font-bold mb-2">🛡️ Admin Panel</h4>
                    <Link href="/admin-login" className="text-orange-400 hover:underline">/admin-login</Link>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="font-bold mb-2">📱 Mobile Ready</h4>
                    <p className="text-gray-400 text-sm">Install as PWA for best experience</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center py-12 border-t border-white/10">
            <div className="text-6xl mb-4">🎾</div>
            <h2 className="text-3xl font-black mb-2">PlayPlan</h2>
            <p className="text-gray-400 mb-6">Growing the tennis community, one match at a time.</p>
            <div className="flex justify-center gap-4">
              <Link href="/" className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors">
                Open App →
              </Link>
              <Link href="/admin-login" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                Admin Panel
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-8">
              Built with Next.js, React, TypeScript, Tailwind CSS, better-auth, and Turso
            </p>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
