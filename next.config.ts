import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Pure HttpOnly Cookie ফ্রন্টএন্ড দিয়ে ব্যাকএন্ডে পাঠানোর জন্য Proxy Rewrites
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://code-bd-code-backend.vercel.app/api/v1/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;