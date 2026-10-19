"use client";

import { useEffect, useState } from "react";
import { TOGGLE_GRID_EVENT } from "./CommandPalette";

// Komut paletinden açılan 12 sütunluk tasarım ızgarası (küçük bir mühendislik göz kırpması).
export function GridOverlay() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const toggle = () => setOn((v) => !v);
    window.addEventListener(TOGGLE_GRID_EVENT, toggle);
    return () => window.removeEventListener(TOGGLE_GRID_EVENT, toggle);
  }, []);

  if (!on) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 print:hidden">
      <div className="mx-auto grid h-full max-w-col grid-cols-12 gap-3 px-4 sm:px-7">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} className="border-x border-mark/20 bg-mark/[0.05] not-italic" />
        ))}
      </div>
    </div>
  );
}
