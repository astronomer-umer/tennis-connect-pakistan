const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function fetchWithAuth(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  
  return res.json();
}

export async function getCourts(city?: string, featured?: boolean) {
  const params = new URLSearchParams();
  if (city && city !== "All") params.set("city", city);
  if (featured) params.set("featured", "true");
  
  const res = await fetch(`${API_BASE}/api/courts?${params}`, {
    credentials: "include",
  });
  return res.json();
}

export async function getPlayers(city?: string, level?: string, playType?: string) {
  const params = new URLSearchParams();
  if (city && city !== "All") params.set("city", city);
  if (level) params.set("level", level);
  if (playType && playType !== "Both") params.set("playType", playType);
  
  const res = await fetch(`${API_BASE}/api/players?${params}`, {
    credentials: "include",
  });
  return res.json();
}

export async function getDiscover(city?: string) {
  const params = new URLSearchParams();
  if (city && city !== "All") params.set("city", city);
  
  const res = await fetch(`${API_BASE}/api/discover?${params}`, {
    credentials: "include",
  });
  return res.json();
}

export async function getBookings(city?: string) {
  const params = new URLSearchParams();
  if (city && city !== "All") params.set("city", city);
  
  return fetchWithAuth(`${API_BASE}/api/bookings?${params}`);
}

export async function createBooking(booking: {
  courtId: string;
  courtName: string;
  city: string;
  surface: string;
  date: string;
  time: string;
  durationHours: number;
  payment: string;
  totalCost: number;
}) {
  return fetchWithAuth(`${API_BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
}

export async function getProfile() {
  return fetchWithAuth(`${API_BASE}/api/profile`);
}

export async function updateProfile(profile: {
  name: string;
  city: string;
  level: number;
  playType: string;
  bio: string;
  age?: number;
  gender?: string;
  preferredCities?: string[];
}) {
  return fetchWithAuth(`${API_BASE}/api/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
}
