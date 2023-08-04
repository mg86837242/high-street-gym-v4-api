import express from 'express';
import cors from 'cors';
// import mysqlSession from 'express-mysql-session';
import session from 'express-session';
import compression from 'compression';
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
  // const MysqlStore = mysqlSession(session);
  // const mysqlConfig = {
  //   host: constants.DB_HOST,
  //   user: constants.DB_USER,
  //   password: constants.DB_PASSWORD,
  //   database: constants.DB_SCHEMA,
  //   port: 3306,
  // };

  const sessionConfig = {
    name: 'highStreetGymSession',
    secret: constants.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1_000,
      sameSite: 'lax',
    },
    proxy: isProd,
    // domain: 'highstreetgymdemo.space',
    // store: new MysqlStore(mysqlConfig),
  };

  if (isProd) {
    app.enable('trust proxy');
  }

  app.use(session(sessionConfig));

  // Built-in middleware – parsing middleware needs to be placed before defining any routes
  app.use(express.json());

  // Middleware specifically for prod env
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
// -- https://forum.freecodecamp.org/t/what-is-the-secret-key-in-express-session/354972: Express session secret working
//  in tandem with environment variables
// -- https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

// References for preserving `req.session` after fetching in the frontend:
// -- https://twin.sh/articles/11/react-fix-issue-with-session-changing-after-every-request: gives the hint that it's
//  related to something with `credentials` in fetch API
// -- https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax: fetch API's `credentials` option
// -- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowCredentials: after including the
//  `credentials: 'include'` option, getting this error in the browser console
// -- https://github.com/expressjs/cors#configuration-options: CORS option to set `Access-Control-Allow-Credentials`
//  CORS header to true
// -- https://stackoverflow.com/questions/63351799/react-fetch-credentials-include-breaks-my-entire-request-and-i-get-an-error:
//  different error message, same solution

// References for configuring `express-session` in prod env with Nginx reverse proxy:
// -- https://github.com/expressjs/session: official `express-session` docs, incl. options:
// ---- Note if you have multiple apps running on the same hostname (this is just the name, i.e. localhost or 127.0.0.
// ---- 1; different schemes and ports do not name a different hostname), then you need to separate the session cookies
// ---- from each other. The simplest method is to simply set different names per app.
// -- https://expressjs.com/en/advanced/best-practice-security.html: official recommended session configs for prod env
// -- https://stackoverflow.com/questions/56726972/express-session-the-difference-between-session-id-and-connect-sid:
//  clarification about `name` option
// -- https://gist.github.com/nikmartin/5902176: secure sessions with Node.js, Express.js, and NginX as an SSL proxy
//  spec. for this line `app.enable('trust proxy')`, however, there's a better solution
// -- https://expressjs.com/en/guide/behind-proxies.html: official guide for `trust proxy` setting
// ---- https://stackoverflow.com/questions/23413401: example of `trust proxy` setting with IP Addresses type
