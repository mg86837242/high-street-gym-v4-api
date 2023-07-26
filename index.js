import express from 'express';
import constants from './config/constants.js';
import middlewareConfig from './config/middleware.js';
import mountRoutes from './controllers/index.js';

const app = express();
middlewareConfig(app);
mountRoutes(app);

// Testing endpoints
app.get('/api/helloworld', (req, res) => {
  res.status(200).json({ status: 200, message: 'Hello world' });
});

app.listen(constants.PORT, () => {
  console.info(`✅ Express server running on port: ${constants.PORT}
  -- mode: ${process.env.NODE_ENV}`);
});

// References:
// -- https://github.com/erickow/nodejs-express-auth-passport-jwt-es6-example/tree/master/src: modularization of `index.
//  js`
// -- https://node-postgres.com/guides/async-express: (1) modularization of `index.js`, (2)) `express-promise-router`
// -- https://stackoverflow.com/questions/56291321/how-to-handle-errors-with-express-listen-in-typescript
// -- https://pm2.keymetrics.io/docs/usage/quick-start/: pm2 start options
// -- https://pm2.keymetrics.io/docs/usage/process-management/: pm2 start script with dotenv preload rather than file
// -- https://pm2.keymetrics.io/docs/usage/application-declaration/: pm2 config/ecosystem file
// -- https://medium.com/geekculture/deploying-a-react-app-and-a-node-js-server-on-a-single-machine-with-pm2-and-nginx-15f17251ee74:
//  YAML example for pm2 config/ecosystem file
