import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import Router from 'express-promise-router';
import { v4 as uuid4 } from 'uuid';

import permit from '../middleware/authorization.js';
import { getAdminsByLoginId, getAdminsWithDetailsByLoginId } from '../models/admins.js';
import { getLoginsByAccessKey, getLoginsByEmail, updateLoginAccessKeyById } from '../models/logins.js';
import { getMembersByLoginId, getMembersWithDetailsByLoginId } from '../models/members.js';
import { getTrainersByLoginId, getTrainersWithDetailsByLoginId } from '../models/trainers.js';
import { uuidSchema } from '../schemas/params.js';
import { loginSchema } from '../schemas/users.js';

const userController = new Router();

// PS The design of route paths and route parameters follows: https://expressjs.com/en/guide/routing.html
userController.get('/keys/:accessKey', async (req, res) => {
  try {
    const result = await uuidSchema.spa(req.params.accessKey);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid credentials',
      });
    }
    const accessKey = result.data;

    // Get info from the login row
    const [[{ id, username, role }]] = await getLoginsByAccessKey(accessKey);
    if (!id) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized credentials',
      });
    }
    // Get necessary info from respective child table
    let memberId = null;
    let trainerId = null;
    let adminId = null;
    switch (role) {
      case 'Admin':
        [[{ id: adminId }]] = await getAdminsByLoginId(id);
        break;
      case 'Trainer':
        [[{ id: trainerId }]] = await getTrainersByLoginId(id);
        break;
      case 'Member':
        [[{ id: memberId }]] = await getMembersByLoginId(id);
        break;
      default:
        return res.status(403).json({
          status: 403,
          message: 'Insufficient privilege',
        });
    }
    const user = { id, username, role, accessKey, memberId, trainerId, adminId };

    // Synchronize the key in the server-side session in case of session getting reset by failed request, etc.
    req.session.accessKey = accessKey;
    // console.log(`-- session obj after useEffect synchronization:`);
    // console.log(`🔵 [${new Date().toLocaleTimeString()}] Session ID: ${req?.session?.id}`);
    // console.log(req?.session);

    return res.status(200).json({
      status: 200,
      message: 'User record successfully retrieved',
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

userController.post('/login', async (req, res) => {
  try {
    const result = await loginSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid credentials',
      });
    }
    const { email = null, password = null } = result.data;

    // Look up email
    const [loginResults] = await getLoginsByEmail(email);
    // NB Error: `for` loop was originally used here i/o `forEach` for (1) early return, (2) using `async/await`
    //  inside the loop, however, forbade by linting rules, see:
    // -- https://betterprogramming.pub/should-you-stop-using-foreach-in-your-javascript-code-efe1e86c78e5
    // -- https://www.designcise.com/web/tutorial/when-not-to-use-the-javascript-foreach-loop
    //  DON'T use `async/await` within a loop, (use array method `find` instead if early return is needed), see:
    // -- https://blog.webdevsimplified.com/2021-11/async-await/
    //  `bcrypt.compare()` is ASYNC usage, which SHOULDN'T be used within `find()`, o/w the 1st elem of array will
    //  return, see:
    // -- https://stackoverflow.com/questions/55601062/using-an-async-function-in-array-find
    // Check password
    const match = loginResults.find(lr => bcrypt.compareSync(password, lr.password));
    // -- Return error if there's NO match
    if (!match) {
      return res.status(401).json({
        status: 401,
        message: 'Login credentials do not match',
      });
    }
    // -- If there's a match found, generate an access key and update the key in the match's login row and session
    const accessKey = uuid4().toString();
    await updateLoginAccessKeyById(match.id, accessKey);
    req.session.accessKey = accessKey;
    // console.log(`-- session obj after successful login:`);
    // console.log(`🔵 [${new Date().toLocaleTimeString()}] Session ID: ${req?.session?.id}`);
    // console.log(req?.session);

    return res.status(200).json({
      status: 200,
      message: 'Login successful',
      accessKey,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

userController.post('/logout', async (req, res) => {
  try {
    const result = await uuidSchema.spa(req.body.accessKey);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid credentials',
      });
    }
    const accessKey = result.data;

    // Get the target login row by `accesskey` and nullify its `accessKey` column and session
    const [[{ id }]] = await getLoginsByAccessKey(accessKey);
    await updateLoginAccessKeyById(id, null);
    req.session.destroy();

    return res.status(200).json({
      status: 200,
      message: 'Logout successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

userController.get('/keys/:accessKey/detailed', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await uuidSchema.spa(req.params.accessKey);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid credentials',
      });
    }
    const accessKey = result.data;

    const [[{ id, role }]] = await getLoginsByAccessKey(accessKey);
    if (!id) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized credentials',
      });
    }
    let firstUserResult = null;
    switch (role) {
      case 'Admin':
        [[firstUserResult]] = await getAdminsWithDetailsByLoginId(id);
        break;
      case 'Trainer':
        [[firstUserResult]] = await getTrainersWithDetailsByLoginId(id);
        break;
      case 'Member':
        [[firstUserResult]] = await getMembersWithDetailsByLoginId(id);
        break;
      default:
        return res.status(403).json({
          status: 403,
          message: 'Insufficient privilege',
        });
    }

    return res.status(200).json({
      status: 200,
      message: 'User record successfully retrieved',
      user: firstUserResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

export default userController;
