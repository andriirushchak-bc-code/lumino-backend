/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/brief',     destination: '/brief.html'     },
      { source: '/tech-docs', destination: '/tech-docs.html' },
    ];
  },
};

module.exports = nextConfig;
