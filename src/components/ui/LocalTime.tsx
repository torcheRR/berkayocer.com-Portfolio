"use client";

import { useSyncExternalStore } from "react";

// Tüm saat bileşenleri tek bir saniyelik zamanlayıcıyı paylaşır.
let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

// Sunucuda ve ilk hidrasyonda 0 döner; saat yalnızca istemcide görünür (hidrasyon uyuşmazlığı olmaz).
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => 0,
  );
}

export function formatTime(ms: number, timeZone?: string, seconds = false) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: seconds ? "2-digit" : undefined,
    hour12: false,
    timeZone,
  }).format(ms);
}

// Saat dilimi farkı (dakika cinsinden): hedef bölge − ziyaretçi. Buçuklu dilimler (UTC+5:30 vb.) korunur.
export function zoneOffsetMinutes(ms: number, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(ms)
      .map((p) => [p.type, p.value]),
  );
  const zoned = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  const targetOffsetMin = (zoned - Math.floor(ms / 60000) * 60000) / 60000;
  const visitorOffsetMin = -new Date(ms).getTimezoneOffset();
  return Math.round(targetOffsetMin - visitorOffsetMin);
}

// 150 → "2 sa 30 dk", 30 → "30 dk", 180 → "3 sa"
export function formatOffset(minutes: number) {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return [h ? `${h} sa` : "", m ? `${m} dk` : ""].filter(Boolean).join(" ");
}

export function LocalTime({ timeZone, prefix = "" }: { timeZone: string; prefix?: string }) {
  const now = useNow();
  return (
    <span className="tabular-nums">
      {prefix}
      {now ? formatTime(now, timeZone) : "--:--"}
    </span>
  );
}

export function TimeDiff({ timeZone }: { timeZone: string }) {
  const now = useNow();
  if (!now) return null;
  const diff = zoneOffsetMinutes(now, timeZone);
  return (
    <span className="text-ink-3">
      {diff === 0 ? "// senin saatinle aynı" : `// senden ${formatOffset(diff)} ${diff > 0 ? "ileride" : "geride"}`}
    </span>
  );
}
