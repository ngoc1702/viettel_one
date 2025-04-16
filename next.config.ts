import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental:{
  //   staleTimes:{
  //     dynamic:30,
  //   },
  // },
  images: {
    domains: ['cdn.sanity.io'],
  },
};


export default nextConfig;
