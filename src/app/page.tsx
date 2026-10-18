import Sidebar from "@/components/Sidebar";
import SectionCard from "@/components/SectionCard";
import TechCarousel from "@/components/TechCarousel";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata({ description: site.description, path: "/" });

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Berkay Öcer",
  url: site.url,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Beykent Üniversitesi" },
  sameAs: site.socials.map((s) => s.href),
};

export default function Home() {
  return (
    <div className="w-full max-w-none grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 sm:gap-6 lg:gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Sidebar />

      <main id="icerik" tabIndex={-1} className="outline-none flex flex-col gap-4 sm:gap-6 lg:gap-8 min-w-0">
        <section id="hakkimda" className="bg-transparent">
          <h1 className="text-3xl sm:text-4xl font-bold">Hakkımda</h1>
          <div className="mt-2 space-y-4 text-white/70 leading-relaxed max-w-3xl">
            <p>
              Software Engineer (Yazılım Mühendisi) olarak web ve mobil uygulamalar geliştiriyorum.
              Java, C#/.NET, React, React Native, TypeScript ve SQL ile çalışıyor; öğrenmeye ve
              kendimi geliştirmeye devam ediyorum.
            </p>
          </div>
        </section>

        <div
          id="neler-yapiyorum"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <SectionCard
            title="Back-End Geliştirme"
            description="C#/.NET ve SQL ile sunucu tarafı geliştirme, console ve Windows Form uygulamaları; veri tabanı modelleme ve iş kuralları."
            icon="</>"
          />
          <SectionCard
            title="Front-End Geliştirme"
            description="React.js ve TypeScript ile kullanıcı arayüzleri; Firebase/Supabase entegrasyonu; responsive ve performans odaklı arayüzler."
            icon="🎨"
          />
        </div>

        <section id="kullandigim-teknolojiler" className="space-y-4">
          <h2 className="text-2xl font-semibold">Kullandığım Teknolojiler</h2>
          <TechCarousel />
        </section>
      </main>
    </div>
  );
}
