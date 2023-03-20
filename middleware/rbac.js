import { getLoginsByAccessKey } from '../models/logins.js';
// NB With rest parameters, array method `includes` is enabled, i.e., DON'T pass an array as argument when loading this middleware
export default function permit(...permittedRoles) {
  return async (req, res, next) => {
    try {
      // ??? Session id reset after refresh, making this middleware impossible useless
      // FIX Delete this console log after everything works fine
      console.log('🔵 [' + new Date().toLocaleTimeString() + '] id: ' + req.session.id);
      if (!req?.session?.accessKey) {
        return res.status(401).json({
          status: 401,
          message: 'Unauthorized',
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
