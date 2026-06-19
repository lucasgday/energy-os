import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@energy-os/data-import", "@energy-os/domain", "@energy-os/economics"]
};

export default nextConfig;
