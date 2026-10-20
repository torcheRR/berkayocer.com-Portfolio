import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Sanity Studio önizlemesi aynı origin'den iframe kullanacağı için 'none' yerine 'self'.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // Başka bir sitenin açtığı pencereyle bağ kopar: önizlemedeki düzenleme kanalına (postMessage) dışarıdan ulaşılamaz.
  // allow-popups: Studio'nun kendi açtığı önizleme penceresi çalışmaya devam eder. Site ve /studio'da aynı değer.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Sanity görselleri CDN'den kırpılmış ve boyutlandırılmış gelir. Optimizer yalnızca bu projenin
  // dataset'ine açık; başka Sanity projelerinin görselleri üzerinden kotanın tüketilmesi önlenir.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unset"}/${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}/**`,
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // v1 adresleri v2 bilgi mimarisine yönlenir.
  async redirects() {
    return [
      { source: "/portfoyum", destination: "/projeler", permanent: true },
      { source: "/iletisim", destination: "/#iletisim", permanent: true },
    ];
  },
};

export default nextConfig;
