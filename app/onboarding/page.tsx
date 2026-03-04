"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronRight, ChevronLeft, User, Trophy, MessageCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cities } from "@/data";
import { useSession } from "@/lib/auth/client";
import { updateProfile } from "@/lib/api";
import { TennisBallLogo, TennisRacketLogo } from "@/components/providers/TennisIcons";

const LEVEL_LABELS: Record<number, string> = {
  2.5: "Beginner",
  3.0: "Novice",
  3.5: "Intermediate",
  4.0: "Advanced",
  4.5: "Expert",
  5.0: "Pro",
};

const STEPS = [
  { id: 1, title: "Profile", icon: User, description: "Basic info" },
  { id: 2, title: "Level", icon: Trophy, description: "Your skill" },
  { id: 3, title: "About", icon: MessageCircle, description: "Bio" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    city: "Lahore",
    level: 3.5,
    playType: "Both" as "Singles" | "Doubles" | "Both",
    bio: "",
    age: 25,
    gender: "M" as "M" | "F",
    preferredCities: ["Lahore"] as string[],
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSave = async () => {
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
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center lime-glow">
            <TennisBallLogo size={44} />
          </div>
          <div>
            <h1 className="text-foreground font-black text-xl">Tennis Connect</h1>
            <p className="text-orange-500 text-xs font-bold tracking-widest uppercase">Pakistan</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-foreground">Setup Profile</h2>
          <span className="text-sm text-muted-foreground">Step {step} of 3</span>
        </div>
        
        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                  step >= s.id
                    ? "bg-lime-400 text-black"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s.id ? "✓" : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-1 rounded-full transition-colors ${
                  step > s.id ? "bg-lime-400" : "bg-secondary"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="px-6 flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center orange-glow">
                <TennisRacketLogo size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Welcome!</h2>
                <p className="text-muted-foreground text-base">Let us set up your profile</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-base font-medium text-foreground mb-2 block">Your Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-400 text-lg"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-base font-medium text-foreground mb-3 block">Select City</label>
              <div className="flex gap-2 flex-wrap">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setProfile({ ...profile, city, preferredCities: [city] })}
                    className={`px-5 py-3 rounded-xl text-base font-semibold border-2 transition-all ${
                      profile.city === city
                        ? "bg-lime-400 text-black border-lime-400"
                        : "bg-card border-border text-muted-foreground hover:border-lime-400/50"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-base font-medium text-foreground mb-3 block">Gender</label>
              <div className="flex gap-4">
                {(["M", "F"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setProfile({ ...profile, gender: g })}
                    className={`flex-1 py-4 rounded-xl text-base font-semibold border-2 transition-all ${
                      profile.gender === g
                        ? "bg-lime-400 text-black border-lime-400"
                        : "bg-card border-border text-muted-foreground hover:border-lime-400/50"
                    }`}
                  >
                    {g === "M" ? "👨 Male" : "👩 Female"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Tennis Level */}
      {step === 2 && (
        <div className="px-6 flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">Your Skill Level</h2>
            <p className="text-muted-foreground text-base">Help us match you with right players</p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-muted-foreground text-base">NTRP Level</span>
              <span className="text-lime-400 font-black text-4xl">{profile.level}</span>
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
                <span key={l} className={`text-sm font-bold ${l === profile.level ? "text-lime-400" : "text-muted-foreground"}`}>
                  {l}
                </span>
              ))}
            </div>

            <p className="text-center text-foreground text-lg font-semibold mt-6 py-3 bg-secondary rounded-xl">
              {LEVEL_LABELS[profile.level]}
            </p>
          </div>

          <div>
            <label className="text-base font-medium text-foreground mb-3 block">Preferred Play Type</label>
            <div className="flex gap-3">
              {(["Singles", "Doubles", "Both"] as const).map((pt) => (
                <button
                  key={pt}
                  onClick={() => setProfile({ ...profile, playType: pt })}
                  className={`flex-1 py-4 rounded-xl text-base font-semibold border-2 transition-all ${
                    profile.playType === pt
                      ? "bg-lime-400 text-black border-lime-400"
                      : "bg-card border-border text-muted-foreground hover:border-lime-400/50"
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Bio */}
      {step === 3 && (
        <div className="px-6 flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">About You</h2>
            <p className="text-muted-foreground text-base">Tell others what you are looking for</p>
          </div>

          <div>
            <label className="text-base font-medium text-foreground mb-2 block">Your Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full h-48 px-5 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-400 resize-none text-lg"
              placeholder="Tell us about your tennis journey, what you're looking for..."
            />
          </div>

          <div className="mt-6 p-5 bg-lime-400/10 border-2 border-lime-400/30 rounded-2xl">
            <p className="text-lime-400 text-base font-semibold">🎾 Ready to connect!</p>
            <p className="text-muted-foreground text-sm mt-1">
              Complete your profile to start discovering players and courts near you.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="px-6 pb-8 pt-4">
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center justify-center gap-2 flex-1 py-5 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-card transition-colors"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !profile.name}
              className="flex-1 py-5 bg-lime-400 text-black font-black rounded-2xl disabled:opacity-40 flex items-center justify-center gap-2 text-lg"
            >
              Continue <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-5 bg-lime-400 text-black font-black rounded-2xl disabled:opacity-70 flex items-center justify-center gap-3 text-lg"
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={22} />
                  Get Started
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
