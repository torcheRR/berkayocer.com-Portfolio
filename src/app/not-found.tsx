import "./globals.css";
import type { Metadata } from "next";
import { Frame } from "@/components/ui/Frame";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false },
};

// Hiçbir rotaya uymayan adresler için (site kabuğunun dışında).
export default function NotFound() {
  return (
    <Frame className="mt-16">
      <main id="icerik" tabIndex={-1} className="outline-none">
        <NotFoundContent />
      </main>
    </Frame>
  );
}
