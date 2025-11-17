export default () => ({
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DB_URL,
  },
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  GOOGLE_AUTH_CALLBACK_URL: process.env.GOOGLE_AUTH_CALLBACK_URL,
});
