/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly disable App Router to prevent conflict with Pages Router
  experimental: {
    appDir: false,
  },
  // Webpack config to exclude app directory from build
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/app/**'],
    };
    return config;
  },
  // Turbopack config to exclude app directory
  turbopack: {
    resolveAlias: {
      '@': './pages',
    },
  },
}

module.exports = nextConfig
