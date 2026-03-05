/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://railway.com/project/58ea7f4d-eeb1-4eb7-9bf4-75bb4abdb89d?environmentId=7cfa99e0-4d12-4875-a71d-539a10ed6ba8",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
