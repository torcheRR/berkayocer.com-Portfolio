import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="icerik" tabIndex={-1} className="outline-none grid place-items-center py-24 text-center">
      <div className="space-y-4">
        <p className="text-sm text-white/50">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold">Sayfa bulunamadı</h1>
        <p className="text-white/70">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
        <Link
          href="/"
          className="inline-block mt-2 px-4 py-2 rounded-lg border bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
