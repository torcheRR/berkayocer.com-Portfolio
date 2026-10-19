import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";

// Kök layout yalnızca html/body ve fontları kurar. Site stilleri (Tailwind) ve skip link
// (site)/layout.tsx'te; böylece /studio'daki Sanity Studio site CSS'inden etkilenmez.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["Berkay Öcer", "Yazılım Mühendisi", "Software Engineer", "C#", ".NET", "React", "React Native", "Next.js"],
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

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
