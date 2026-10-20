import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { motionInitScript, previewLockScript } from "@/lib/motion/init";
import { isPreview } from "@/lib/content";

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-motion, boyamadan önce satır içi script ile eklenir; hidrasyon uyarısı bilinçli olarak bastırılır.
    // data-scroll-behavior: Next 16 sayfa geçişlerinde CSS'teki smooth scroll'u yalnızca bu işaret varsa kapatır;
    // yoksa yeni sayfa en üste atlamak yerine aşağıdan kayarak açılır.
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
        {/* Önizlemede (draft mode) hareket kilidi her sayfada, istemci kodu çalışmadan önce uygulanır.
            draftMode() prerender'da false döner; ziyaretçi sayfaları statik kalır. */}
        {(await isPreview()) ? <script dangerouslySetInnerHTML={{ __html: previewLockScript }} /> : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
