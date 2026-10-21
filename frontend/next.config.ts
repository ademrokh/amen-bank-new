import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows any https domain
      },
    ],
  },
    serverExternalPackages: ["pdf-parse", "pdfjs-dist"],

};

export default nextConfig;