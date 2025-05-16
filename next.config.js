/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["app.localhost:3000", "*.localhost:3000", "http://127.0.0.1:3000"],
};

export default nextConfig;
