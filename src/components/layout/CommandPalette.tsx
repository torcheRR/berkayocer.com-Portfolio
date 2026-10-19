"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { setMotionPreference, systemPrefersReducedMotion, useMotionEnabled } from "@/lib/motion/preference";

export const OPEN_PALETTE_EVENT = "bo:open-palette";
export const TOGGLE_GRID_EVENT = "bo:toggle-grid";

type Command = { id: string; label: string; hint: string; run?: () => void; href?: string };

// ⌘K / Ctrl+K ile açılan komut paleti. Yerleşik <dialog> odak tuzağını, Esc'yi ve arka planın
// etkisizleştirilmesini sağlar.
export function CommandPalette({ email, socials }: { email: string; socials: { label: string; url: string }[] }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [notice, setNotice] = useState("");
  // Liste yalnızca palet açıkken çizilir (sunucu ve ilk hidrasyon çıktısı aynı kalır).
  const [isOpen, setIsOpen] = useState(false);
  const motion = useMotionEnabled();

  const close = () => dialog.current?.close();

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const list: Command[] = [
      { id: "isler", label: "Seçili işlere git", hint: "/#isler", run: go("/#isler") },
      { id: "deneyim", label: "Deneyime git", hint: "/#deneyim", run: go("/#deneyim") },
      { id: "projeler", label: "Tüm projeler", hint: "/projeler", run: go("/projeler") },
      { id: "ozgecmis", label: "Özgeçmiş", hint: "/ozgecmisim", run: go("/ozgecmisim") },
      { id: "iletisim", label: "İletişime git", hint: "/#iletisim", run: go("/#iletisim") },
      {
        id: "eposta",
        label: "E-posta adresini kopyala",
        hint: email,
        run: () => {
          navigator.clipboard.writeText(email).then(
            () => setNotice("E-posta kopyalandı"),
            () => setNotice(email),
          );
        },
      },
      ...socials.map((s) => ({ id: `social-${s.label}`, label: `${s.label} profilini aç`, hint: s.url.replace("https://", ""), href: s.url })),
      { id: "izgara", label: "Izgarayı göster / gizle", hint: "tasarım ızgarası", run: () => window.dispatchEvent(new Event(TOGGLE_GRID_EVENT)) },
    ];
    if (motion) list.push({ id: "hareket", label: "Hareketi azalt", hint: "erişilebilirlik", run: () => setMotionPreference(true) });
    else if (isOpen && !systemPrefersReducedMotion()) {
      list.push({ id: "hareket", label: "Hareketi aç", hint: "erişilebilirlik", run: () => setMotionPreference(false) });
    }
    return list;
  }, [email, socials, router, motion, isOpen]);

  const visible = commands.filter((c) => c.label.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")));
  const active = Math.min(selected, Math.max(0, visible.length - 1));
  const activeId = visible[active] ? `cmd-${visible[active].id}` : undefined;

  // Ok tuşlarıyla seçilen komut listenin görünür alanında kalır.
  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  useEffect(() => {
    const open = () => {
      setQuery("");
      setSelected(0);
      setNotice("");
      setIsOpen(true);
      if (!dialog.current?.open) dialog.current?.showModal();
      input.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, []);

  const execute = (c: Command | undefined) => {
    if (!c) return;
    if (c.href) {
      window.open(c.href, "_blank", "noopener,noreferrer");
      close();
      return;
    }
    c.run?.();
    if (c.id !== "eposta") close();
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((active + 1) % Math.max(1, visible.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((active - 1 + visible.length) % Math.max(1, visible.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      execute(visible[active]);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Komut paleti"
      // Lenis tekerlek olaylarını sayfaya yönlendirmesin; liste kendi içinde kaysın.
      data-lenis-prevent
      onClose={() => setIsOpen(false)}
      onClick={(e) => e.target === dialog.current && close()}
      className="m-auto mt-[14vh] w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-card border border-line-2 bg-panel p-0 text-ink shadow-[0_30px_80px_rgb(0_0_0/0.5)] backdrop:bg-black/60 print:hidden"
    >
      <input
        ref={input}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(0);
        }}
        onKeyDown={onInputKey}
        placeholder="Komut ara…"
        aria-label="Komut ara"
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-list"
        aria-activedescendant={activeId}
        autoComplete="off"
        className="w-full border-b border-line bg-transparent px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-ink-3"
      />
      <ul id="palette-list" role="listbox" aria-label="Komutlar" className="max-h-[50vh] overflow-y-auto p-1.5">
        {(isOpen ? visible : []).map((c, i) => (
          <li
            key={c.id}
            id={`cmd-${c.id}`}
            role="option"
            aria-selected={i === active}
            onPointerMove={() => setSelected(i)}
            onClick={() => execute(c)}
            className={cn(
              "flex cursor-pointer justify-between gap-3 rounded-lg px-3 py-2.5 text-sm",
              i === active ? "bg-panel-2 text-ink" : "text-ink-2",
            )}
          >
            <span>{c.label}</span>
            <span className="truncate font-mono text-xs text-ink-3">{c.hint}</span>
          </li>
        ))}
      </ul>
      <p role="status" className="border-t border-line px-4 py-2 font-mono text-xs text-ink-3">
        {notice || (isOpen && !visible.length ? "Sonuç yok" : "↑↓ seç · Enter çalıştır · Esc kapat")}
      </p>
    </dialog>
  );
}
