import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async redirects() {
    // Короткие ссылки для био соцсетей (DACH Million) — снаружи чисто, внутри UTM
    return [
      {
        source: "/ig",
        destination: "/?utm_source=instagram&utm_medium=bio&utm_campaign=ki_mit_andrii",
        permanent: false,
      },
      {
        source: "/tt",
        destination: "/?utm_source=tiktok&utm_medium=bio&utm_campaign=ki_mit_andrii",
        permanent: false,
      },
      {
        source: "/yt",
        destination: "/?utm_source=youtube&utm_medium=bio&utm_campaign=ki_mit_andrii",
        permanent: false,
      },
    ];
  },
  outputFileTracingIncludes: {
    "/reports/blinhaus-june-2026": ["./private-reports/**"],
    "/reports/blinhaus-june-12-23": ["./private-reports/**"],
    "/reports/blinhaus-june-24-30": ["./private-reports/**"],
    "/reports/blinhaus-june-summary": ["./private-reports/**"],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
