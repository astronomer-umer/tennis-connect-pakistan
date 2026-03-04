"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

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

  const loadBookings = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (!cancelled) {
        setBookings(data);
        setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

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
        <span className="text-gray-400">{bookings.length} total bookings</span>
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
            {bookings.map((booking) => (
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

      {bookings.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No bookings yet
        </div>
      )}
    </div>
  );
}

function Trash2({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  );
}
