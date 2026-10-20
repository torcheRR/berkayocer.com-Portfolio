import "../globals.css";
import "lenis/dist/lenis.css";
import { Suspense } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { GridOverlay } from "@/components/layout/GridOverlay";
import { Motion } from "@/components/motion/Motion";
import { Frame } from "@/components/ui/Frame";
import { PreviewIssues } from "@/components/preview/PreviewIssues";
import { PreviewToolsLazy } from "@/components/preview/PreviewToolsLazy";
import { getProfile, getReadMode } from "@/lib/content";

// Tüm site sayfalarının tek kabuğu: skip link, üst menü, çerçeveli sütun, footer, hareket katmanı.
// Önizlemede (yalnızca draft mode'daki site sahibi) ayrıca düzenleme katmanları, önizleme şeridi ve hata paneli.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, mode] = await Promise.all([getProfile(), getReadMode()]);
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
      {mode.preview ? (
        // Sabit şerit footer'ı örtmesin: sayfa sonuna şerit kadar boşluk.
        <div aria-hidden="true" className="h-[calc(88px+env(safe-area-inset-bottom,0px))] print:hidden" />
      ) : null}
      {mode.preview ? (
        <div className="fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-4 z-[60] flex max-w-[calc(100vw-32px)] flex-col items-start gap-2 print:hidden">
          <Suspense fallback={null}>
            <PreviewIssues />
          </Suspense>
          <PreviewToolsLazy perspective={mode.perspective} />
        </div>
      ) : null}
    </div>
  );
}
