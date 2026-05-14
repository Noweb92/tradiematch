"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import type { GeoSuggestion } from "@/lib/geo/nominatim";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: GeoSuggestion) => void;
  placeholder?: string;
  error?: string;
}

/**
 * AU address autocomplete backed by Nominatim. Debounces 350ms.
 */
export function AddressInput({
  label,
  value,
  onChange,
  onSelect,
  placeholder = "Start typing your address…",
  error,
}: Props) {
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/geo/search?q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal },
        );
        const data = (await res.json()) as { results: GeoSuggestion[] };
        setSuggestions(data.results ?? []);
        setOpen(true);
      } catch {
        // aborted or network — ignore
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-bold text-navy/75 tracking-wide">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 bg-white pl-9 pr-9 py-3 text-sm text-navy placeholder:text-navy/30 transition-all min-h-[44px] focus:outline-none focus:ring-4 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/15"
              : "border-navy/10 focus:border-orange focus:ring-orange/15"
          }`}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40 animate-spin" />
        )}

        {open && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-navy/10 bg-white shadow-card overflow-hidden z-30 max-h-64 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onSelect(s);
                  onChange(s.display_name);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-orange/5 transition-colors border-b border-navy/5 last:border-0"
              >
                <div className="text-sm font-semibold text-navy leading-tight line-clamp-1">
                  {s.address?.road
                    ? `${s.address.house_number ?? ""} ${s.address.road}`.trim()
                    : s.display_name.split(",")[0]}
                </div>
                <div className="text-[11px] text-navy/55 line-clamp-1 mt-0.5">
                  {s.display_name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
