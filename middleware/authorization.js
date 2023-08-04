import { getLoginsByAccessKey } from '../models/logins.js';
// NB With rest parameters, array method `includes` is enabled
export default function permit(...permittedRoles) {
  return async (req, res, next) => {
    try {
      console.log(`-- session obj when calling any endpoint with permit middleware:`);
      console.log(`🔵 [${new Date().toLocaleTimeString()}] Session ID: ${req?.session?.id}`);
      console.log(req?.session);

      // NB Bug: with Nginx reverse proxy and HTTPS, `accessKey` key added to the `req.session` obj after successful
      //  login does not persist, print `req.session` obj in `permit` middleware and an endpoint that has `permit`
      //  middleware enabled (e.g. GET /activities) to observe => Solution not found, therefore, the following code is
      // disabled
      // if (!req?.session?.accessKey) {
      //   return res.status(401).json({
      //     status: 401,
      //     message: 'Unauthorized request',
      //   });
      // }
      // const { accessKey } = req.session;
      // const [[{ role }]] = await getLoginsByAccessKey(accessKey);
      // if (!permittedRoles.includes(role)) {
      //   return res.status(403).json({
      //     status: 403,
      //     message: 'Insufficient privilege',
      //   });
      // }

      return next();
    } catch (error) {
      console.error(error);
      return res.json(500).json({
        status: 500,
        message: 'Database or server error',
      });
    }
  };
}

// NB Bug: `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client` => https://
//  stackoverflow.com/questions/7042340

// References:
// -- https://gist.github.com/joshnuss/37ebaf958fe65a18d4ff: exemplar code snippet of Express.js role-based permissions
//  middleware
// -- https://www.geeksforgeeks.org/when-to-use-next-and-return-next-in-node-js/?ref=rp: when to return `next()`,
//  however, in this case, it's just b/c of linting rules
