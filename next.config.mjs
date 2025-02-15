/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "img.freepik.com", "images.generated.photos", 'rentmytime-storage.s3.eu-west-2.amazonaws.com', 'randomuser.me'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rentmytime-storage.s3.eu-west-2.amazonaws.com',
        port: "",
        pathname: '/**',
      },
    ],
  },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
