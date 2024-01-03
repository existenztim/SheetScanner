/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'static.vecteezy.com'], // Add more domains as needed
  },
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    LOCAL_BASE_ROUTE: process.env.LOCAL_BASE_ROUTE,
    CLOUD_BASE_ROUTE: process.env.CLOUD_BASE_ROUTE,
    USER_ROUTE: process.env.USER_ROUTE,
    NOTE_ROUTE: process.env.NOTE_ROUTE,
  },
};

module.exports = nextConfig;
