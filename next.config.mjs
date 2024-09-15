/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   typedRoutes: true,
  // },
  env: {
    BASE_API: process.env.BASE_API,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        // pathname: "/images/stock/**",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
        pathname: "/leaflet@1.7.1/dist/images/**",
      },
    ],
  },
};

export default nextConfig;
