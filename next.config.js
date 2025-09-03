/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: [
      'p0.ssl.qhimg.com',
      'p1.ssl.qhimg.com',
      'p2.ssl.qhimg.com',
      'p3.ssl.qhimg.com',
      'p4.ssl.qhimg.com',
      'p5.ssl.qhimg.com',
    ]
  },
  experimental: {
    forceSwcTransforms: true,
  },
});
