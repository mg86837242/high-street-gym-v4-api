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

app.get('/api/test', async (req, res) => {
  try {
    req.session.myKey = 111;
    console.log(req.session);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
});

app.listen(constants.PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`✅ Express server running on http://localhost:${constants.PORT}
    -- Running on ${process.env.NODE_ENV}`);
  }
});

// References:
// -- https://expressjs.com/en/guide/using-middleware.html: Classification of Express middleware
// -- https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/:
//  Express session middleware tutorial, ignoring the `cookie-parser` part
// -- https://forum.freecodecamp.org/t/what-is-the-secret-key-in-express-session/354972: Express session secret working
//  in tandem with environment variables
// -- https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
