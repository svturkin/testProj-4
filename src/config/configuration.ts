export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost',
  authJwtSecretKey: process.env.AUTH_JWT_SECRET_KEY || 'jwt_secret_dev',
  accessTokenExpiresIn: '1h',
  refreshTokenExpiresIn: '10h',
});
