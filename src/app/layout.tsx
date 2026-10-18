import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["Berkay ÖCER", "Yazılım Mühendisi", "C#", ".NET", "React", "Next.js", "Portfolyo"],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: site.name,
    url: "/",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@berkayocer_",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={geistSans.variable}>
      <body className="antialiased bg-[#0b0b0b] text-[#e6e6e6] overflow-x-hidden">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-yellow-400 focus:text-black focus:font-medium"
        >
          İçeriğe geç
        </a>
        <div className="min-h-dvh w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <TopNav />
          {children}
        </div>
      </body>
    </html>
  );
}
