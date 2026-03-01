"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cities } from "@/data";
import { useSession } from "@/lib/auth/client";
import { getProfile, updateProfile } from "@/lib/api";

const LEVEL_LABELS: Record<number, string> = {
  2.5: "Beginner",
  3.0: "Novice",
  3.5: "Intermediate",
  4.0: "Advanced",
  4.5: "Expert",
  5.0: "Pro",
};

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
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-8">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? "bg-brand" : "bg-surface-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="px-6 flex-1">
          <h1 className="text-2xl font-black text-white mb-2">Welcome! 🎾</h1>
          <p className="text-muted-foreground mb-8">Let&apos;s set up your tennis profile</p>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Your Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full h-12 px-4 rounded-2xl bg-surface border border-line text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
                placeholder="What should we call you?"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Your City</label>
              <div className="flex gap-2 flex-wrap">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setProfile({ ...profile, city, preferredCities: [city] })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      profile.city === city
                        ? "bg-brand text-black border-brand"
                        : "bg-surface border-line text-muted-foreground"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Gender</label>
              <div className="flex gap-3">
                {(["M", "F"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setProfile({ ...profile, gender: g })}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                      profile.gender === g
                        ? "bg-brand text-black border-brand"
                        : "bg-surface border-line text-muted-foreground"
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

      {/* Step 2: Tennis Level */}
      {step === 2 && (
        <div className="px-6 flex-1">
          <h1 className="text-2xl font-black text-white mb-2">Your Level</h1>
          <p className="text-muted-foreground mb-8">Help us match you with the right players</p>

          <div className="bg-surface border border-line rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-muted-foreground text-sm">NTRP Level</span>
              <span className="text-brand font-black text-3xl">{profile.level}</span>
            </div>

            <Slider
              min={2.5}
              max={5.0}
              step={0.5}
              value={[profile.level]}
              onValueChange={([val]) => setProfile({ ...profile, level: val })}
              className="w-full"
            />

            <div className="flex justify-between mt-3">
              {[2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((l) => (
                <span key={l} className={`text-xs font-bold ${l === profile.level ? "text-brand" : "text-zinc-600"}`}>
                  {l}
                </span>
              ))}
            </div>

            <p className="text-center text-muted-foreground text-sm mt-4">
              {LEVEL_LABELS[profile.level]}
            </p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-3 block">Play Type</label>
            <div className="flex gap-3">
              {(["Singles", "Doubles", "Both"] as const).map((pt) => (
                <button
                  key={pt}
                  onClick={() => setProfile({ ...profile, playType: pt })}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    profile.playType === pt
                      ? "bg-brand text-black border-brand"
                      : "bg-surface border-line text-muted-foreground"
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
          <h1 className="text-2xl font-black text-white mb-2">About You</h1>
          <p className="text-muted-foreground mb-8">Tell others what you&apos;re looking for</p>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full h-40 px-4 py-3 rounded-2xl bg-surface border border-line text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand resize-none"
              placeholder="e.g., Weekend warrior, looking for regular partners..."
            />
          </div>

          <div className="mt-6 p-4 bg-brand/10 border border-brand/20 rounded-2xl">
            <p className="text-brand text-sm font-medium">✓ You&apos;re all set!</p>
            <p className="text-muted-foreground text-xs mt-1">
              Complete your profile to start connecting with players near you.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="px-6 pb-8 pt-4">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 border border-line text-muted-foreground font-bold rounded-2xl"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !profile.name}
              className="flex-1 py-4 bg-brand text-black font-black rounded-2xl disabled:opacity-40"
            >
              Continue <ChevronRight className="inline" size={18} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-4 bg-brand text-black font-black rounded-2xl disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
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
