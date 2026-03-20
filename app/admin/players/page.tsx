"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Edit, Trash2, X, Search, Filter } from "lucide-react";
import { cities } from "@/data";

interface Player {
  id: string;
  user_id: string;
  name: string;
  city: string;
  level: number;
  play_type: string;
  bio: string;
  age: number;
  gender: string;
  wins: number;
  losses: number;
}

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("All");
  const [levelFilter, setLevelFilter] = useState<string>("All");
  const [formData, setFormData] = useState({
    name: "",
    city: "Lahore",
    level: 3.5,
    playType: "Both",
    bio: "",
    age: 25,
    gender: "M",
    wins: 0,
    losses: 0,
  });

  const loadPlayers = async () => {
    const res = await fetch("/api/admin/players");
    const data = await res.json();
    setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch = searchQuery === "" || 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = cityFilter === "All" || player.city === cityFilter;
      const matchesLevel = levelFilter === "All" || player.level.toString() === levelFilter;
      return matchesSearch && matchesCity && matchesLevel;
    });
  }, [players, searchQuery, cityFilter, levelFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = "/api/admin/players";
    const method = editingPlayer ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingPlayer ? { id: editingPlayer.id, ...formData } : formData),
    });
    
    setShowModal(false);
    setEditingPlayer(null);
    resetForm();
    loadPlayers();
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      city: player.city,
      level: player.level,
      playType: player.play_type,
      bio: player.bio,
      age: player.age,
      gender: player.gender,
      wins: player.wins,
      losses: player.losses,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this player?")) return;
    await fetch(`/api/admin/players?id=${id}`, { method: "DELETE" });
    loadPlayers();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      city: "Lahore",
      level: 3.5,
      playType: "Both",
      bio: "",
      age: 25,
      gender: "M",
      wins: 0,
      losses: 0,
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Players</h2>
        <button onClick={() => { resetForm(); setEditingPlayer(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand text-black rounded-lg font-bold hover:bg-brand/90">
          <Plus size={20} /> Add Player
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search players..."
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
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand"
        >
          <option value="All">All Levels</option>
          {[2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <span className="flex items-center gap-2 text-gray-400 text-sm">
          <Filter className="w-4 h-4" />
          {filteredPlayers.length} of {players.length}
        </span>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Play Type</th>
              <th className="px-4 py-3 text-left">W/L</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.id} className="border-t border-gray-700">
                <td className="px-4 py-3">{player.name}</td>
                <td className="px-4 py-3">{player.city}</td>
                <td className="px-4 py-3">{player.level}</td>
                <td className="px-4 py-3">{player.play_type}</td>
                <td className="px-4 py-3">{player.wins}W / {player.losses}L</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(player)} className="text-blue-400 hover:text-blue-300 mr-3"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(player.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No players found matching your filters
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingPlayer ? "Edit Player" : "Add New Player"}</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <select value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg">
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({...formData, level: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-gray-700 rounded-lg">
                    {[2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Age</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Gender</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg">
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Play Type</label>
                <select value={formData.playType} onChange={(e) => setFormData({...formData, playType: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg">
                  <option value="Singles">Singles</option>
                  <option value="Doubles">Doubles</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Wins</label>
                  <input type="number" value={formData.wins} onChange={(e) => setFormData({...formData, wins: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Losses</label>
                  <input type="number" value={formData.losses} onChange={(e) => setFormData({...formData, losses: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Bio</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" rows={3} />
              </div>

              <button type="submit" className="w-full py-3 bg-brand text-black font-bold rounded-lg hover:bg-brand/90">
                {editingPlayer ? "Update Player" : "Add Player"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
