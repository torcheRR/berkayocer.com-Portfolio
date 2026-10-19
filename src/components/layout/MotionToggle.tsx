"use client";

import { useState, useSyncExternalStore } from "react";
import { setMotionPreference, useMotionEnabled } from "@/lib/motion/preference";
import { cn } from "@/lib/cn";

const subscribeSystem = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// Footer'daki "Hareketi azalt" anahtarı. Etiket sabittir, durumu aria-pressed ve kutucuk gösterir.
// Sistem zaten hareketi azaltıyorsa gösterilmez.
export function MotionToggle() {
  const enabled = useMotionEnabled();
  const systemReduced = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [message, setMessage] = useState("");
  if (systemReduced) return null;

  const toggle = () => {
    setMotionPreference(enabled);
    setMessage(enabled ? "Hareket azaltıldı" : "Hareket açıldı");
  };

  return (
    <li>
      <button type="button" aria-pressed={!enabled} onClick={toggle} className="inline-flex items-center gap-1.5 hover:text-ink">
        <span aria-hidden="true" className={cn("size-2 rounded-[2px] border", enabled ? "border-current" : "border-mark bg-mark")} />
        Hareketi azalt
      </button>
      <span role="status" className="sr-only">
        {message}
      </span>
    </li>
  );
}
