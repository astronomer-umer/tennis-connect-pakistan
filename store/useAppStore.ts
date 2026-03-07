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

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
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

      // Matches — starts empty, populated by swiping right
      matches: [],
      showMatchOverlay: false,
      lastMatchedProfile: null,
      triggerMatch: (profile) => {
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
                  text: `Hey! Looking forward to playing with you`,
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

      // Profile — clean defaults
      userProfile: {
        name: "",
        city: "Lahore",
        level: 3.5,
        preferredCities: ["Lahore"],
        playType: "Both",
        goldenSets: 0,
        bio: "",
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
