"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// E-posta adresini panoya kopyalar; pano erişimi yoksa mailto'ya düşer.
export function CopyEmail({ email, variant = "pill", label }: { email: string; variant?: "pill" | "text"; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label="E-posta adresini kopyala"
        className="rounded-md border border-transparent px-2 py-0.5 text-ink-3 hover:border-line-2 hover:text-ink"
      >
        <span aria-live="polite">{copied ? "kopyalandı" : "kopyala"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center justify-between gap-2.5 rounded-full bg-ink py-2 pr-2 pl-3.5 text-[13px] font-medium text-canvas transition-opacity hover:opacity-90",
      )}
    >
      <span aria-live="polite">{copied ? "Kopyalandı" : (label ?? "E-postayı kopyala")}</span>
      <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-canvas text-ink">
        →
      </span>
    </button>
  );
}
