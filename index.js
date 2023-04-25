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

app.listen(constants.PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(`✅ Express server running on http://localhost:${constants.PORT}
    -- Running on ${process.env.NODE_ENV}`);
  }
});
