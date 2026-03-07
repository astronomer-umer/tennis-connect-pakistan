"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, ChevronRight, ChevronLeft, User, Camera, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cities } from "@/data";
import { useSession } from "@/lib/auth/client";
import { updateProfile, getProfile } from "@/lib/api";

const LEVEL_LABELS: Record<number, string> = {
  2.5: "Beginner",
  3.0: "Novice",
  3.5: "Intermediate",
  4.0: "Advanced",
  4.5: "Expert",
  5.0: "Pro",
};

// localStorage keys
const ONBOARDING_DATA_KEY = "onboarding_data";
const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

interface OnboardingProfile {
  name: string;
  city: string;
  level: number;
  playType: "Singles" | "Doubles" | "Both";
  bio: string;
  age: number;
  gender: "M" | "F";
  preferredCities: string[];
  photoUrl: string | null;
}

function getLocalOnboardingData(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveLocalOnboardingData(data: OnboardingProfile) {
  localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
}

// ─── Animated Tennis Ball SVG ────────────────────────────────────────────────
function AnimatedTennisBall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ballGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="60%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#3f6212" />
        </radialGradient>
        <filter id="ballGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#ballGrad)" filter="url(#ballGlow)" className="animate-ball-bounce" style={{ transformOrigin: "60px 60px" }} />
      {/* Seam lines */}
      <path d="M 28 35 Q 45 60 28 85" fill="none" stroke="#d9f99d" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <path d="M 92 35 Q 75 60 92 85" fill="none" stroke="#d9f99d" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      {/* Highlight */}
      <ellipse cx="42" cy="38" rx="14" ry="8" fill="white" opacity="0.15" transform="rotate(-25 42 38)" />
    </svg>
  );
}

// ─── Animated Racket SVG ─────────────────────────────────────────────────────
function AnimatedRacket({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 160" className={`animate-racket-swing ${className}`} xmlns="http://www.w3.org/2000/svg" style={{ transformOrigin: "50px 140px" }}>
      <defs>
        <linearGradient id="racketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      {/* Handle */}
      <rect x="44" y="95" width="12" height="55" rx="4" fill="#854d0e" />
      <rect x="44" y="95" width="12" height="55" rx="4" fill="url(#racketGrad)" opacity="0.2" />
      {/* Grip lines */}
      <line x1="44" y1="105" x2="56" y2="105" stroke="#a16207" strokeWidth="1" opacity="0.5" />
      <line x1="44" y1="115" x2="56" y2="115" stroke="#a16207" strokeWidth="1" opacity="0.5" />
      <line x1="44" y1="125" x2="56" y2="125" stroke="#a16207" strokeWidth="1" opacity="0.5" />
      {/* Frame */}
      <ellipse cx="50" cy="45" rx="38" ry="45" fill="none" stroke="url(#racketGrad)" strokeWidth="5" />
      {/* Strings - horizontal */}
      {[20, 30, 40, 50, 60, 70].map((y) => (
        <line key={`h${y}`} x1="16" y1={y} x2="84" y2={y} stroke="#22c55e" strokeWidth="0.8" opacity="0.4" />
      ))}
      {/* Strings - vertical */}
      {[25, 33, 41, 50, 59, 67, 75].map((x) => (
        <line key={`v${x}`} x1={x} y1="5" x2={x} y2="85" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" />
      ))}
    </svg>
  );
}

// ─── Animated Court SVG ──────────────────────────────────────────────────────
function AnimatedCourt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="courtSurf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f2744" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
      </defs>
      {/* Court surface */}
      <rect x="10" y="10" width="180" height="100" rx="4" fill="url(#courtSurf)" stroke="#22c55e" strokeWidth="1.5" opacity="0.8" className="court-draw" />
      {/* Center line */}
      <line x1="100" y1="10" x2="100" y2="110" stroke="#22c55e" strokeWidth="1" opacity="0.5" className="court-draw-delay" />
      {/* Service boxes */}
      <line x1="10" y1="60" x2="190" y2="60" stroke="#22c55e" strokeWidth="1" opacity="0.5" className="court-draw-delay" />
      <line x1="55" y1="10" x2="55" y2="110" stroke="#22c55e" strokeWidth="0.7" opacity="0.3" className="court-draw-delay-2" />
      <line x1="145" y1="10" x2="145" y2="110" stroke="#22c55e" strokeWidth="0.7" opacity="0.3" className="court-draw-delay-2" />
      {/* Net */}
      <line x1="100" y1="8" x2="100" y2="112" stroke="#f97316" strokeWidth="2" opacity="0.6" strokeDasharray="3 3" />
      {/* Net posts */}
      <circle cx="100" cy="8" r="3" fill="#f97316" opacity="0.6" />
      <circle cx="100" cy="112" r="3" fill="#f97316" opacity="0.6" />
    </svg>
  );
}

// ─── Floating particles background ───────────────────────────────────────────
function FloatingBalls() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-lime-400 animate-ball-float-${(i % 3) + 1}`}
          style={{
            width: `${6 + i * 2}px`,
            height: `${6 + i * 2}px`,
            left: `${15 + i * 16}%`,
            top: `${20 + i * 12}%`,
            opacity: 0.08 + i * 0.02,
          }}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [step, setStep] = useState(0); // 0 = welcome, 1 = profile, 2 = level, 3 = bio
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [profile, setProfile] = useState<OnboardingProfile>({
    name: "",
    city: "Lahore",
    level: 3.5,
    playType: "Both",
    bio: "",
    age: 25,
    gender: "M",
    preferredCities: ["Lahore"],
    photoUrl: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Animate in on step change
  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  // Pre-fill from localStorage (unauth) or DB profile (auth)
  useEffect(() => {
    if (isPending || loaded) return;

    const prefill = async () => {
      if (session) {
        const prefillName = session.user?.name || "";
        try {
          const existing = await getProfile();
          if (existing && existing.name) {
            setProfile((prev) => ({
              ...prev,
              name: existing.name || prev.name,
              city: existing.city || prev.city,
              level: existing.level ?? prev.level,
              playType: existing.playType || prev.playType,
              bio: existing.bio || prev.bio,
              age: existing.age ?? prev.age,
              gender: existing.gender || prev.gender,
              preferredCities: existing.preferredCities?.length > 0
                ? existing.preferredCities
                : prev.preferredCities,
              photoUrl: existing.photoUrl || prev.photoUrl,
            }));
            setLoaded(true);
            return;
          }
        } catch {
          // No profile exists yet
        }

        const localData = getLocalOnboardingData();
        if (localData) {
          setProfile((prev) => ({
            ...prev,
            ...localData,
            name: localData.name || prefillName || prev.name,
          }));
          setLoaded(true);
          return;
        }

        if (prefillName) {
          setProfile((prev) => ({ ...prev, name: prefillName }));
        }
      } else {
        const localData = getLocalOnboardingData();
        if (localData) {
          setProfile((prev) => ({ ...prev, ...localData }));
        }
      }
      setLoaded(true);
    };

    prefill();
  }, [session, isPending, loaded]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      if (session) {
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
        localStorage.removeItem(ONBOARDING_DATA_KEY);
        localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      } else {
        saveLocalOnboardingData(profile);
      }
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const goNext = () => {
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  if (isPending) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <AnimatedTennisBall className="w-16 h-16" />
      </div>
    );
  }

  const fadeClass = animateIn
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  return (
    <div className="min-h-dvh bg-background flex flex-col relative overflow-hidden">
      <FloatingBalls />

      {/* Progress bar — only visible after welcome screen */}
      {step > 0 && (
        <div className="px-6 pt-6 pb-2 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm font-medium">Step {step} of 3</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-lime-400" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Step 0: Welcome Screen ═══ */}
      {step === 0 && (
        <div className={`flex-1 flex flex-col items-center justify-center px-8 text-center transition-all duration-700 ease-out relative z-10 ${fadeClass}`}>
          {/* Animated tennis ball */}
          <div className="mb-6 relative">
            <AnimatedTennisBall className="w-28 h-28" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-lime-500/20 blur-sm" />
          </div>

          <h1 className="text-5xl font-black text-white mb-3 tracking-tight leading-tight">
            Tennis<br />
            <span className="text-lime-400">Connect</span>
          </h1>
          <p className="text-orange-400 text-lg font-bold tracking-widest uppercase mb-8">Pakistan</p>

          <p className="text-white/60 text-lg leading-relaxed max-w-sm mb-12">
            Find players, book courts, and grow the tennis community in your city.
          </p>

          <button
            onClick={goNext}
            className="w-full max-w-xs py-5 bg-lime-400 text-black font-black rounded-2xl text-xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_30px_#22c55e40]"
          >
            Get Started <ChevronRight size={24} strokeWidth={3} />
          </button>

          <p className="text-white/30 text-sm mt-6">Takes less than 1 minute</p>
        </div>
      )}

      {/* ═══ Step 1: Profile Info ═══ */}
      {step === 1 && (
        <div className={`flex-1 px-6 pt-4 pb-2 overflow-y-auto transition-all duration-500 ease-out relative z-10 ${fadeClass}`}>
          {/* Racket decoration */}
          <div className="absolute top-2 right-4 opacity-10 pointer-events-none">
            <AnimatedRacket className="w-20 h-32" />
          </div>

          <h2 className="text-4xl font-black text-white mb-1 leading-tight">
            Who are<br /><span className="text-lime-400">you?</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">Let&apos;s set up your player profile</p>

          <div className="space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center mb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-lime-400/50 bg-card flex items-center justify-center transition-all group-hover:border-lime-400 group-hover:shadow-[0_0_20px_#22c55e30]">
                  {profile.photoUrl ? (
                    <Image
                      src={profile.photoUrl}
                      alt="Profile photo"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User size={40} className="text-white/20" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center border-3 border-background shadow-lg">
                  <Camera size={18} className="text-black" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 500 * 1024) {
                    setError("Photo must be under 500KB");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile({ ...profile, photoUrl: reader.result as string });
                    setError(null);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <p className="text-white/30 text-sm mt-3">Tap to add photo</p>
            </div>

            <div>
              <label className="text-lg font-bold text-white mb-2 block">Your Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full h-16 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-lime-400 focus:bg-white/8 text-xl font-medium transition-colors"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-lg font-bold text-white mb-2 block">Age</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={13}
                  max={80}
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Math.max(13, Math.min(80, parseInt(e.target.value) || 13)) })}
                  className="w-32 h-16 px-5 rounded-2xl bg-white/5 border border-white/10 text-white text-center text-xl font-bold focus:outline-none focus:border-lime-400 transition-colors"
                />
                <span className="text-white/40 text-lg">years old</span>
              </div>
            </div>

            <div>
              <label className="text-lg font-bold text-white mb-3 block">Your City</label>
              <div className="flex gap-2 flex-wrap">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setProfile({ ...profile, city, preferredCities: [city] })}
                    className={`px-5 py-3.5 rounded-xl text-base font-bold border-2 transition-all duration-200 ${
                      profile.city === city
                        ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_#22c55e40]"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-lime-400/40"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-lg font-bold text-white mb-3 block">Gender</label>
              <div className="flex gap-4">
                {(["M", "F"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setProfile({ ...profile, gender: g })}
                    className={`flex-1 py-4 rounded-xl text-lg font-bold border-2 transition-all duration-200 ${
                      profile.gender === g
                        ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_#22c55e40]"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-lime-400/40"
                    }`}
                  >
                    {g === "M" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Step 2: Skill Level ═══ */}
      {step === 2 && (
        <div className={`flex-1 px-6 pt-4 overflow-y-auto transition-all duration-500 ease-out relative z-10 ${fadeClass}`}>
          {/* Court decoration */}
          <div className="absolute top-8 right-2 opacity-8 pointer-events-none">
            <AnimatedCourt className="w-32 h-20" />
          </div>

          <h2 className="text-4xl font-black text-white mb-1 leading-tight">
            Your<br /><span className="text-lime-400">level?</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">We&apos;ll match you with the right players</p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <span className="text-white/50 text-lg font-medium">NTRP Rating</span>
              <div className="text-right">
                <span className="text-lime-400 font-black text-6xl leading-none">{profile.level}</span>
              </div>
            </div>

            <Slider
              min={2.5}
              max={5.0}
              step={0.5}
              value={[profile.level]}
              onValueChange={([val]) => setProfile({ ...profile, level: val })}
              className="w-full"
            />

            <div className="flex justify-between mt-4">
              {[2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((l) => (
                <span key={l} className={`text-sm font-bold transition-colors ${l === profile.level ? "text-lime-400" : "text-white/20"}`}>
                  {l}
                </span>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block px-8 py-3 bg-lime-400/10 border border-lime-400/30 rounded-2xl">
                <p className="text-lime-400 text-2xl font-black">
                  {LEVEL_LABELS[profile.level]}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-lg font-bold text-white mb-4 block">Play Style</label>
            <div className="flex gap-3">
              {(["Singles", "Doubles", "Both"] as const).map((pt) => (
                <button
                  key={pt}
                  onClick={() => setProfile({ ...profile, playType: pt })}
                  className={`flex-1 py-5 rounded-xl text-lg font-bold border-2 transition-all duration-200 ${
                    profile.playType === pt
                      ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_#22c55e40]"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-lime-400/40"
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Step 3: Bio ═══ */}
      {step === 3 && (
        <div className={`flex-1 px-6 pt-4 overflow-y-auto transition-all duration-500 ease-out relative z-10 ${fadeClass}`}>
          {/* Ball decoration */}
          <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
            <AnimatedTennisBall className="w-16 h-16" />
          </div>

          <h2 className="text-4xl font-black text-white mb-1 leading-tight">
            Almost<br /><span className="text-lime-400">done!</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">Tell others what you&apos;re looking for</p>

          <div>
            <label className="text-lg font-bold text-white mb-3 block">Your Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full h-44 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-lime-400 focus:bg-white/8 resize-none text-lg transition-colors"
              placeholder="Looking for singles partners on weekends in DHA..."
            />
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Summary card */}
          <div className="mt-6 p-6 bg-lime-400/5 border border-lime-400/20 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 border-2 border-lime-400/30 flex items-center justify-center">
                {profile.photoUrl ? (
                  <Image src={profile.photoUrl} alt="" width={56} height={56} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <User size={24} className="text-white/20" />
                )}
              </div>
              <div>
                <p className="text-white text-lg font-bold">{profile.name || "Your Name"}</p>
                <p className="text-white/40 text-sm">{profile.city} · {profile.age} yrs · {profile.gender === "M" ? "Male" : "Female"}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-lime-400/10 border border-lime-400/20 rounded-lg text-lime-400 text-sm font-bold">
                Level {profile.level}
              </span>
              <span className="px-3 py-1 bg-orange-400/10 border border-orange-400/20 rounded-lg text-orange-400 text-sm font-bold">
                {profile.playType}
              </span>
            </div>
            <p className="text-white/40 text-sm mt-3">
              {session
                ? "Your profile will be saved to your account."
                : "Sign up later to save your profile permanently!"}
            </p>
          </div>
        </div>
      )}

      {/* ═══ Navigation Buttons ═══ */}
      {step > 0 && (
        <div className="px-6 pb-8 pt-4 relative z-10">
          <div className="flex gap-4">
            <button
              onClick={goBack}
              className="flex items-center justify-center gap-2 flex-1 py-5 border-2 border-white/10 text-white/60 font-bold rounded-2xl hover:bg-white/5 transition-colors text-lg"
            >
              <ChevronLeft size={20} /> Back
            </button>

            {step < 3 ? (
              <button
                onClick={goNext}
                disabled={step === 1 && !profile.name}
                className="flex-1 py-5 bg-lime-400 text-black font-black rounded-2xl disabled:opacity-30 flex items-center justify-center gap-2 text-xl shadow-[0_0_20px_#22c55e30] active:scale-95 transition-transform"
              >
                Continue <ChevronRight size={22} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-5 bg-lime-400 text-black font-black rounded-2xl disabled:opacity-60 flex items-center justify-center gap-3 text-xl shadow-[0_0_20px_#22c55e30] active:scale-95 transition-transform"
              >
                {saving ? (
                  <>
                    <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    {session ? "Save Profile" : "Explore Now"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
