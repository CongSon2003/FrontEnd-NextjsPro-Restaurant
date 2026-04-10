import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true, // Giữ nguyên các config cũ của bạn
  images: {
    // Cho phép fetch ảnh từ private IP (localhost)
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**' // Cho phép tất cả
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**' // This allows any image path from this domain
      }
    ]
  }
}

export default nextConfig
