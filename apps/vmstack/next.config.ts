/** @type {import('next').NextConfig} */
const path = require("path");
const { NormalModuleReplacementPlugin } = require("webpack");

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  transpilePackages: [
    "connectkit",
    "@polkadot/types",
    "@polkadot/api",
    "@txnlab/use-wallet-react"
  ],
  webpack: (config, { webpack, isServer }) => {
    // Add the resolve.alias configuration here
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@solana/wallet-adapter-react': path.resolve('../../node_modules/@solana/wallet-adapter-react/lib/esm')
      }
    };

    if (isServer) {
      // Module not found
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /(^@google-cloud\/spanner|^@mongodb-js\/zstd|^aws-crt|^aws4$|^pg-native$|^mongodb-client-encryption$|^@sap\/hana-client$|^snappy$|^pino-pretty$|^lokijs$|^react-native-sqlite-storage$|^bson-ext$|^cardinal$|^kerberos$|^hdb-pool$|^sql.js$|^sqlite3$|^better-sqlite3$|^ioredis$|^typeorm-aurora-data-api-driver$|^pg-query-stream$|^oracledb$|^mysql$|^snappy\/package\.json$|^cloudflare:sockets$)/,
        }),
      );
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
      unknownContextCritical: false
    };

    return config;
  },

  images: {
    remotePatterns: [
      {
        hostname: "www.google.com",
      },
      {
        hostname: "192.168.1.160",
      },
      {
        hostname: "localhost",
      },
      {
        hostname: "home.localhost",
      },
      {
        hostname: "vmkit.xyz",
      },
    ],
  },
};

module.exports = nextConfig;