"use client";

import { useEffect, useRef, useState } from "react";
import { MdEmail, MdLocationOn, MdWork } from "react-icons/md";
import SocialLinks from "./SocialLinks";
import { site } from "@/lib/site";

const emptyForm = { name: "", email: "", subject: "", message: "" };

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/50 focus:border-yellow-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/40 transition-colors";

export default function ContactSection() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  // Bot filtresi: formun açık kaldığı süre (tek saatle, istemcide ölçülür) ve görünmez honeypot alanı.
  const startedAt = useRef(0);
  const [company, setCompany] = useState("");

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorText("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company,
          elapsedMs: Math.round(performance.now() - startedAt.current),
        }),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorText(data.error || "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar dene.");
        return;
      }

      setStatus("success");
      setFormData(emptyForm);
    } catch {
      setStatus("error");
      setErrorText("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar dene.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="iletisim" className="space-y-6">
      <h1 className="text-2xl font-semibold">İletişim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">İletişim Bilgileri</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <MdEmail className="w-5 h-5 text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-white/60">E-posta</p>
                  <a href={`mailto:${site.email}`} className="hover:text-blue-400 transition-colors">
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <MdLocationOn className="w-5 h-5 text-red-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Konum</p>
                  <p>{site.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <MdWork className="w-5 h-5 text-purple-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Çalışma Durumu</p>
                  <p>Software Engineer (Yazılım Mühendisi)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Sosyal Medya</h2>
            <SocialLinks />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Mesaj Gönder</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm text-white/70 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Adınız"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-white/70 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  maxLength={200}
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm text-white/70 mb-2">
                Konu
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                maxLength={150}
                value={formData.subject}
                onChange={handleChange}
                className={inputClass}
                placeholder="Proje teklifi"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-white/70 mb-2">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                minLength={10}
                maxLength={5000}
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Mesajınızı buraya yazın..."
                required
              />
            </div>

            {/* Honeypot: ekran okuyuculardan ve klavyeden gizli, botlar doldurur. */}
            <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor="company">Şirket</label>
              <input
                type="text"
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full px-4 py-2 rounded-lg border font-medium transition-colors ${
                status === "loading"
                  ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-300 cursor-wait"
                  : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 cursor-pointer"
              }`}
            >
              {status === "loading" ? "Gönderiliyor..." : "Mesaj Gönder"}
            </button>
            <p
              role="status"
              aria-live="polite"
              className={`text-xs mt-1 min-h-4 ${status === "error" ? "text-red-400" : "text-emerald-400"}`}
            >
              {status === "success" && "Mesajın gönderildi, teşekkürler!"}
              {status === "error" && errorText}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
