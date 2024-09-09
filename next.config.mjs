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
    ],
  },
};

export default nextConfig;
