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
      {
        source: "/projekte/blinhaus",
        destination: "/projekte",
        permanent: true,
      },
    ];
  },
  outputFileTracingIncludes: {
    "/reports/roman-minin": ["./private-reports/**"],
    "/anton": ["./private-anton/**"],
    "/anton/calendar.ics": ["./private-anton/**"],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
