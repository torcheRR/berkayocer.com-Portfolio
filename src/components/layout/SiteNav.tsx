"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";

const links = [
  { href: "/#isler", label: "İşler" },
  { href: "/#deneyim", label: "Deneyim", optional: true },
  { href: "/projeler", label: "Projeler" },
  { href: "/ozgecmisim", label: "Özgeçmiş" },
  { href: "/#iletisim", label: "İletişim" },
];

export function SiteNav() {
  const pathname = usePathname();
  const indicator = useRef<HTMLSpanElement>(null);

  // Fareyle üzerine gelinen linkin arkasında kayan gösterge (yalnızca fare; dokunmatikte titremesin).
  const track = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = indicator.current;
    if (!el || e.pointerType !== "mouse") return;
    const link = e.currentTarget;
    el.style.width = `${link.offsetWidth}px`;
    el.style.transform = `translateX(${link.offsetLeft}px)`;
    el.style.opacity = "1";
  };
  const hide = () => {
    if (indicator.current) indicator.current.style.opacity = "0";
  };

  return (
    <nav
      aria-label="Ana menü"
      // Sayfa geçişlerinde menü sabit kalır (bkz. globals.css ::view-transition-group(site-header)).
      style={{ viewTransitionName: "site-header" }}
      className="pointer-events-none sticky top-[env(safe-area-inset-top,0px)] z-40 flex justify-center px-4 py-3 print:hidden"
    >
      <div
        onPointerLeave={hide}
        className="pointer-events-auto relative isolate flex max-w-full items-center gap-1 rounded-full border border-line-2 bg-panel/70 p-[5px] backdrop-blur-md"
      >
        <span
          ref={indicator}
          aria-hidden="true"
          className="absolute top-[5px] bottom-[5px] left-0 -z-10 rounded-full border border-line-2 bg-panel-2/70 opacity-0 transition-[transform,width,opacity] duration-300 ease-out"
        />
        <Link
          href="/"
          aria-label="BÖ, ana sayfa"
          className="grid size-[30px] shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] font-medium text-canvas"
        >
          BÖ
        </Link>
        {links.map((l) => {
          const active = !l.href.includes("#") && pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onPointerEnter={track}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full border px-2.5 py-1.5 text-[13px] whitespace-nowrap transition-colors sm:px-3",
                active ? "border-line-2 bg-panel-2 text-ink" : "border-transparent text-ink-2 hover:text-ink",
                l.optional && "max-sm:hidden",
              )}
            >
              {l.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
          aria-label="Komut paletini aç (Ctrl veya ⌘ ile K)"
          className="ml-0.5 rounded-full border border-line-2 px-2.5 py-1 font-mono text-xs text-ink-2 hover:border-ink-3 hover:text-ink max-sm:hidden"
        >
          ⌘K
        </button>
      </div>
    </nav>
  );
}
