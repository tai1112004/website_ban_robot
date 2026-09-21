import type { NextConfig } from 'next';
const config: NextConfig = {
  devIndicators: false,
  images: {
    localPatterns: [
      {
        pathname: '/images/**',
      },
    ],
  },
};
export default config;
