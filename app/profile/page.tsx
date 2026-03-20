"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  User,
  MapPin,
  Trophy,
  Calendar,
  Edit3,
  Check,
  LogOut,
  Save,
  Camera,
  X,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cities } from "@/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth/client";
import { getProfile, updateProfile, getBookings } from "@/lib/api";
import { TennisBallLogo } from "@/components/providers/TennisIcons";

const LEVEL_LABELS: Record<number, string> = {
  2.5: "Beginner",
  3.0: "Novice",
  3.5: "Intermediate",
  4.0: "Advanced",
  4.5: "Expert",
  5.0: "Pro",
};

const PLAY_TYPES = ["Singles", "Doubles", "Both"] as const;

interface ProfileData {
  name: string;
  email?: string;
  city: string;
  level: number;
  playType: string;
  bio: string;
  age?: number;
  gender?: string;
  wins: number;
  losses: number;
  goldenSets: number;
  preferredCities: string[];
  photoUrl?: string | null;
}

interface Booking {
  id: string;
  courtName: string;
  city: string;
  surface: string;
  date: string;
  time: string;
  durationHours: number;
  payment: string;
  totalCost: number;
  status: string;
  bookedAt: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    city: "Lahore",
    level: 3.5,
    playType: "Both",
    bio: "",
    wins: 0,
    losses: 0,
    goldenSets: 0,
    preferredCities: [],
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session?.user) return;
    
    Promise.all([
      getProfile().catch(() => null),
      getBookings().catch(() => [])
    ]).then(([profileData, bookingsData]) => {
      if (profileData) {
        setProfile(profileData);
        setNameInput(profileData.name || "");
      }
      setBookings(bookingsData || []);
      setLoading(false);
    });
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: profile.name,
        city: profile.city,
        level: profile.level,
        playType: profile.playType,
        bio: profile.bio,
        age: profile.age,
        gender: profile.gender,
        preferredCities: profile.preferredCities,
        photoUrl: profile.photoUrl,
      });
      setEditingName(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveName = () => {
    if (nameInput.trim()) {
      setProfile({ ...profile, name: nameInput.trim() });
      saveProfile();
    }
    setEditingName(false);
  };

  const updateField = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleFieldChange = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    updateField(field, value);
  };

  const handleFieldBlur = () => {
    saveProfile();
  };

  const toggleCity = (city: string) => {
    const current = profile.preferredCities || [];
    const next = current.includes(city)
      ? current.filter((c) => c !== city)
      : [...current, city];
    updateField("preferredCities", next.length ? next : [city]);
    saveProfile();
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const res = await fetch(`/api/bookings?id=${bookingId}`, { method: "DELETE" });
      if (res.ok) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        ));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const levelValue = [profile.level];
  const levelLabel = LEVEL_LABELS[profile.level] ?? "Intermediate";

  // Unauthenticated users: show sign-up prompt
  if (!session?.user) {
    return (
      <div className="flex flex-col min-h-dvh bg-background pb-tab items-center justify-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center mb-6 lime-glow">
          <TennisBallLogo size={52} />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2 text-center">Your Profile</h2>
        <p className="text-muted-foreground text-center mb-8 max-w-xs">
          Sign up to create your tennis profile, track your stats, and connect with other players.
        </p>
        <div className="flex gap-4 w-full max-w-xs">
          <Link
            href="/signup"
            className="flex-1 py-4 bg-lime-400 text-black font-bold rounded-2xl text-center text-lg"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="flex-1 py-4 border-2 border-border text-foreground font-bold rounded-2xl text-center text-lg hover:bg-card transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-dvh bg-background pb-tab items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm mt-4">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-tab">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <User size={18} className="text-brand" />
          <h1 className="text-white font-black text-xl tracking-tight">Profile</h1>
        </div>
      </header>

      <div className="px-4 mt-5 space-y-5 pb-6">
        {/* ── Avatar + Name ── */}
        <div className="flex items-center gap-4 bg-surface border border-line rounded-2xl p-4">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="relative group shrink-0"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-brand/15 border-2 border-brand/40 flex items-center justify-center shadow-[0_0_16px_#00ff9d25] transition-all group-hover:border-brand/70">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-brand text-2xl font-black">
                  {(profile.name || profile.email?.charAt(0) || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-brand flex items-center justify-center border-2 border-[var(--surface)] shadow">
              <Camera size={10} className="text-pit" />
            </div>
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 500 * 1024) {
                alert("Photo must be under 500KB.");
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                const newProfile = { ...profile, photoUrl: reader.result as string };
                setProfile(newProfile);
                // Auto-save the photo
                updateProfile({
                  name: newProfile.name,
                  city: newProfile.city,
                  level: newProfile.level,
                  playType: newProfile.playType,
                  bio: newProfile.bio,
                  age: newProfile.age,
                  gender: newProfile.gender,
                  preferredCities: newProfile.preferredCities,
                  photoUrl: newProfile.photoUrl,
                }).catch(console.error);
              };
              reader.readAsDataURL(file);
            }}
          />
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  autoFocus
                  className="flex-1 bg-surface-2 border border-brand/60 rounded-xl px-3 py-1.5 text-sm text-foreground focus:outline-none"
                />
                <button onClick={saveName} className="text-brand">
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-lg truncate">{profile.name || "Set your name"}</p>
                <button onClick={() => { setEditingName(true); setNameInput(profile.name); }} className="text-muted-foreground">
                  <Edit3 size={13} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-brand" />
              <p className="text-muted-foreground text-xs">{profile.city}</p>
            </div>
          </div>

          {profile.goldenSets > 0 && (
            <div className="flex flex-col items-center shrink-0">
              <div className="w-12 h-12 rounded-full bg-yellow-500/15 border-2 border-yellow-500/50 flex items-center justify-center">
                <Trophy size={20} className="text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-[9px] font-bold mt-1">
                {profile.goldenSets}× 6-0
              </p>
            </div>
          )}
        </div>

        {/* ── Level Slider ── */}
        <div className="bg-surface border border-line rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground font-bold text-sm">My Level</h2>
            <div className="flex items-center gap-2">
              <span className="text-brand font-black text-lg">{profile.level}</span>
              <span className="text-muted-foreground text-xs bg-surface-2 px-2 py-0.5 rounded-lg">
                {levelLabel}
              </span>
            </div>
          </div>

          <Slider
            min={2.5}
            max={5.0}
            step={0.5}
            value={levelValue}
            onValueChange={([val]) => handleFieldChange("level", val)}
            onValueCommit={() => handleFieldBlur()}
            className="w-full"
          />

          <div className="flex justify-between mt-2">
            {[2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((l) => (
              <span key={l} className={`text-[9px] font-bold ${l === profile.level ? "text-brand" : "text-zinc-600"}`}>
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* ── Play Type ── */}
        <div className="bg-surface border border-line rounded-2xl p-4">
          <h2 className="text-foreground font-bold text-sm mb-3">Preferred Play</h2>
          <div className="flex gap-2">
            {PLAY_TYPES.map((pt) => (
              <button
                key={pt}
                onClick={() => { handleFieldChange("playType", pt); saveProfile(); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  profile.playType === pt
                    ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d30]"
                    : "bg-surface-2 text-muted-foreground border-line"
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* ── Preferred Cities ── */}
        <div className="bg-surface border border-line rounded-2xl p-4">
          <h2 className="text-foreground font-bold text-sm mb-3">Preferred Cities</h2>
          <div className="flex gap-2 flex-wrap">
            {cities.map((city) => {
              const active = (profile.preferredCities || []).includes(city);
              return (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? "bg-brand text-pit border-brand shadow-[0_0_8px_#00ff9d30]"
                      : "bg-surface-2 text-muted-foreground border-line hover:border-brand/40"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Bookings History ── */}
        <div className="bg-surface border border-line rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-line flex items-center gap-2">
            <Calendar size={15} className="text-brand" />
            <h2 className="text-foreground font-bold text-sm">Booking History</h2>
            <span className="ml-auto text-muted-foreground text-xs">{bookings.length} bookings</span>
          </div>

          {bookings.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-muted-foreground text-sm">No bookings yet.</p>
              <p className="text-muted-foreground text-xs mt-1">
                Head to <strong className="text-brand">Courts</strong> and book your first session!
              </p>
            </div>
          ) : (
            bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between px-4 py-3 border-b border-line last:border-0"
              >
                <div>
                  <p className="text-foreground text-sm font-semibold leading-tight">
                    {booking.courtName}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {format(new Date(booking.date), "dd MMM yyyy")} · {booking.time}
                  </p>
                  <p className="text-muted-foreground text-[10px] mt-0.5">
                    {booking.payment} · {booking.durationHours}h
                  </p>
                </div>
                <div className="text-right flex items-center gap-2">
                  {booking.status === "cancelled" ? (
                    <div className="text-right">
                      <p className="text-red-400 text-sm font-semibold">Cancelled</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-right">
                        <p className="text-brand font-black text-sm">
                          Rs.{booking.totalCost.toLocaleString()}
                        </p>
                        <span className="text-brand text-[10px] font-bold">✓ Confirmed</span>
                      </div>
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Cancel booking"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Level", value: profile.level },
            { label: "Bookings", value: bookings.length },
            { label: "Golden Sets", value: profile.goldenSets },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-surface border border-line rounded-2xl p-3 text-center"
            >
              <p className="text-brand font-black text-xl">{value}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Bio ── */}
        <div className="bg-surface border border-line rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-xs font-medium">Bio</p>
            <button onClick={saveProfile} disabled={saving} className="text-brand text-xs font-medium flex items-center gap-1">
              <Save size={12} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          <textarea
            value={profile.bio || ""}
            onChange={(e) => handleFieldChange("bio", e.target.value)}
            onBlur={handleFieldBlur}
            placeholder="Tell others about yourself..."
            className="w-full bg-surface-2 border border-line rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand resize-none"
            rows={3}
          />
        </div>

        {/* ── Account Info ── */}
        <div className="bg-surface border border-line rounded-2xl p-4 space-y-3">
          {session?.user && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Email</p>
                <p className="text-foreground text-sm">{session.user.email}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center">
                <span className="text-green-400 text-xs font-bold">✓</span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
