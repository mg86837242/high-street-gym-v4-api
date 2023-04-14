import { getLoginsByAccessKey } from '../models/users.js';
// NB With rest parameters, array method `includes` is enabled
export default function permit(...permittedRoles) {
  return async (req, res, next) => {
    try {
      console.log(`🔵 [${new Date().toLocaleTimeString()}] session: `, req.session);
      if (!req?.session?.accessKey) {
        return res.status(401).json({
          status: 401,
          message: 'Unauthorized request',
        });
      }
      const { accessKey } = req.session;
      const [[{ role }]] = await getLoginsByAccessKey(accessKey);
      if (!permittedRoles.includes(role)) {
        return res.status(403).json({
          status: 403,
          message: 'Insufficient privilege',
        });
      }
      return next();
    } catch (error) {
      return res.json(500).json({
        status: 500,
        message: 'Database or server error',
      });
    }
  };
}

// References:
// -- https://gist.github.com/joshnuss/37ebaf958fe65a18d4ff: exemplar code snippet of Express.js role-based permissions
//  middleware
// -- https://www.geeksforgeeks.org/when-to-use-next-and-return-next-in-node-js/?ref=rp: when to return `next()`,
//  however, in this case, it's just b/c of linting rules
