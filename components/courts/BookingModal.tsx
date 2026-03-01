"use client";

import { useState } from "react";
import Image from "next/image";
import { format, addDays } from "date-fns";
import { X, Calendar, Clock, Smartphone, CheckCircle, MessageCircle, Thermometer } from "lucide-react";
import confetti from "canvas-confetti";
import { TIME_SLOTS, isSlotAvailable } from "@/data";
import type { Court } from "@/data";
import { useAppStore } from "@/store/useAppStore";
import { createBooking } from "@/lib/api";

interface BookingModalProps {
  court: Court;
  onClose: () => void;
}

type Step = "datetime" | "payment" | "confirmed";

export function BookingModal({ court, onClose }: BookingModalProps) {
  const addBooking = useAppStore((s) => s.addBooking);

  const [step, setStep] = useState<Step>("datetime");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [payment, setPayment] = useState<"JazzCash" | "EasyPaisa">("JazzCash");
  const [processing, setProcessing] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));
  const totalCost = court.pricePerHour * duration;

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setProcessing(true);

    try {
      const booking = await createBooking({
        courtId: court.id,
        courtName: court.name,
        city: court.city,
        surface: court.surface,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        durationHours: duration,
        payment,
        totalCost,
      });

      addBooking({
        id: booking.id,
        courtId: booking.courtId,
        courtName: booking.courtName,
        city: booking.city,
        surface: booking.surface,
        date: booking.date,
        time: booking.time,
        durationHours: booking.durationHours,
        payment: booking.payment,
        totalCost: booking.totalCost,
        status: booking.status,
        bookedAt: booking.bookedAt,
      });

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#00ff9d", "#ffffff", "#00cc7a"],
      });

      setStep("confirmed");
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      `Assalam o Alaikum! I'd like to confirm my booking at ${court.name} on ${selectedDate ? format(selectedDate, "dd MMM") : ""} at ${selectedTime}. Payment via ${payment}. Shukria! 🎾`
    );
    window.open(`https://wa.me/+923001234567?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-surface border border-line rounded-t-3xl overflow-hidden slide-up"
        style={{ maxHeight: "92dvh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface border-b border-line px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-base leading-tight">{court.name}</h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              {court.city} · {court.surface} · Rs.{court.pricePerHour.toLocaleString()}/hr
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Heat warning */}
        <div className="mx-5 mt-4 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-xl px-3 py-2">
          <Thermometer size={14} className="text-orange-400 shrink-0" />
          <p className="text-orange-300 text-xs font-medium">
            42°C expected — play before 10 AM bhai! 🥵
          </p>
        </div>

        {/* ── Step 1: Date & Time ── */}
        {step === "datetime" && (
          <div className="px-5 pb-8 mt-4 space-y-5">
            {/* Date picker */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} className="text-brand" />
                <h3 className="text-sm font-bold text-foreground">Select Date</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {dates.map((d) => {
                  const active = selectedDate?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      onClick={() => setSelectedDate(d)}
                      className={`shrink-0 flex flex-col items-center px-3 py-2.5 rounded-2xl border transition-all ${
                        active
                          ? "bg-brand text-pit border-brand shadow-[0_0_12px_#00ff9d40]"
                          : "bg-surface-2 text-muted-foreground border-line hover:border-brand/40"
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase">{format(d, "EEE")}</span>
                      <span className="text-lg font-black mt-0.5">{format(d, "d")}</span>
                      <span className="text-[10px]">{format(d, "MMM")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={15} className="text-brand" />
                <h3 className="text-sm font-bold text-foreground">Select Time</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const avail = isSlotAvailable(slot);
                  const active = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      disabled={!avail}
                      onClick={() => avail && setSelectedTime(slot)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        !avail
                          ? "opacity-30 cursor-not-allowed bg-surface-2 border-line text-muted-foreground line-through"
                          : active
                          ? "bg-brand text-pit border-brand shadow-[0_0_10px_#00ff9d40]"
                          : "bg-surface-2 text-foreground border-line hover:border-brand/40"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Duration</h3>
              <div className="flex gap-2">
                {[1, 1.5, 2, 3].map((h) => (
                  <button
                    key={h}
                    onClick={() => setDuration(h)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      duration === h
                        ? "bg-brand text-pit border-brand"
                        : "bg-surface-2 text-muted-foreground border-line hover:border-brand/40"
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-surface-2 rounded-2xl px-4 py-3 border border-line">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="text-brand font-black text-xl">
                Rs.{(totalCost).toLocaleString()}
              </span>
            </div>

            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep("payment")}
              className="w-full py-4 bg-brand text-pit font-black rounded-2xl text-base shadow-[0_0_20px_#00ff9d40] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              Continue to Payment →
            </button>
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === "payment" && (
          <div className="px-5 pb-8 mt-4 space-y-5">
            {/* Booking summary */}
            <div className="bg-surface-2 border border-line rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Court</span>
                <span className="text-foreground font-semibold">{court.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground font-semibold">
                  {selectedDate && format(selectedDate, "dd MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground font-semibold">{selectedTime} · {duration}h</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-line">
                <span className="text-foreground font-bold">Total</span>
                <span className="text-brand font-black text-lg">Rs.{totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone size={15} className="text-brand" />
                <h3 className="text-sm font-bold text-foreground">Payment Method</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["JazzCash", "EasyPaisa"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPayment(method)}
                    className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${
                      payment === method
                        ? "border-brand bg-brand/10 shadow-[0_0_16px_#00ff9d25]"
                        : "border-line bg-surface-2 hover:border-brand/40"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base mb-2 ${
                        method === "JazzCash" ? "bg-orange-500" : "bg-green-600"
                      }`}
                    >
                      {method === "JazzCash" ? "J" : "E"}
                    </div>
                    <span className="text-sm font-bold text-foreground">{method}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {method === "JazzCash" ? "0311-XXXXXXX" : "0313-XXXXXXX"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={processing}
              className="w-full py-4 bg-brand text-pit font-black rounded-2xl text-base shadow-[0_0_20px_#00ff9d40] disabled:opacity-70 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-pit/30 border-t-pit rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm & Pay Rs.${totalCost.toLocaleString()}`
              )}
            </button>

            <button
              onClick={() => setStep("datetime")}
              className="w-full py-3 text-muted-foreground text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        )}

        {/* ── Step 3: Confirmed ── */}
        {step === "confirmed" && (
          <div className="px-5 pb-8 mt-4 flex flex-col items-center text-center gap-5">
            <div className="w-20 h-20 rounded-full bg-brand/15 border-2 border-brand flex items-center justify-center shadow-[0_0_24px_#00ff9d40]">
              <CheckCircle size={40} className="text-brand" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-black">Court Booked!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {court.name} · {selectedDate && format(selectedDate, "dd MMM")} · {selectedTime}
              </p>
            </div>
            <div className="bg-surface-2 border border-line rounded-2xl p-4 w-full text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid via</span>
                <span className="text-foreground font-semibold">{payment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-brand font-black">Rs.{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-brand font-bold">✓ Confirmed</span>
              </div>
            </div>

            {/* WhatsApp button */}
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-black rounded-2xl text-base active:scale-95 transition-transform"
            >
              <MessageCircle size={20} />
              WhatsApp Court Manager
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 border border-line text-muted-foreground text-sm font-medium rounded-2xl hover:border-brand/40 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
