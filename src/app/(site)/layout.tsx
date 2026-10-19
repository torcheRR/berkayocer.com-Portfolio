import "../globals.css";
import "lenis/dist/lenis.css";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { GridOverlay } from "@/components/layout/GridOverlay";
import { Motion } from "@/components/motion/Motion";
import { Frame } from "@/components/ui/Frame";
import { getProfile } from "@/lib/content";

// Tüm site sayfalarının tek kabuğu: skip link, üst menü, çerçeveli sütun, footer, hareket katmanı.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
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
      <CommandPalette email={profile.email} socials={profile.socials.map(({ label, url }) => ({ label, url }))} />
      <GridOverlay />
      <Motion />
    </div>
  );
}
