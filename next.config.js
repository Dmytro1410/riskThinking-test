/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/risk-map",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
