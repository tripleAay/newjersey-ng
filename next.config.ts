import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "kqymeonftowhtgynerny.supabase.co",
        pathname:
          "/storage/v1/object/public/newjersey-product-images/**",
      },
    ],
  },
};

export default nextConfig;