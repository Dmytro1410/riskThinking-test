/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  redirects: () => [
    {
      source: "/",
      destination: "/risk-map",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
