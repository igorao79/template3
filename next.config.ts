import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Включаем статический экспорт для GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Оптимизация производительности
  experimental: {
    optimizePackageImports: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
  },

  // Компрессия и минификация
  compress: true,
  
  // Webpack оптимизации
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для продакшена
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
              chunks: 'initial',
            },
            fontawesome: {
              test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
              name: 'fontawesome',
              priority: 30,
              reuseExistingChunk: true,
              chunks: 'all',
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer',
              priority: 25,
              reuseExistingChunk: true,
              chunks: 'async',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
        usedExports: true,
        sideEffects: false,
      }
    }

    // Улучшение tree shaking
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@fortawesome/,
      sideEffects: false,
    })

    return config
  },

  // Настройки для статического хостинга
  basePath: process.env.NODE_ENV === 'production' ? '/template3' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/template3' : '',

  // SWC минификация включена по умолчанию в Next.js 15
};

export default nextConfig;
