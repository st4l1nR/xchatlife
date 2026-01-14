/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5085e00501634df38e5783f95d3fc3a8.r2.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default config;
