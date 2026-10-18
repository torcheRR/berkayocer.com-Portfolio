"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { href: "/#isler", label: "İşler" },
  { href: "/#deneyim", label: "Deneyim", optional: true },
  { href: "/projeler", label: "Projeler" },
  { href: "/ozgecmisim", label: "Özgeçmiş" },
  { href: "/#iletisim", label: "İletişim" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Ana menü"
      className="pointer-events-none sticky top-[env(safe-area-inset-top,0px)] z-40 flex justify-center px-4 py-3 print:hidden"
    >
      <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-line-2 bg-panel/70 p-[5px] backdrop-blur-md">
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
      </div>
    </nav>
  );
}
