"use client";

import { Card, CardLabel } from "@/components/ui/primitives";
import { formatOffset, formatTime, useNow, zoneOffsetMinutes } from "@/components/ui/LocalTime";

export function ClockCard({ timeZone, className }: { timeZone: string; className?: string }) {
  const now = useNow();
  const time = now ? formatTime(now, timeZone) : "--:--";
  const seconds = now ? formatTime(now, timeZone, true).slice(-3) : ":--";
  const [h, m] = time.split(":").map(Number);
  const dayPos = now ? ((h * 60 + m) / 1440) * 100 : 50;
  const diff = now ? zoneOffsetMinutes(now, timeZone) : 0;

  return (
    <Card className={className}>
      <CardLabel aside="GMT+3">YEREL SAAT</CardLabel>
      <div className="font-mono text-[2.6rem] leading-none font-medium tracking-[-0.05em] tabular-nums">
        {time}
        <small className="ml-1.5 font-mono text-xs font-normal tracking-normal text-ink-3">{seconds}</small>
      </div>
      <div className="grid gap-2">
        <div aria-hidden="true" className="relative h-1.5 rounded-full bg-[linear-gradient(90deg,#15171c_0_25%,#2a2614_35%_65%,#15171c_75%_100%)]">
          <i className="absolute -top-[3px] h-3 w-0.5 rounded-sm bg-mark not-italic" style={{ left: `${dayPos.toFixed(2)}%` }} />
        </div>
        <div className="flex justify-between gap-2 border-t border-dashed border-line-2 pt-2 font-mono text-xs">
          <span className="text-ink-3">İstanbul</span>
          <span className="tabular-nums">{time}</span>
        </div>
        <div className="flex justify-between gap-2 border-t border-dashed border-line-2 pt-2 font-mono text-xs">
          <span className="text-ink-3">Senin saatin</span>
          <span className="tabular-nums">{now ? formatTime(now) : "--:--"}</span>
        </div>
        {now && diff !== 0 ? (
          <p className="font-mono text-[11px] text-ink-3">
            İstanbul senden {formatOffset(diff)} {diff > 0 ? "ileride" : "geride"}.
          </p>
        ) : null}
      </div>
    </Card>
  );
}
