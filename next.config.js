/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api-thermovisi.motech.id',
                port: '443',
                pathname: '/storage/**',
            },
        ],
        unoptimized: true,
    },
}

module.exports = nextConfig
