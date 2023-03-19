const devConfig = {
  DB_HOST: process.env.DB_HOST_DEV || 'Replace with MySQL connection hostname of choice',
  DB_USER: process.env.DB_USER_DEV || 'Replace with MySQL connection username of choice',
  DB_PASSWORD: process.env.DB_PASSWORD_DEV || 'Replace with MySQL connection password of choice',
  DB_SCHEMA: process.env.DB_SCHEMA_DEV || 'Replace with MySQL schema name of choice',
};
const testConfig = {
  DB_HOST: process.env.DB_HOST_TEST || 'Replace with MySQL connection hostname of choice',
  DB_USE: process.env.DB_USER_TEST || 'Replace with MySQL connection username of choice',
  DB_PASSWORD: process.env.DB_PASSWORD_TEST || 'Replace with MySQL connection password of choice',
  DB_SCHEMA: process.env.DB_SCHEMA_TEST || 'Replace with MySQL schema name of choice',
};
const prodConfig = {
  DB_HOST: process.env.DB_HOST_PROD || 'Replace with MySQL connection hostname of choice',
  DB_USER: process.env.DB_USER_PROD || 'Replace with MySQL connection username of choice',
  DB_PASSWORD: process.env.DB_PASSWORD_PROD || 'Replace with MySQL connection password of choice',
  DB_SCHEMA: process.env.DB_SCHEMA_PROD || 'Replace with MySQL schema name of choice',
};
const defaultConfig = {
  PORT: process.env.PORT || 3000,
  VITE_PORT: process.env.VITE_PORT || 5173,
  SESSION_SECRET: process.env.SESSION_SECRET || 'ds2s981301UhWUIwe',
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
