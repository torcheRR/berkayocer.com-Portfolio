"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-line-2 px-3 py-1.5 font-mono text-xs text-ink-2 hover:border-ink-3 hover:text-ink print:hidden"
    >
      Yazdır / PDF olarak kaydet
    </button>
  );
}
