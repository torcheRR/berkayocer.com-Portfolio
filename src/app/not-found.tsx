import type { Metadata } from "next";
import Link from "next/link";
import { Frame, Row } from "@/components/ui/Frame";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Frame className="mt-16">
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Row className="grid justify-items-start gap-4 px-4 py-16 sm:px-7">
          <span className="font-mono text-xs text-ink-3">Fig. 404</span>
          <h1 className="font-mono text-[clamp(1.8rem,4.6vw,2.6rem)] leading-none font-medium tracking-[-0.045em]">Sayfa bulunamadı</h1>
          <p className="text-ink-2">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
          <Link href="/" className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-canvas hover:opacity-90">
            Ana sayfaya dön
          </Link>
        </Row>
      </main>
    </Frame>
  );
}
