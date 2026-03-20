"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Filter, User, MapPin, Calendar, Trophy, TrendingUp } from "lucide-react";
import { cities } from "@/data";

interface UserData {
  id: string;
  userId: string;
  name: string;
  email: string;
  city: string;
  level: number;
  age: number;
  gender: string;
  bookingCount: number;
  matchCount: number;
  createdAt: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("All");

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = searchQuery === "" || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = cityFilter === "All" || user.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [users, searchQuery, cityFilter]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">User Accounts</h2>
          <p className="text-gray-400 text-sm mt-1">Manage registered users and their activity</p>
        </div>
        <span className="text-gray-400">{filteredUsers.length} of {users.length} users</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
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
        <span className="flex items-center gap-2 text-gray-400 text-sm">
          <Filter className="w-4 h-4" />
        </span>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-brand/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <User className="w-6 h-6 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white">{user.name || "Unnamed User"}</h3>
                    <p className="text-xs text-gray-400 mt-1">{user.userId}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-brand/20 text-brand text-xs rounded-full font-medium">
                      Level {user.level}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{user.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">
                      Joined {format(new Date(user.createdAt), "MMM yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{user.bookingCount} bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{user.matchCount} matches</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-xl">
          No users found
        </div>
      )}
    </div>
  );
}
