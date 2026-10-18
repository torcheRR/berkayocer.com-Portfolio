import Sidebar from "@/components/Sidebar";
import PortfolioSection from "@/components/PortfolioSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Portföy",
  description:
    "Berkay ÖCER'in projeleri: TravelWise, Disney+ klonu, C# ile attribute tabanlı log yapısı ve diğer çalışmalar.",
  path: "/portfoyum",
});

export default function PortfolioPage() {
  return (
    <div className="w-full max-w-none grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 sm:gap-6 lg:gap-8">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main id="icerik" tabIndex={-1} className="outline-none flex flex-col gap-6 min-w-0">
        <PortfolioSection />
      </main>
    </div>
  );
}
