import express from 'express';
import middlewareConfig from './config/middlewareConfig.js';
import apiRoutes from './config/apiRoutes.js';
import constants from './config/constants.js';

const app = express();
middlewareConfig(app);
apiRoutes(app);

// Testing endpoints
app.get('/api/helloworld', (req, res) => {
  res.status(200).json({ status: 200, message: 'Hello world' });
});

app.listen(constants.PORT, () => {
  console.info(`✅ Express server running on port: ${constants.PORT}
  -- mode: ${process.env.NODE_ENV}
  -- client: ${constants.CORS_ORIGIN}`);
});

// References:
// -- https://stackoverflow.com/questions/56291321/how-to-handle-errors-with-express-listen-in-typescript
// -- https://pm2.keymetrics.io/docs/usage/quick-start/: pm2 start options
// -- https://pm2.keymetrics.io/docs/usage/process-management/: pm2 start script directly

// PM2 start script:
// -- pm2 start "node -r dotenv/config index.js" --name api --watch --ignore-watch="node_modules" --max-memory-restart 300M
