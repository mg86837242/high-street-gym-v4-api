const devConfig = {
  DB_HOST: process.env.DB_HOST_DEV || 'Replace with MySQL connection hostname of choice',
  DB_USER: process.env.DB_USER_DEV || 'Replace with MySQL connection username of choice',
  DB_PASSWORD: process.env.DB_PASSWORD_DEV || 'Replace with MySQL connection password of choice',
  DB_SCHEMA: process.env.DB_SCHEMA_DEV || 'Replace with MySQL schema name of choice',
  CORS_ORIGIN: process.env.CORS_ORIGIN_DEV,
  SESSION_COOKIE_SECURE: false,
  SESSION_COOKIE_HTTP_ONLY: true,
};
const testConfig = {
  DB_HOST: process.env.DB_HOST_TEST || 'Replace with MySQL connection hostname of choice',
  DB_USE: process.env.DB_USER_TEST || 'Replace with MySQL connection username of choice',
  DB_PASSWORD: process.env.DB_PASSWORD_TEST || 'Replace with MySQL connection password of choice',
  DB_SCHEMA: process.env.DB_SCHEMA_TEST || 'Replace with MySQL schema name of choice',
  CORS_ORIGIN: process.env.CORS_ORIGIN_TEST,
  SESSION_COOKIE_SECURE: false,
  SESSION_COOKIE_HTTP_ONLY: true,
};
const prodConfig = {
  DB_HOST: process.env.DB_HOST_PROD || 'Replace with MySQL connection hostname of choice',
  DB_USER: process.env.DB_USER_PROD || 'Replace with MySQL connection username of choice',
  DB_PASSWORD: process.env.DB_PASSWORD_PROD || 'Replace with MySQL connection password of choice',
  DB_SCHEMA: process.env.DB_SCHEMA_PROD || 'Replace with MySQL schema name of choice',
  CORS_ORIGIN: process.env.CORS_ORIGIN_PROD,
  SESSION_COOKIE_SECURE: true,
  SESSION_COOKIE_HTTP_ONLY: false,
};
const defaultConfig = {
  PORT: process.env.PORT || 3000,
  SESSION_SECRET: process.env.SESSION_SECRET || 'my session secret',
};

function envConfig(env) {
  switch (env) {
    case 'test':
      return testConfig;
    case 'production':
      return prodConfig;
    default:
      return devConfig;
  }
}

export default { ...defaultConfig, ...envConfig(process.env.NODE_ENV) };
