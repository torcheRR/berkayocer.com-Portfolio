import Sidebar from "@/components/Sidebar";
import ResumeSection from "@/components/ResumeSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Özgeçmiş",
  description:
    "Berkay ÖCER'in eğitimi ve staj deneyimleri: Beykent Üniversitesi, ENKA Power, Ziraat Teknoloji ve Realtor Global.",
  path: "/ozgecmisim",
});

export default function ResumePage() {
  return (
    <div className="w-full max-w-none grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 sm:gap-6 lg:gap-8">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main id="icerik" tabIndex={-1} className="outline-none flex flex-col gap-6 min-w-0">
        <ResumeSection />
      </main>
    </div>
  );
}
