const TerserPlugin = require('terser-webpack-plugin');
const withPWA = require('next-pwa');

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  runtimeCaching: [],
})({
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              pure_funcs: ['console.log'],
            },
          },
        }),
      ];
    }

    return config;
  },
});

module.exports = nextConfig;
