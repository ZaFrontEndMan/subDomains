const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  images: {
    domains: [
      'flagcdn.com',
      "upload.wikimedia.org",
      "d2gkkc94h304b1.cloudfront.net",
      'api.dev.telgani.com',
      'api.uat.telgani.com'
    ],
  },
  env: {
    JWT_SIGNING_PRIVATE_KEY: '2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8',
    MAP_API_KEY: 'AIzaSyCsmWfu1AwP4oZvfYxpVpdPwFMXSWyQ-sI'
  },
};

module.exports = nextConfig;
// AIzaSyA6MAm8eIW4N0WKJ6yco_pUuO0qiWvqj-Y