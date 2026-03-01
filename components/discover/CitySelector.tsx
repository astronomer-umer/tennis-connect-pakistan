"use client";

import { useAppStore, type CityFilter } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const OPTIONS: { label: string; value: CityFilter }[] = [
  { label: "All Pakistan", value: "All" },
  { label: "Lahore", value: "Lahore" },
  { label: "Karachi", value: "Karachi" },
  { label: "Islamabad", value: "Islamabad" },
  { label: "Rawalpindi", value: "Rawalpindi" },
  { label: "Faisalabad", value: "Faisalabad" },
];

export function CitySelector() {
  const { selectedCity, setSelectedCity } = useAppStore();

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
      {OPTIONS.map(({ label, value }) => {
        const active = selectedCity === value;
        return (
          <button
            key={value}
            onClick={() => setSelectedCity(value)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
              active
                ? "bg-brand text-pit border-brand shadow-[0_0_12px_#00ff9d50]"
                : "bg-surface text-muted-foreground border-line hover:border-brand/40 hover:text-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
