"use client";

import { useState } from "react";
import { FaGithub, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdWork } from "react-icons/md";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setStatus("error");
        alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar dene.");
        return;
      }

      setStatus("success");
      alert("Mesajın gönderildi, teşekkürler!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar dene.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="iletisim" className="space-y-6">
      <h2 className="text-2xl font-semibold">İletişim</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">İletişim Bilgileri</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <MdEmail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">E-posta</p>
                  <a
                    href="mailto:berkayocer2003@gmail.com"
                    className="hover:text-blue-400 transition-colors"
                  >
                    berkayocer2003@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <MdLocationOn className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Konum</p>
                  <p>İstanbul / Kağıthane</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <FaPhoneAlt className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Telefon</p>
                  <p>+90 534 484 6406</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <MdWork className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Çalışma Durumu</p>
                  <p>Yeni Mezun - İş Arayışında</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Sosyal Medya</h3>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/berkayocer"
                target="_blank"
                className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/20 transition-colors"
              >
                <FaLinkedin className="w-5 h-5 text-blue-400" />
              </a>
              <a
                href="https://github.com/torcheRR"
                target="_blank"
                className="w-10 h-10 rounded-lg bg-gray-500/10 border border-gray-500/30 flex items-center justify-center hover:bg-gray-500/20 transition-colors"
              >
                <FaGithub className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="https://x.com/berkayocer_"
                target="_blank"
                className="w-10 h-10 rounded-lg bg-black/10 border border-gray-500/30 flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <FaXTwitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/berkayocer_/"
                target="_blank"
                className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center hover:bg-pink-500/20 transition-colors"
              >
                <FaInstagram className="w-5 h-5 text-pink-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Mesaj Gönder</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-white/70 mb-2"
                >
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/50 focus:border-yellow-500/50 focus:outline-none transition-colors"
                  placeholder="Adınız"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-white/70 mb-2"
                >
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/50 focus:border-yellow-500/50 focus:outline-none transition-colors"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm text-white/70 mb-2"
              >
                Konu
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/50 focus:border-yellow-500/50 focus:outline-none transition-colors"
                placeholder="Proje teklifi"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm text-white/70 mb-2"
              >
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/50 focus:border-yellow-500/50 focus:outline-none transition-colors resize-none"
                placeholder="Mesajınızı buraya yazın..."
                required
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
            {status === "success" && (
              <p className="text-xs text-emerald-400 mt-1">
                Mesajın başarıyla gönderildi.
              </p>
            )}
            {status === "error" && (
              <p className="text-xs text-red-400 mt-1">
                Bir hata oluştu, lütfen tekrar dene.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
