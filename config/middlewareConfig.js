import express from 'express';
import cors from 'cors';
import session from 'express-session';
import constants from './constants.js';
// import RedisStore from 'connect-redis';
// import { createClient } from 'redis';

export default function (app) {
  // Express CORS middleware – CORS allows to set which frontend URLs are allowed to access APIs
  // app.use(cors({ origin: `http://localhost:${constants.VITE_PORT}` }));
  app.use(cors({ origin: true }));
  app.options('*', cors());

  // Express session middleware
  // -- Redis client
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
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1_000,
      },
    })
  );

  // Built-in middleware – parsing middleware needs to be placed before defining any routes
  app.use(express.json());
}
