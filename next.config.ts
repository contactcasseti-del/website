import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  outputFileTracingIncludes: {
    '/**/*': ['./prisma/dev.db'],
  },
};

export default nextConfig;

