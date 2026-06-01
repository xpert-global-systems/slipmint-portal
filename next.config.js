/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false, // Disable App Router - using Pages Router only
  }
}

module.exports = nextConfig
