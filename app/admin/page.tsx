"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Users, Calendar, TrendingUp } from "lucide-react";

interface CourtData {
  id: string;
  name: string;
}

interface PlayerData {
  id: string;
  name: string;
}

interface BookingData {
  id: string;
  total_cost: number;
}

interface Stats {
  courts: number;
  players: number;
  bookings: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ courts: 0, players: 0, bookings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/courts").then(r => r.json()),
      fetch("/api/admin/players").then(r => r.json()),
      fetch("/api/admin/bookings").then(r => r.json()),
    ]).then(([courts, players, bookings]) => {
      const courtsData = courts as CourtData[];
      const playersData = players as PlayerData[];
      const bookingsData = bookings as BookingData[];
      const revenue = bookingsData.reduce((sum: number, b: BookingData) => sum + (b.total_cost || 0), 0);
      setStats({
        courts: courtsData.length,
        players: playersData.length,
        bookings: bookingsData.length,
        totalRevenue: revenue,
      });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total Courts", value: stats.courts, icon: Building2, color: "text-blue-400" },
    { label: "Total Players", value: stats.players, icon: Users, color: "text-green-400" },
    { label: "Total Bookings", value: stats.bookings, icon: Calendar, color: "text-purple-400" },
    { label: "Total Revenue", value: `Rs.${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-yellow-400" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`${card.color}`} size={24} />
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-gray-400 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Link href="/admin/courts" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Manage Courts</Link>
          <Link href="/admin/players" className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">Manage Players</Link>
          <Link href="/admin/bookings" className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">View Bookings</Link>
        </div>
      </div>
    </div>
  );
}
