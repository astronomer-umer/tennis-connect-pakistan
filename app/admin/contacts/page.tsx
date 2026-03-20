"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Filter, Trash2, Mail, Phone, MapPin, Briefcase, User } from "lucide-react";
import { cities } from "@/data";

interface Contact {
  id: string;
  name: string;
  phone: string;
  city: string;
  professional_status: string;
  age_group: string;
  message: string;
  created_at: number;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadContacts = async () => {
    const res = await fetch("/api/admin/contacts");
    const data = await res.json();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = searchQuery === "" || 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        contact.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = cityFilter === "All" || contact.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [contacts, searchQuery, cityFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
    loadContacts();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Contact Submissions</h2>
          <p className="text-gray-400 text-sm mt-1">Inquiries from new users</p>
        </div>
        <span className="text-gray-400">{filteredContacts.length} of {contacts.length} submissions</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or message..."
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
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-brand/50 transition-colors"
          >
            <button
              onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{contact.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {contact.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {contact.professional_status}
                      </span>
                      <span>{contact.age_group}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {format(new Date(contact.created_at * 1000), "dd MMM yyyy")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact.id);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-3 line-clamp-2">{contact.message}</p>
            </button>

            {expandedId === contact.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-700 bg-gray-850">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <a href={`tel:${contact.phone}`} className="text-white hover:text-brand">
                        {contact.phone || "Not provided"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Contact Method</p>
                      <p className="text-white">Via Phone / WhatsApp</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">Full Message</p>
                  <p className="text-gray-200">{contact.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-xl">
          No contact submissions found
        </div>
      )}
    </div>
  );
}
