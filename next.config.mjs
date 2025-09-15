/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 优化配置
  trailingSlash: true,
  output: 'export',
  distDir: '.next',

  // 图片优化 - Cloudflare Pages 兼容
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack 配置优化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

export default nextConfig