"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Hakkımda" },
  { href: "/ozgecmisim", label: "Özgeçmişim" },
  { href: "/portfoyum", label: "Portföyüm" },
  { href: "/iletisim", label: "İletişim" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-2 z-40 -mx-2 sm:mx-0 mb-4 sm:mb-6">
      <ul className="flex flex-wrap justify-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap border transition-colors ${
                  active
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                    : "border-transparent hover:border-white/10 hover:bg-white/[0.06]"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
