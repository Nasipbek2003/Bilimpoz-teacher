/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Разрешаем cross-origin запросы в режиме разработки
  allowedDevOrigins: [
    '192.168.1.6',
    'localhost',
    '127.0.0.1',
  ],
}

module.exports = nextConfig
