import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Frame } from "@/components/ui/Frame";

// Tüm site sayfalarının tek kabuğu: üst menü, çerçeveli sütun, footer.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <Frame className="print:max-w-none print:border-0">
        <main id="icerik" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </Frame>
    </>
  );
}
