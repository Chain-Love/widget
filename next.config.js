/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Do not use X-Frame-Options: DENY/SAMEORIGIN
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.gitbook.com https://*.gitbook.io",
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
