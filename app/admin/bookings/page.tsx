"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Check, X, Search, Filter, Trash2 } from "lucide-react";
import { cities } from "@/data";

interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  court_name: string;
  city: string;
  surface: string;
  date: string;
  time: string;
  duration_hours: number;
  payment: string;
  total_cost: number;
  status: string;
  booked_at: number;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const loadBookings = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = searchQuery === "" || 
        booking.court_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = cityFilter === "All" || booking.city === cityFilter;
      const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [bookings, searchQuery, cityFilter, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadBookings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    loadBookings();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
        <span className="text-gray-400">{filteredBookings.length} of {bookings.length} bookings</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-brand"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand"
        >
          <option value="All">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand"
        >
          <option value="All">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="flex items-center gap-2 text-gray-400 text-sm">
          <Filter className="w-4 h-4" />
        </span>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Court</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Cost</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-700">
                <td className="px-4 py-3">{booking.court_name}</td>
                <td className="px-4 py-3">{booking.city}</td>
                <td className="px-4 py-3">{format(new Date(booking.date), "dd MMM yyyy")}</td>
                <td className="px-4 py-3">{booking.time}</td>
                <td className="px-4 py-3">Rs.{booking.total_cost}</td>
                <td className="px-4 py-3">
                  {booking.status === "confirmed" ? (
                    <span className="text-green-400">Confirmed</span>
                  ) : booking.status === "pending" ? (
                    <span className="text-yellow-400">Pending</span>
                  ) : (
                    <span className="text-red-400">Cancelled</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {booking.status !== "confirmed" && (
                    <button onClick={() => updateStatus(booking.id, "confirmed")} className="text-green-400 hover:text-green-300 mr-3">
                      <Check size={18} />
                    </button>
                  )}
                  {booking.status !== "cancelled" && (
                    <button onClick={() => updateStatus(booking.id, "cancelled")} className="text-red-400 hover:text-red-300 mr-3">
                      <X size={18} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(booking.id)} className="text-gray-400 hover:text-gray-300">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No bookings found matching your filters
        </div>
      )}
    </div>
  );
}
