import mysql from 'mysql2/promise';
import constants from './constants.js';

const pool = mysql.createPool({
  host: constants.DB_HOST,
  user: constants.DB_USER,
  password: constants.DB_PASSWORD,
  database: constants.DB_SCHEMA,
  dateStrings: true,
});

export default pool;

// NB `pool.query()` returns a promise object by the design of `mysql2`, this can be observed by placing
//  `console.log(getLoginsByUsername('someUsernameStr'))` in the `server.js`, then `npm start`; the console
//  will then print `Promise { <pending> }`, which can be unpacked by `then()` or `await`
