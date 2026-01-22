/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mailgen"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
