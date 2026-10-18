import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHead({
  fig,
  title,
  count,
  id,
  as = "h2",
}: {
  fig: string;
  title: string;
  count?: string;
  id?: string;
  as?: ElementType;
}) {
  const Heading = as;
  return (
    <div className="flex items-baseline gap-3.5 px-4 pt-6 pb-4 sm:px-7 sm:pt-7">
      <span className="font-mono text-xs text-ink-3">{fig}</span>
      <Heading id={id} className="font-mono text-[clamp(1.45rem,3.2vw,1.95rem)] leading-[1.05] font-medium tracking-[-0.04em]">
        {title}
        {count ? <sup className="ml-1 align-top font-mono text-xs font-normal tracking-normal text-ink-3">{count}</sup> : null}
      </Heading>
      <span aria-hidden="true" className="h-px flex-1 self-center bg-line-2" />
    </div>
  );
}

export function Card({ as: Tag = "article", className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return (
    <Tag className={cn("relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-card border border-line bg-panel p-[18px]", className)}>
      {children}
    </Tag>
  );
}

export function CardLabel({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex justify-between gap-2.5 font-mono text-xs text-ink-3">
      <span>{children}</span>
      {aside ? <span>{aside}</span> : null}
    </div>
  );
}

export function Chip({ color, children }: { color?: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[7px] rounded-lg border border-line bg-panel-2 px-2.5 py-[5px] text-[12.5px] text-ink-2">
      <i aria-hidden="true" className="size-1.5 rounded-full bg-(--chip) not-italic" style={{ "--chip": color ?? "var(--color-ink-3)" } as CSSProperties} />
      {children}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-md border border-line-2 px-1.5 py-px font-mono text-[11px] text-ink-3">{children}</span>;
}

export function Tags({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-[5px]">
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}

type Tone = "mark" | "ok" | "info" | "muted";
const toneClass: Record<Tone, string> = {
  mark: "bg-mark shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mark)_14%,transparent)]",
  ok: "bg-ok",
  info: "bg-info",
  muted: "bg-ink-3",
};

export function StatusSquare({ tone = "muted" }: { tone?: Tone }) {
  return <i aria-hidden="true" className={cn("inline-block size-[7px] rounded-[1.5px] not-italic", toneClass[tone])} />;
}

export function Marker({ children }: { children: ReactNode }) {
  return <span className="marker whitespace-nowrap">{children}</span>;
}

// "==vurgu==" sözdizimini fosforlu kalem işaretine çevirir (Sanity'deki "Vurgula" mark'ının yerel karşılığı).
export function RichInline({ text }: { text: string }) {
  const parts = text.split(/(==[^=]+==)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("==") && part.endsWith("==") ? <Marker key={i}>{part.slice(2, -2)}</Marker> : <span key={i}>{part}</span>,
      )}
    </>
  );
}
