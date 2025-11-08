import type { NextConfig } from "next";
// @ts-ignore: no type definitions for next-pwa
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  turbopack: {}, 
};

export default withPWA(nextConfig);