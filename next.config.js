/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    // Исключаем daynitejs из серверного бандла
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('daynitejs')
    }
    return config
  },
}

module.exports = nextConfig
