import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berkay ÖCER | Portfolyo",
  description: "Berkay ÖCER'in kişisel portfolyo sitesi.",
  metadataBase: new URL("https://example.com"),
  keywords: ["Berkay ÖCER", "Frontend", "React", "Next.js", "Portfolyo"],
  openGraph: {
    title: "Berkay ÖCER | Portfolyo",
    description: "Berkay ÖCER'in kişisel portfolyo sitesi.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0b] text-[#e6e6e6] overflow-x-hidden`}
      >
        <div className="min-h-dvh w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <TopNav />
          {children}
        </div>
      </body>
    </html>
  );
}
