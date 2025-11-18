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
};
// Add the plugin only for server-side builds
if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
  const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");
  nextConfig.webpack = (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  };
}
export default nextConfig;
