import Image from "next/image";
import type { CSSProperties } from "react";
import type { ImageRef } from "@/lib/content/schemas";
import { cn } from "@/lib/cn";

// Kapak görseli varsa (Sanity) onu, yoksa markanın rengiyle üretilen kapağı gösterir.
export function ProjectCover({
  mark,
  brand,
  image,
  label,
  className,
  large,
  priority,
}: {
  mark: string;
  brand: string;
  image?: ImageRef;
  label?: string;
  className?: string;
  large?: boolean;
  priority?: boolean;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden border-b border-line bg-panel", className)}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={large ? "(min-width: 920px) 920px, 100vw" : "(min-width: 768px) 430px, 100vw"}
          priority={priority}
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden border-b border-line", className)}
      style={
        {
          "--brand": brand,
          background:
            "radial-gradient(120% 90% at 85% 10%, color-mix(in srgb, var(--brand) 38%, transparent), transparent 60%), linear-gradient(var(--color-line) 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg, var(--color-line) 1px, transparent 1px) 0 0 / 28px 28px, #0c0d10",
        } as CSSProperties
      }
    >
      {label ? <span className="absolute top-2.5 right-3 font-mono text-xs text-ink-3">{label}</span> : null}
      <span
        className={cn(
          "absolute bottom-3 left-[18px] font-mono leading-none font-medium tracking-[-0.06em] text-ink/90",
          large ? "text-[clamp(3rem,9vw,4.8rem)]" : "text-[3.4rem]",
        )}
      >
        {mark}
      </span>
    </div>
  );
}
