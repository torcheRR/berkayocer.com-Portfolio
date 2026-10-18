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
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
