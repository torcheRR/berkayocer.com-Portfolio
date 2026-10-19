import "../globals.css";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Frame } from "@/components/ui/Frame";

// Tüm site sayfalarının tek kabuğu: skip link, üst menü, çerçeveli sütun, footer.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-mark focus:px-4 focus:py-2 focus:font-medium focus:text-canvas"
      >
        İçeriğe geç
      </a>
      <SiteNav />
      <Frame className="print:max-w-none print:border-0">
        <main id="icerik" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </Frame>
    </div>
  );
}
