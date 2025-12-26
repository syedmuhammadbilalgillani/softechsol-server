import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};
// Add the plugin only for server-side builds
if (process.env.NODE_ENV === "development") {
  const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");
  nextConfig.webpack = (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  };
}
export default nextConfig;
