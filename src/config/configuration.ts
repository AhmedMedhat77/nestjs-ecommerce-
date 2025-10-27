export default () => ({
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DB_URL,
  },
  token: process.env.TOKEN_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});
