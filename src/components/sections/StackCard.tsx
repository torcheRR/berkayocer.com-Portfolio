"use client";

import { useState } from "react";
import { Card, CardLabel, Chip } from "@/components/ui/primitives";
import { categoryLabel, techCategoryOrder } from "@/lib/content/labels";
import type { TechCategory } from "@/lib/content/schemas";
import { cn } from "@/lib/cn";

type Tech = { slug: string; name: string; color: string; categories: TechCategory[] };

export function StackCard({ techs, className }: { techs: Tech[]; className?: string }) {
  const [active, setActive] = useState<TechCategory | "all">("all");
  const tabs: Array<TechCategory | "all"> = ["all", ...techCategoryOrder.filter((c) => techs.some((t) => t.categories.includes(c)))];
  const visible = active === "all" ? techs : techs.filter((t) => t.categories.includes(active));

  return (
    <Card className={className}>
      <CardLabel aside={`(${visible.length})`}>KULLANDIĞIM TEKNOLOJİLER</CardLabel>
      <div role="group" aria-label="Teknoloji kategorisi" className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={active === tab}
            onClick={() => setActive(tab)}
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
        {visible.length} teknoloji gösteriliyor
      </p>
      <ul className="flex min-h-24 flex-wrap content-start gap-1.5">
        {visible.map((t) => (
          <li key={t.slug}>
            <Chip color={t.color}>{t.name}</Chip>
          </li>
        ))}
      </ul>
    </Card>
  );
}
