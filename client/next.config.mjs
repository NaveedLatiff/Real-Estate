/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.remotePatterns",
      },
    ],
  },

};

export default nextConfig;