/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        // port: '', // Отключено
        pathname: '/**',
      },
    ],
  },
  // Разрешаем cross-origin запросы в режиме разработки
  allowedDevOrigins: [
    '192.168.1.6',
    '192.168.1.60',
    'localhost',
    '127.0.0.1',
  ],
}

module.exports = nextConfig
