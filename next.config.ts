import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
// Force Next.js dev server restart to load newly generated Prisma Client
