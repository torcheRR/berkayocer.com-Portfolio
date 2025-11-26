import SectionCard from "./SectionCard";

export default function ResumeSection() {
  return (
    <section id="ozgecmisim" className="space-y-6">
      <h2 className="text-2xl font-semibold">Özgeçmişim</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="Eğitim"
          description="Beykent Üniversitesi, Yazılım Mühendisliği (2021–2025), Yeni Mezun — AGNO: 2.82"
          icon="🎓"
        />

        <SectionCard
          title="Özet"
          description="Yeni mezun Yazılım Mühendisi. Java, C#, React.js, JavaScript ve SQL ile geliştirme deneyimi. Öğrenmeye ve kendini geliştirmeye açık."
          icon="🧩"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4  cursor-default">
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-2">ENKA Power — Stajyer</h3>
          <p className="text-sm text-white/70">
            07.2025 – 08.2025 | Balmumcu/İstanbul
          </p>
          <p className="text-sm text-white/70 mt-2 leading-relaxed">
            C#, .NET ve SQL ile sunucu üzerinde çalışacak kullanıcı ve uygulama
            yönetimi sağlayan console ve Windows Form uygulamaları geliştirdim.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-2">
            Ziraat Teknoloji — Stajyer
          </h3>
          <p className="text-sm text-white/70">
            07.2024 – 08.2024 | Esenler/İstanbul
          </p>
          <p className="text-sm text-white/70 mt-2 leading-relaxed">
            React.js öğrendim; JavaScript, MySQL, C#(.NET) alanlarında bilgi
            birikimimi artırdım. DisneyPlusClone, Attribute ile Log yapısı,
            ToDo, basit e‑ticaret gibi projeler geliştirdim.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-2">
            Realtor Global — Gönüllü Stajyer
          </h3>
          <p className="text-sm text-white/70">
            07.2023 – 09.2023 | Kağıthane/İstanbul
          </p>
          <p className="text-sm text-white/70 mt-2 leading-relaxed">
            Yazılım geliştirme (JavaScript) ve IT tarafında Active Directory ile
            sunucu yönetimi konusunda deneyim kazandım.
          </p>
        </div>
      </div>
    </section>
  );
}
