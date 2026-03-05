/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photo-share-backend-production.up.railway.app",
        pathname: "/**",
        
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://photo-share-backend-production.up.railway.app/*', // The URL of the external API
      },
    ];
  },
};

export default nextConfig;
