/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photo-share-backend-alpha.vercel.app",
        port: "",
        pathname: "/api/image/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://photo-share-backend-alpha.vercel.app/api/:path*", // Fixed the destination
      },
    ];
  },
};

export default nextConfig;
