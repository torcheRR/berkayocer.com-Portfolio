"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "subject" | "message";
const empty: Record<Field, string> = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const errors: Record<Field, string> = {
  name: "Adını yaz.",
  email: "Geçerli bir e-posta adresi yaz.",
  subject: "Konu boş olamaz.",
  message: "En az 10 karakter yaz.",
};

function validate(values: Record<Field, string>): Field[] {
  const bad: Field[] = [];
  if (!values.name.trim()) bad.push("name");
  if (!EMAIL_RE.test(values.email.trim())) bad.push("email");
  if (!values.subject.trim()) bad.push("subject");
  if (values.message.trim().length < 10) bad.push("message");
  return bad;
}

const inputClass =
  "w-full rounded-[10px] border border-field bg-canvas px-3 py-2.5 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-mark/60 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-mark)_14%,transparent)]";

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [invalid, setInvalid] = useState<Field[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  // Bot filtresi: formun açık kaldığı süre tek saatle, istemcide ölçülür.
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const update = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (invalid.includes(field) && !validate(next).includes(field)) {
      setInvalid(invalid.filter((f) => f !== field));
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const bad = validate(values);
    setInvalid(bad);
    if (bad.length) {
      setStatus("error");
      setMessage("İşaretli alanları kontrol et.");
      (e.currentTarget.elements.namedItem(bad[0]) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("loading");
    setMessage("Gönderiliyor…");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company, elapsedMs: Math.round(performance.now() - startedAt.current) }),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar dene.");
        return;
      }
      setStatus("success");
      setMessage("Mesajın gönderildi, teşekkürler!");
      setValues(empty);
    } catch {
      setStatus("error");
      setMessage("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar dene.");
    }
  };

  const field = (name: Field, describedBy?: string) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    onChange: update(name),
    required: true,
    "aria-invalid": invalid.includes(name) || undefined,
    "aria-describedby": [describedBy, invalid.includes(name) ? `f-${name}-err` : ""].filter(Boolean).join(" ") || undefined,
    className: cn(inputClass, invalid.includes(name) && "border-err"),
  });

  const label = (name: Field, text: string) => (
    <label htmlFor={`f-${name}`} className="font-mono text-xs text-ink-2">
      {text}
    </label>
  );

  const err = (name: Field) =>
    invalid.includes(name) ? (
      <small id={`f-${name}-err`} className="text-xs text-err">
        {errors[name]}
      </small>
    ) : null;

  return (
    // method="post": JS yüklenmeden gönderilirse bile kişisel veriler URL'ye düşmesin.
    <form method="post" onSubmit={submit} noValidate aria-labelledby="cform-title" aria-describedby="cform-note" className="relative grid min-w-0 gap-3.5 p-[18px]">
      <div className="flex justify-between gap-2.5 font-mono text-xs text-ink-3">
        <span id="cform-title">MESAJ GÖNDER</span>
        <span>Fig. 06a</span>
      </div>
      <p id="cform-note" className="-mt-2 text-xs text-ink-3">
        Tüm alanlar zorunlu.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="grid min-w-0 gap-1.5">
          {label("name", "Ad Soyad")}
          <input {...field("name")} type="text" autoComplete="name" maxLength={100} placeholder="Adın" />
          {err("name")}
        </div>
        <div className="grid min-w-0 gap-1.5">
          {label("email", "E-posta")}
          <input {...field("email")} type="email" autoComplete="email" maxLength={200} placeholder="ornek@mail.com" />
          {err("email")}
        </div>
      </div>
      <div className="grid min-w-0 gap-1.5">
        {label("subject", "Konu")}
        <input {...field("subject")} type="text" maxLength={150} placeholder="Proje teklifi, iş görüşmesi…" />
        {err("subject")}
      </div>
      <div className="grid min-w-0 gap-1.5">
        <div className="flex justify-between gap-2">
          {label("message", "Mesaj")}
          <span id="f-message-count" className="font-mono text-xs text-ink-3">
            {values.message.length}/5000
          </span>
        </div>
        <textarea
          {...field("message", "f-message-count")}
          rows={5}
          maxLength={5000}
          placeholder="Mesajını buraya yaz…"
          className={cn(inputClass, invalid.includes("message") && "border-err", "min-h-[120px] resize-y")}
        />
        {err("message")}
      </div>

      {/* Honeypot: ekran okuyuculardan ve klavyeden gizli, botlar doldurur. */}
      <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="f-company">Şirket</label>
        <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p
          role="status"
          aria-live="polite"
          className={cn("max-w-[38ch] text-[13px]", status === "success" ? "text-ok" : status === "error" ? "text-err" : "text-ink-3")}
        >
          {message}
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="grid size-[116px] shrink-0 place-items-center rounded-full bg-mark text-center text-[13px] leading-tight font-semibold text-[#15130a] transition-transform hover:scale-[1.03] disabled:cursor-wait disabled:opacity-75"
        >
          {status === "loading" ? "Gönderiliyor…" : (
            <span>
              Mesajı
              <br />
              gönder
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
