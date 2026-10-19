"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { gsap as GSAP } from "gsap";
import type { Flip as FlipPlugin } from "gsap/Flip";
import { Card, CardLabel, Chip } from "@/components/ui/primitives";
import { categoryLabel, techCategoryOrder } from "@/lib/content/labels";
import type { TechCategory } from "@/lib/content/schemas";
import { useMotionEnabled } from "@/lib/motion/preference";
import { cn } from "@/lib/cn";

type Tech = { slug: string; name: string; color: string; categories: TechCategory[] };
type FlipKit = { gsap: typeof GSAP; Flip: typeof FlipPlugin };

export function StackCard({ techs, className }: { techs: Tech[]; className?: string }) {
  const [active, setActive] = useState<TechCategory | "all">("all");
  const tabs: Array<TechCategory | "all"> = ["all", ...techCategoryOrder.filter((c) => techs.some((t) => t.categories.includes(c)))];
  const isVisible = (t: Tech) => active === "all" || t.categories.includes(active);
  const count = techs.filter(isVisible).length;

  const motion = useMotionEnabled();
  const list = useRef<HTMLUListElement>(null);
  const kit = useRef<FlipKit | null>(null);
  const loading = useRef(false);
  const pending = useRef<{ state: ReturnType<typeof FlipPlugin.getState>; height: number } | null>(null);

  // Flip yalnızca hareket açıksa ve sekmelere ilk yaklaşıldığında yüklenir.
  const loadKit = () => {
    if (!motion || loading.current) return;
    loading.current = true;
    Promise.all([import("gsap"), import("gsap/Flip")]).then(([g, f]) => {
      g.gsap.registerPlugin(f.Flip);
      kit.current = { gsap: g.gsap, Flip: f.Flip };
    });
  };

  const select = (tab: TechCategory | "all") => {
    const ul = list.current;
    if (motion && kit.current && ul) pending.current = { state: kit.current.Flip.getState(ul.children), height: ul.offsetHeight };
    setActive(tab);
  };

  // Çipler DOM'da kalır (display ile gizlenir) ki çıkanlar da canlandırılabilsin. Yalnızca çıkanlar
  // mutlak konumlanır; liste yüksekliği eskiden yeniye yumuşakça geçer, alttaki içerik zıplamaz.
  useLayoutEffect(() => {
    const p = pending.current;
    const k = kit.current;
    const ul = list.current;
    pending.current = null;
    if (!p || !k || !ul) return;
    const height = ul.offsetHeight;
    k.Flip.from(p.state, {
      duration: 0.45,
      ease: "power3.inOut",
      absoluteOnLeave: true,
      onEnter: (els) => k.gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.3 }),
      onLeave: (els) => k.gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.2 }),
    });
    if (height !== p.height) {
      k.gsap.fromTo(
        ul,
        { height: p.height, overflow: "hidden" },
        { height, duration: 0.45, ease: "power3.inOut", clearProps: "height,overflow" },
      );
    }
  }, [active]);

  return (
    <Card className={className}>
      <CardLabel aside={`(${count})`}>KULLANDIĞIM TEKNOLOJİLER</CardLabel>
      <div role="group" aria-label="Teknoloji kategorisi" onPointerEnter={loadKit} onFocus={loadKit} className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={active === tab}
            onClick={() => select(tab)}
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[11.5px] transition-colors",
              active === tab ? "border-ink bg-ink text-canvas" : "border-line-2 text-ink-2 hover:text-ink",
            )}
          >
            {tab === "all" ? "Tümü" : categoryLabel[tab]}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {count} teknoloji gösteriliyor
      </p>
      <ul ref={list} className="relative flex min-h-24 flex-wrap content-start gap-1.5">
        {techs.map((t) => (
          <li key={t.slug} data-flip-id={t.slug} style={isVisible(t) ? undefined : { display: "none" }}>
            <Chip color={t.color}>{t.name}</Chip>
          </li>
        ))}
      </ul>
    </Card>
  );
}
