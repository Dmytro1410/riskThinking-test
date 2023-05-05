/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/risk-map",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
