/** @type {import('next').NextConfig} */
const nextConfig = {
  // Added allowed image domains
  images: {
    domains: ["source.unsplash.com", "fluffy-scrawny-hedgehog.glitch.me"],
  },
};
export default nextConfig;
