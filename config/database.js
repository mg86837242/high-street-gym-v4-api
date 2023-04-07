import mysql from 'mysql2/promise';
import constants from './constants.js';

const pool = mysql.createPool({
  host: constants.DB_HOST,
  user: constants.DB_USER,
  password: constants.DB_PASSWORD,
  database: constants.DB_SCHEMA,
  dateStrings: true,
  charset: 'utf8mb4',
});

export default pool;

// NB `pool.query()` returns a promise obj by the design of `mysql2`, this can be observed by placing
//  `console.log(getLoginsById(1))` in the `server.js`, then `npm start`; the console will then print
//  `Promise { <pending> }`, which can be unpacked by `then()` or `await`

// References:
// -- https://github.com/sidorares/node-mysql2/issues/1089: Force `DATETIME` to be returned as strings
// -- https://stackoverflow.com/questions/39463134: Allow emoji in MySQL (ended up make a new schema for it to work)
