import compression from 'compression';
import cors from 'cors';
import express from 'express';
import mysqlSession from 'express-mysql-session';
import session from 'express-session';
import helmet from 'helmet';

import constants from './constants.js';

const isProd = process.env.NODE_ENV === 'production';

export default function (app) {
  // Express CORS middleware – CORS allows to set which frontend URLs are allowed to access APIs
  app.use(
    cors({
      origin: [`${constants.CORS_ORIGIN}`, /^https?:\/\/highstreetgymdemo\.space/],
      credentials: true,
      maxAge: 24 * 60 * 60 * 1_000,
    }),
  );

  // Express session middleware
  const MysqlStore = mysqlSession(session);
  const mysqlSessionConfig = {
    host: constants.DB_HOST,
    port: 3306,
    user: constants.DB_USER,
    password: constants.DB_PASSWORD,
    database: constants.SESSION_DB_SCHEMA,
  };

  const sessionConfig = {
    name: 'highStreetGymSession',
    secret: constants.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1_000,
      sameSite: 'lax',
    },
    proxy: false,
  };

  if (isProd) {
    app.enable('trust proxy');
    sessionConfig.cookie.secure = true;
    sessionConfig.proxy = true;
    sessionConfig.store = new MysqlStore(mysqlSessionConfig);
  }

  app.use(session(sessionConfig));

  // Built-in middleware – parsing middleware needs to be placed before defining any routes
  app.use(express.json());

  // Other middleware for prod env only
  if (isProd) {
    app.use(compression());
    app.use(helmet());
    app.disable('x-powered-by');
  }
}

// References:
// -- https://expressjs.com/en/guide/using-middleware.html: classification of Express middleware
// -- https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/:
//  Express session middleware tutorial, ignoring the `cookie-parser` part
// -- https://stackoverflow.com/questions/56915748/express-session-is-not-persistent-on-nginx-reverse-proxy: exemplar of
//  configuring application-wise middleware, esp. for `express-session` config
// -- https://forum.freecodecamp.org/t/what-is-the-secret-key-in-express-session/354972: example of using env variables
//  to set Express session secret
// -- https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

// References for preserving `req.session` after fetching in the frontend in dev env:
// -- https://twin.sh/articles/11/react-fix-issue-with-session-changing-after-every-request: gives the hint that it's
//  related to something with `credentials` in fetch API
// -- https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax: fetch API's `credentials` option
// -- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowCredentials: after including the
//  `credentials: 'include'` option, getting this error in the browser console
// -- https://github.com/expressjs/cors#configuration-options: CORS option to set `Access-Control-Allow-Credentials`
//  CORS header to true
// -- https://stackoverflow.com/questions/63351799/react-fetch-credentials-include-breaks-my-entire-request-and-i-get-an-error:
//  different error message, same solution

// References for configuring `express-session` with Nginx reverse proxy in prod env:
// -- https://expressjs.com/en/advanced/best-practice-security.html: official recommended session configs for prod env
// -- https://gist.github.com/nikmartin/5902176: secure sessions with Node.js, Express.js, and NginX as an SSL proxy
//    esp. for this line `app.enable('trust proxy')`
// ---- https://expressjs.com/en/guide/behind-proxies.html: official guide for `trust proxy` setting
// ---- https://stackoverflow.com/questions/23413401: example of `trust proxy` setting with IP Addresses type
// ---- https://github.com/expressjs/session: official `express-session` docs, `name` is the old `key` option:
// ---- Note if you have multiple apps running on the same hostname (this is just the name, i.e. localhost or 127.0.0.
// ---- 1; different schemes and ports do not name a different hostname), then you need to separate the session cookies
// ---- from each other. The simplest method is to simply set different names per app.
// ---- https://stackoverflow.com/questions/56726972/express-session-the-difference-between-session-id-and-connect-sid:
//    clarification about `name` option
