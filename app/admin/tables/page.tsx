"use client";

import { useState, useEffect } from "react";
import { PrettyTable, PrettyTableColumn } from "@/components/ui/pretty-table";
import { MarkdownTable } from "@/components/ui/markdown-table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Trophy,
  Star,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  age: number;
  city: string;
  level: number;
  wins: number;
  losses: number;
  status: "active" | "inactive" | "new";
}

interface Court {
  id: string;
  name: string;
  city: string;
  surface: string;
  price: number;
  courts: number;
  rating: number;
  status: "open" | "closed" | "busy";
}

interface Booking {
  id: string;
  player: string;
  court: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: "confirmed" | "pending" | "cancelled";
}

const demoPlayers: Player[] = [
  { id: "1", name: "Ahmed Khan", age: 28, city: "Lahore", level: 4.0, wins: 45, losses: 12, status: "active" },
  { id: "2", name: "Fatima Ali", age: 24, city: "Karachi", level: 3.5, wins: 32, losses: 18, status: "active" },
  { id: "3", name: "Hassan Tariq", age: 31, city: "Islamabad", level: 4.5, wins: 67, losses: 15, status: "active" },
  { id: "4", name: "Ayesha Malik", age: 22, city: "Lahore", level: 3.0, wins: 18, losses: 22, status: "new" },
  { id: "5", name: "Usman Sheikh", age: 35, city: "Faisalabad", level: 4.0, wins: 52, losses: 28, status: "inactive" },
  { id: "6", name: "Sara Imran", age: 26, city: "Rawalpindi", level: 3.5, wins: 29, losses: 14, status: "active" },
];

const demoCourts: Court[] = [
  { id: "1", name: "Gulberg Tennis Club", city: "Lahore", surface: "Hard", price: 2500, courts: 4, rating: 4.8, status: "open" },
  { id: "2", name: "DHA Sports Complex", city: "Karachi", surface: "Hard", price: 3500, courts: 6, rating: 4.9, status: "busy" },
  { id: "3", name: "F-6 Sports Center", city: "Islamabad", surface: "Clay", price: 2000, courts: 2, rating: 4.5, status: "open" },
  { id: "4", name: "Askari Club Courts", city: "Lahore", surface: "Grass", price: 4000, courts: 3, rating: 4.7, status: "closed" },
  { id: "5", name: " Clifton Tennis", city: "Karachi", surface: "Hard", price: 3000, courts: 5, rating: 4.6, status: "open" },
];

const demoBookings: Booking[] = [
  { id: "1", player: "Ahmed Khan", court: "Gulberg Tennis Club", date: "Mar 25", time: "09:00", duration: 2, amount: 5000, status: "confirmed" },
  { id: "2", player: "Fatima Ali", court: "DHA Sports Complex", date: "Mar 25", time: "14:00", duration: 1, amount: 3500, status: "pending" },
  { id: "3", player: "Hassan Tariq", court: "F-6 Sports Center", date: "Mar 26", time: "10:00", duration: 2, amount: 4000, status: "confirmed" },
  { id: "4", player: "Sara Imran", court: "Clifton Tennis", date: "Mar 26", time: "16:00", duration: 1, amount: 3000, status: "cancelled" },
  { id: "5", player: "Usman Sheikh", court: "Askari Club Courts", date: "Mar 27", time: "08:00", duration: 3, amount: 12000, status: "confirmed" },
];

const playerColumns: PrettyTableColumn<Player>[] = [
  {
    key: "name",
    header: "Player",
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
          {item.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.city}</p>
        </div>
      </div>
    ),
  },
  {
    key: "age",
    header: "Age",
    align: "center",
    render: (item) => <span className="text-muted-foreground">{item.age}</span>,
  },
  {
    key: "level",
    header: "Level",
    align: "center",
    render: (item) => (
      <Badge variant="outline" className="border-primary text-primary font-mono">
        {item.level}
      </Badge>
    ),
  },
  {
    key: "record",
    header: "Record",
    align: "center",
    render: (item) => (
      <div className="flex items-center justify-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <span className="font-mono text-sm">
          <span className="text-green-400">{item.wins}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-red-400">{item.losses}</span>
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (item) => {
      const styles = {
        active: "bg-green-500/20 text-green-400 border-green-500/30",
        inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
      return (
        <Badge className={styles[item.status as keyof typeof styles]}>
          {item.status}
        </Badge>
      );
    },
  },
];

const courtColumns: PrettyTableColumn<Court>[] = [
  {
    key: "name",
    header: "Court",
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {item.city}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "surface",
    header: "Surface",
    align: "center",
    render: (item) => (
      <Badge variant="secondary">{item.surface}</Badge>
    ),
  },
  {
    key: "price",
    header: "Price/hr",
    align: "right",
    render: (item) => (
      <span className="font-mono text-accent">Rs.{item.price.toLocaleString()}</span>
    ),
  },
  {
    key: "courts",
    header: "Courts",
    align: "center",
    render: (item) => <span className="font-mono">{item.courts}</span>,
  },
  {
    key: "rating",
    header: "Rating",
    align: "center",
    render: (item) => (
      <div className="flex items-center justify-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="font-mono">{item.rating}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (item) => {
      const styles = {
        open: "bg-green-500/20 text-green-400",
        closed: "bg-red-500/20 text-red-400",
        busy: "bg-yellow-500/20 text-yellow-400",
      };
      return (
        <Badge className={styles[item.status as keyof typeof styles]}>
          <Clock className="w-3 h-3 mr-1" />
          {item.status}
        </Badge>
      );
    },
  },
];

const bookingColumns: PrettyTableColumn<Booking>[] = [
  {
    key: "player",
    header: "Player",
    render: (item) => (
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{item.player}</span>
      </div>
    ),
  },
  {
    key: "court",
    header: "Court",
    render: (item) => (
      <div className="text-sm">
        <p>{item.court}</p>
        <p className="text-xs text-muted-foreground">{item.date} at {item.time}</p>
      </div>
    ),
  },
  {
    key: "duration",
    header: "Duration",
    align: "center",
    render: (item) => (
      <Badge variant="outline">{item.duration}hr</Badge>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (item) => (
      <span className="font-mono font-semibold text-primary">
        Rs.{item.amount.toLocaleString()}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (item) => {
      const styles = {
        confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      };
      return (
        <Badge className={styles[item.status as keyof typeof styles]}>
          {item.status}
        </Badge>
      );
    },
  },
];

const markdownTableData = {
  headers: ["Rank", "Player", "Matches", "Win Rate", "Points"],
  rows: [
    ["1", "Hassan Tariq", "82", "78%", "2450"],
    ["2", "Ahmed Khan", "57", "79%", "1820"],
    ["3", "Usman Sheikh", "80", "65%", "1680"],
    ["4", "Fatima Ali", "50", "64%", "1450"],
    ["5", "Sara Imran", "43", "67%", "1320"],
  ],
};

export default function AdminTablesPage() {
  const [activeTab, setActiveTab] = useState<"pretty" | "markdown" | "stats">("pretty");
  const [animatedStats, setAnimatedStats] = useState({ players: 0, courts: 0, bookings: 0, revenue: 0 });

  useEffect(() => {
    const targets = { players: 1247, courts: 89, bookings: 3421, revenue: 2850000 };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        players: Math.round(targets.players * eased),
        courts: Math.round(targets.courts * eased),
        bookings: Math.round(targets.bookings * eased),
        revenue: Math.round(targets.revenue * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            Table Showcase
          </h1>
          <p className="text-muted-foreground mt-1">
            Beautiful, animated tables for displaying your tennis data
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
        {[
          { id: "pretty", label: "Pretty Tables", icon: Zap },
          { id: "markdown", label: "Markdown Style", icon: Star },
          { id: "stats", label: "Stats Cards", icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Players", value: animatedStats.players, icon: Users, color: "text-blue-400", bg: "bg-blue-500/20" },
            { label: "Active Courts", value: animatedStats.courts, icon: Building2, color: "text-green-400", bg: "bg-green-500/20" },
            { label: "Total Bookings", value: animatedStats.bookings, icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/20" },
            { label: "Revenue", value: `Rs.${(animatedStats.revenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-500/20" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <ChevronUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "pretty" && (
        <div className="space-y-8">
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Players Table
            </h2>
            <PrettyTable
              columns={playerColumns}
              data={demoPlayers}
              variant="glass"
              striped
              hoverable
              animate
              animationDelay={80}
              keyExtractor={(item) => item.id}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Courts Table
            </h2>
            <PrettyTable
              columns={courtColumns}
              data={demoCourts}
              variant="default"
              striped
              hoverable
              animate
              animationDelay={80}
              keyExtractor={(item) => item.id}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Bookings Table
            </h2>
            <PrettyTable
              columns={bookingColumns}
              data={demoBookings}
              variant="glass"
              striped
              hoverable
              animate
              animationDelay={80}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {activeTab === "markdown" && (
        <div className="space-y-8">
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Default Variant</h2>
            <MarkdownTable
              headers={markdownTableData.headers}
              rows={markdownTableData.rows}
              variant="default"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
            <h2 className="text-xl font-bold mb-4">Bordered Variant</h2>
            <MarkdownTable
              headers={markdownTableData.headers}
              rows={markdownTableData.rows}
              variant="bordered"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <h2 className="text-xl font-bold mb-4">Fancy Variant</h2>
            <MarkdownTable
              headers={markdownTableData.headers}
              rows={markdownTableData.rows}
              variant="fancy"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-fade-in" style={{ animationDelay: "450ms" }}>
              <h2 className="text-xl font-bold mb-4">Leaderboard (Compact)</h2>
              <MarkdownTable
                headers={["#", "Player", "W-L", "Pts"]}
                rows={[
                  ["1", "Hassan T.", "64-18", "2450"],
                  ["2", "Ahmed K.", "45-12", "1820"],
                  ["3", "Usman S.", "52-28", "1680"],
                  ["4", "Fatima A.", "32-18", "1450"],
                  ["5", "Sara I.", "29-14", "1320"],
                ]}
                variant="fancy"
                striped={false}
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
              <h2 className="text-xl font-bold mb-4">Surface Stats</h2>
              <MarkdownTable
                headers={["Surface", "Courts", "Avg Price", "Popularity"]}
                rows={[
                  ["Hard", "45", "Rs.2,800", "85%"],
                  ["Clay", "28", "Rs.1,900", "10%"],
                  ["Grass", "16", "Rs.3,500", "5%"],
                ]}
                variant="default"
                hoverable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
