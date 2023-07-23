import express from 'express';
import cors from 'cors';
import session from 'express-session';
import constants from './constants.js';
// import RedisStore from 'connect-redis';
// import { createClient } from 'redis';

export default function (app) {
  // Express CORS middleware – CORS allows to set which frontend URLs are allowed to access APIs
  app.use(
    cors({
      origin: [`${constants.CORS_ORIGIN}`, /^https?:\/\/highstreetgymdemo\.space.*/],
      credentials: true,
      maxAge: 24 * 60 * 60 * 1_000,
    }),
  );

  // Express session middleware
  // -- Redis client (to be implemented)
  // let redisClient = createClient();
  // redisClient.connect().catch(console.error);
  // -- Session config
  app.set('trust proxy', 1);
  app.use(
    session({
      // store: new RedisStore({ client: redisClient }),
      secret: constants.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // rolling: true,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1_000,
        sameSite: 'lax',
      },
    }),
  );

  // Built-in middleware – parsing middleware needs to be placed before defining any routes
  app.use(express.json());
}

// References:
// -- https://expressjs.com/en/guide/using-middleware.html: Classification of Express middleware
// -- https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/:
//  Express session middleware tutorial, ignoring the `cookie-parser` part
// -- https://forum.freecodecamp.org/t/what-is-the-secret-key-in-express-session/354972: Express session secret working
//  in tandem with environment variables
// -- https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
// -- https://github.com/erickow/nodejs-express-auth-passport-jwt-es6-example/tree/master/src: modularization of `index.js`
// -- https://node-postgres.com/guides/async-express: modularization of `index.js`, and `express-promise-router`

// References for preserving `req.session` after fetching in the frontend:
// -- https://twin.sh/articles/11/react-fix-issue-with-session-changing-after-every-request: Gives the hint that it's
//  related to something with `credentials` in fetch API
// -- https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax: Fetch API's `credentials` option
// -- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowCredentials: After including the
//  `credentials: 'include'` option, getting this error in the browser console
// -- https://github.com/expressjs/cors#configuration-options: CORS option to set `Access-Control-Allow-Credentials`
//  CORS header to true
// -- https://stackoverflow.com/questions/63351799/react-fetch-credentials-include-breaks-my-entire-request-and-i-get-an-error:
//  Different error message, same solution
