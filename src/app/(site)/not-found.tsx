import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false },
};

// Site içinde notFound() çağrıldığında (ör. bilinmeyen proje adresi) site kabuğu ve stilleriyle gösterilir.
export default function SiteNotFound() {
  return <NotFoundContent />;
}
