/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow any https-hosted product image added from the admin panel
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
