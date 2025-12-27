import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**', // Izinkan akses ke folder uploads backend
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // <--- IZIN GOOGLE
      },
    ],
  },
};

export default nextConfig;