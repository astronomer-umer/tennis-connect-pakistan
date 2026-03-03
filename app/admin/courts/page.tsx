"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { cities } from "@/data";

interface Court {
  id: string;
  name: string;
  city: string;
  surface: string;
  surfaces: string;
  price_per_hour: number;
  photo: string;
  distance: string;
  total_courts: number;
  amenities: string;
  is_open: number;
  open_time: string;
  close_time: string;
  featured: number;
}

export default function AdminCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "Lahore",
    surface: "Hard",
    surfaces: "Hard",
    pricePerHour: 1000,
    photo: "",
    distance: "0 km",
    totalCourts: 1,
    amenities: "",
    isOpen: true,
    openTime: "06:00",
    closeTime: "22:00",
    featured: false,
  });

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    const res = await fetch("/api/admin/courts");
    const data = await res.json();
    setCourts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = "/api/admin/courts";
    const method = editingCourt ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingCourt ? { id: editingCourt.id, ...formData } : formData),
    });
    
    setShowModal(false);
    setEditingCourt(null);
    resetForm();
    loadCourts();
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      city: court.city,
      surface: court.surface,
      surfaces: court.surfaces,
      pricePerHour: court.price_per_hour,
      photo: court.photo || "",
      distance: court.distance,
      totalCourts: court.total_courts,
      amenities: court.amenities,
      isOpen: court.is_open === 1,
      openTime: court.open_time,
      closeTime: court.close_time,
      featured: court.featured === 1,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this court?")) return;
    await fetch(`/api/admin/courts?id=${id}`, { method: "DELETE" });
    loadCourts();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      city: "Lahore",
      surface: "Hard",
      surfaces: "Hard",
      pricePerHour: 1000,
      photo: "",
      distance: "0 km",
      totalCourts: 1,
      amenities: "",
      isOpen: true,
      openTime: "06:00",
      closeTime: "22:00",
      featured: false,
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Courts</h2>
        <button onClick={() => { resetForm(); setEditingCourt(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand text-black rounded-lg font-bold hover:bg-brand/90">
          <Plus size={20} /> Add Court
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Surface</th>
              <th className="px-4 py-3 text-left">Price/hr</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr key={court.id} className="border-t border-gray-700">
                <td className="px-4 py-3">{court.name}</td>
                <td className="px-4 py-3">{court.city}</td>
                <td className="px-4 py-3">{court.surface}</td>
                <td className="px-4 py-3">Rs.{court.price_per_hour}</td>
                <td className="px-4 py-3">
                  {court.is_open ? <span className="text-green-400">Open</span> : <span className="text-red-400">Closed</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(court)} className="text-blue-400 hover:text-blue-300 mr-3"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(court.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingCourt ? "Edit Court" : "Add New Court"}</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Court Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" required />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                <input type="url" value={formData.photo} onChange={(e) => setFormData({...formData, photo: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" placeholder="https://example.com/court-image.jpg" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <select value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg">
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Surface</label>
                  <select value={formData.surface} onChange={(e) => setFormData({...formData, surface: e.target.value, surfaces: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg">
                    <option value="Hard">Hard</option>
                    <option value="Grass">Grass</option>
                    <option value="Clay">Clay</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price per Hour (Rs)</label>
                  <input type="number" value={formData.pricePerHour} onChange={(e) => setFormData({...formData, pricePerHour: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Total Courts</label>
                  <input type="number" value={formData.totalCourts} onChange={(e) => setFormData({...formData, totalCourts: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Open Time</label>
                  <input type="text" value={formData.openTime} onChange={(e) => setFormData({...formData, openTime: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Close Time</label>
                  <input type="text" value={formData.closeTime} onChange={(e) => setFormData({...formData, closeTime: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Distance</label>
                <input type="text" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" placeholder="e.g. 5.2 km" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Amenities (comma separated)</label>
                <input type="text" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} className="w-full px-4 py-2 bg-gray-700 rounded-lg" placeholder="Parking, Floodlights, Cafe" />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isOpen} onChange={(e) => setFormData({...formData, isOpen: e.target.checked})} />
                  <span>Is Open</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />
                  <span>Featured</span>
                </label>
              </div>

              <button type="submit" className="w-full py-3 bg-brand text-black font-bold rounded-lg hover:bg-brand/90">
                {editingCourt ? "Update Court" : "Add Court"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
