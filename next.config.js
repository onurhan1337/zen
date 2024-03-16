/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "vercel.com",
      "avatars.githubusercontent.com",
      "github.com",
    ],
  },
};

module.exports = nextConfig;
