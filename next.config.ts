import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Включаем статический экспорт для GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
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
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            fontawesome: {
              test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
              name: 'fontawesome',
              priority: 20,
              reuseExistingChunk: true,
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer',
              priority: 20,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    return config
  },

  // Настройки для статического хостинга
  basePath: process.env.NODE_ENV === 'production' ? '/template3' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/template3' : '',

  // SWC минификация включена по умолчанию в Next.js 15
};

export default nextConfig;
