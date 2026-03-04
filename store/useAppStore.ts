"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player, Coach, City } from "@/data";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CityFilter = City | "All";

export interface ChatMessage {
  id: string;
  text: string;
  isMe: boolean;
  sentAt: number; // timestamp
}

export interface Match {
  id: string;
  profile: Player | Coach;
  matchedAt: number;
  messages: ChatMessage[];
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  city: City;
  surface: string;
  date: string;
  time: string;
  durationHours: number;
  payment: "JazzCash" | "EasyPaisa";
  totalCost: number;
  status: "confirmed" | "pending";
  bookedAt: number;
}

export interface UserProfile {
  name: string;
  city: City;
  level: number;
  preferredCities: City[];
  playType: "Singles" | "Doubles" | "Both";
  goldenSets: number;
  bio: string;
}

// ─── Store Interface ────────────────────────────────────────────────────────────

interface AppStore {
  // ── City filter
  selectedCity: CityFilter;
  setSelectedCity: (city: CityFilter) => void;

  // ── Swipe deck
  swipedRightIds: string[];
  swipedLeftIds: string[];
  swipeRight: (id: string) => void;
  swipeLeft: (id: string) => void;
  resetDeck: () => void;

  // ── Matches & confetti
  matches: Match[];
  showMatchOverlay: boolean;
  lastMatchedProfile: (Player | Coach) | null;
  triggerMatch: (profile: Player | Coach) => void;
  dismissMatchOverlay: () => void;
  addSeedMatches: () => void;

  // ── Chat
  activeChatMatchId: string | null;
  setActiveChatMatchId: (id: string | null) => void;
  sendMessage: (matchId: string, text: string) => void;

  // ── Court bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;

  // ── User profile
  userProfile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
}

// ─── Seed demo matches (pre-populated so Matches tab isn't empty) ──────────────

const SEED_MATCHES: Match[] = [
  {
    id: "seed-m1",
    profile: {
      id: "p6",
      kind: "player",
      name: "Zara Ahmed",
      age: 29,
      gender: "F",
      city: "Islamabad",
      level: 4.0,
      photo: "https://randomuser.me/api/portraits/women/28.jpg",
      status: "Smash queen 👑 looking for mixed doubles",
      playType: "Doubles",
      wins: 31,
      losses: 11,
    },
    matchedAt: Date.now() - 3600000 * 2,
    messages: [
      {
        id: "msg-1",
        text: "Yo! Doubles on Sunday evening? 🎾",
        isMe: false,
        sentAt: Date.now() - 3600000 * 2,
      },
      {
        id: "msg-2",
        text: "Absolutely! Which court — DHA or PTF?",
        isMe: true,
        sentAt: Date.now() - 3600000,
      },
      {
        id: "msg-3",
        text: "DHA works! Book for 6 PM, I'll bring rackets 🙌",
        isMe: false,
        sentAt: Date.now() - 1800000,
      },
    ],
  },
  {
    id: "seed-m2",
    profile: {
      id: "co1",
      kind: "coach",
      name: "Coach Tariq Ahmed",
      age: 42,
      gender: "M",
      city: "Lahore",
      specialization: "Serve & Volley",
      ratePerHour: 2500,
      photo: "https://randomuser.me/api/portraits/men/90.jpg",
      rating: 4.9,
      yearsExperience: 15,
      students: 85,
      bio: "Pakistan Under-18 coach 2016-2020.",
    },
    matchedAt: Date.now() - 3600000 * 24,
    messages: [
      {
        id: "msg-4",
        text: "Salam! Ready to take your serve to the next level?",
        isMe: false,
        sentAt: Date.now() - 3600000 * 24,
      },
    ],
  },
];

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // City
      selectedCity: "All",
      setSelectedCity: (city) => set({ selectedCity: city }),

      // Swipe
      swipedRightIds: [],
      swipedLeftIds: [],
      swipeRight: (id) =>
        set((s) => ({ swipedRightIds: [...s.swipedRightIds, id] })),
      swipeLeft: (id) =>
        set((s) => ({ swipedLeftIds: [...s.swipedLeftIds, id] })),
      resetDeck: () => set({ swipedRightIds: [], swipedLeftIds: [] }),

      // Matches
      matches: SEED_MATCHES,
      showMatchOverlay: false,
      lastMatchedProfile: null,
      triggerMatch: (profile) => {
        // Add to swiped right
        set((s) => ({
          swipedRightIds: [...s.swipedRightIds, profile.id],
          showMatchOverlay: true,
          lastMatchedProfile: profile,
          matches: [
            ...s.matches,
            {
              id: `match-${Date.now()}`,
              profile,
              matchedAt: Date.now(),
              messages: [
                {
                  id: `seed-${Date.now()}`,
                  text: `Hey! Looking forward to playing with you 🎾`,
                  isMe: false,
                  sentAt: Date.now(),
                },
              ],
            },
          ],
        }));
        // Auto-dismiss overlay after 3s
        setTimeout(() => set({ showMatchOverlay: false }), 3000);
      },
      dismissMatchOverlay: () => set({ showMatchOverlay: false }),
      addSeedMatches: () => {
        const current = get().matches;
        if (current.length === 0) set({ matches: SEED_MATCHES });
      },

      // Chat
      activeChatMatchId: null,
      setActiveChatMatchId: (id) => set({ activeChatMatchId: id }),
      sendMessage: (matchId, text) =>
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  messages: [
                    ...m.messages,
                    {
                      id: `msg-${Date.now()}`,
                      text,
                      isMe: true,
                      sentAt: Date.now(),
                    },
                  ],
                }
              : m
          ),
        })),

      // Bookings
      bookings: [],
      addBooking: (booking) =>
        set((s) => ({ bookings: [booking, ...s.bookings] })),

      // Profile
      userProfile: {
        name: "Your Name",
        city: "Lahore",
        level: 3.5,
        preferredCities: ["Lahore"],
        playType: "Both",
        goldenSets: 2,
        bio: "Tennis addict 🎾 | Weekend warrior | DHA Lahore",
      },
      updateProfile: (partial) =>
        set((s) => ({ userProfile: { ...s.userProfile, ...partial } })),
    }),
    {
      name: "tcp-app-store",
      partialize: (s) => ({
        selectedCity: s.selectedCity,
        swipedRightIds: s.swipedRightIds,
        swipedLeftIds: s.swipedLeftIds,
        matches: s.matches,
        bookings: s.bookings,
        userProfile: s.userProfile,
      }),
    }
  )
);
