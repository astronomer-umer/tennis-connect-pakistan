"use client";

import { useState } from "react";
import { Send, MessageCircle, User, MapPin, Briefcase, Calendar } from "lucide-react";
import { TennisRacketLogo } from "@/components/providers/TennisIcons";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Other"];

const PROFESSIONAL_STATUS = [
  { value: "professional", label: "Professional", description: "Competitive player / Coach" },
  { value: "amateur", label: "Amateur", description: "Play for fun / fitness" },
  { value: "student", label: "Student", description: "Learning the game" },
  { value: "beginner", label: "Beginner", description: "Just started" },
  { value: "parent", label: "Parent", description: "Looking for coaching for kids" },
];

const AGE_GROUPS = [
  { value: "under12", label: "Under 12" },
  { value: "12-17", label: "12-17 years" },
  { value: "18-25", label: "18-25 years" },
  { value: "26-35", label: "26-35 years" },
  { value: "36-45", label: "36-45 years" },
  { value: "46-55", label: "46-55 years" },
  { value: "55plus", label: "55+ years" },
];

export default function ChatWithUsPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    professionalStatus: "",
    ageGroup: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.city || !formData.professionalStatus || !formData.ageGroup) {
      return;
    }

    setSending(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed");
    } catch (e) {
      console.error(e);
    }
    
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full bg-lime-500/20 flex items-center justify-center mb-6">
          <Send className="w-10 h-10 text-lime-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h1>
        <p className="text-muted-foreground text-center mb-6">
          Thank you for reaching out. We will get back to you soon!
        </p>
        <button
          onClick={() => {
            setSent(false);
            setStep(1);
            setFormData({ name: "", phone: "", city: "", professionalStatus: "", ageGroup: "", message: "" });
          }}
          className="text-lime-500 font-semibold"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 pt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center lime-glow">
            <TennisRacketLogo size={36} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">Chat With Us</h1>
            <p className="text-muted-foreground text-sm">Beginners & Pros Welcome!</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 mb-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? "bg-lime-500" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="px-6 flex-1 space-y-5">
          <div>
            <label className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-lime-500" />
              Your Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-500 text-lg"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-lime-500" />
              Your City *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setFormData({ ...formData, city })}
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                    formData.city === city
                      ? "bg-lime-500 text-black border-lime-500"
                      : "bg-card border-border text-muted-foreground hover:border-lime-500/50"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.city}
            className="w-full py-4 bg-lime-500 hover:bg-lime-600 text-black font-bold text-lg rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Player Info */}
      {step === 2 && (
        <div className="px-6 flex-1 space-y-5">
          <div>
            <label className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-lime-500" />
              I am a... *
            </label>
            <div className="space-y-2">
              {PROFESSIONAL_STATUS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFormData({ ...formData, professionalStatus: status.value })}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    formData.professionalStatus === status.value
                      ? "bg-lime-500/10 border-lime-500"
                      : "bg-card border-border hover:border-lime-500/50"
                  }`}
                >
                  <p className={`font-semibold ${formData.professionalStatus === status.value ? "text-lime-500" : "text-foreground"}`}>
                    {status.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{status.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-lime-500" />
              Age Group *
            </label>
            <select
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:border-lime-500 text-lg"
            >
              <option value="">Select your age group</option>
              {AGE_GROUPS.map((group) => (
                <option key={group.value} value={group.value}>{group.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-4 border-2 border-border text-foreground font-bold rounded-2xl"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.professionalStatus || !formData.ageGroup}
              className="flex-1 py-4 bg-lime-500 hover:bg-lime-600 text-black font-bold text-lg rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Message */}
      {step === 3 && (
        <div className="px-6 flex-1 space-y-5">
          <div>
            <label className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-lime-500" />
              Your Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full h-40 px-5 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-500 resize-none text-lg"
              placeholder="Tell us about your tennis journey, what you're looking for..."
            />
          </div>

          {/* Summary */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-2">Summary:</p>
            <p className="text-foreground font-semibold">{formData.name}</p>
            <p className="text-muted-foreground text-sm">{formData.city}</p>
            <p className="text-lime-500 text-sm capitalize">{formData.professionalStatus} • {formData.ageGroup.replace('-', '-')}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-4 border-2 border-border text-foreground font-bold rounded-2xl"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="flex-1 py-4 bg-lime-500 hover:bg-lime-600 text-black font-bold text-lg rounded-2xl disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
