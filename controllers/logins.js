import { Router } from 'express';
import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import { v4 as uuid4 } from 'uuid';
import { emptyObjSchema, uuidSchema } from '../schemas/index.js';
import loginSchema from '../schemas/logins.js';
import {
  getAllLoginsEmails,
  getLoginsByAccessKey,
  getLoginsByEmail,
  updateLoginAccessKeyById,
} from '../models/logins.js';
import { getAdminsByLoginId, getAdminsWithDetailsByLoginId } from '../models/admins.js';
import { getTrainersByLoginId, getTrainersWithDetailsByLoginId } from '../models/trainers.js';
import { getMembersByLoginId, getMembersWithDetailsByLoginId } from '../models/members.js';
import permit from '../middleware/rbac.js';

const loginController = Router();

loginController.get('/users/key/:accessKey', async (req, res) => {
  try {
    const { accessKey: accessKeyInput } = req.params;
    if (!uuidSchema.safeParse(accessKeyInput).success) {
      return res.status(400).json({
        status: 400,
        message: uuidSchema.safeParse(accessKeyInput).error.issues,
      });
    }

    // Get info from the login row
    const [[{ id, email, username, role, accessKey }]] = await getLoginsByAccessKey(accessKeyInput);
    if (!id) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized access key',
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
    const user = { id, email, username, role, accessKey, memberId, trainerId, adminId };

    // Synchronize the key in the session in case of session getting reset by refresh, closing tab, etc.
    req.session.accessKey = accessKey;
    // console.log(`🔵 [${new Date().toLocaleTimeString()}] session id:`);

    return res.status(200).json({
      status: 200,
      message: 'Login record successfully retrieved',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

loginController.post('/login', async (req, res) => {
  try {
    if (!loginSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: loginSchema.safeParse(req.body).error.issues,
      });
    }
    const { email = null, password = null } = req.body;

    // Look up email
    const [loginResults] = await getLoginsByEmail(email);
    // NB Error: `for` loop was originally used here i/o `forEach` for (1) short-circuiting, (2) using `async/await`
    //  inside the loop, however, forbade by linting rules, see:
    // -- https://betterprogramming.pub/should-you-stop-using-foreach-in-your-javascript-code-efe1e86c78e5
    // -- https://www.designcise.com/web/tutorial/when-not-to-use-the-javascript-foreach-loop
    //  DON'T use `async/await` within a loop, (use array method `find` instead if short-circuiting is needed), see:
    // -- https://blog.webdevsimplified.com/2021-11/async-await/
    //  `bcrypt.compare()` is ASYNC usage, which SHOULDN'T be used within `find()`, o/w the 1st elem of array will
    //  return, see:
    // -- https://stackoverflow.com/questions/55601062/using-an-async-function-in-array-find
    // Check password
    const match = loginResults.find((lr) => bcrypt.compareSync(password, lr.password));
    // -- Return error if there's NO match
    if (!match) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid login credentials',
      });
    }
    // -- If there's a match found, generate an access key and update the key in the match's login row and session
    const accessKey = uuid4().toString();
    await updateLoginAccessKeyById(match.id, accessKey);
    req.session.accessKey = accessKey;
    // console.log(`🟢 [${new Date().toLocaleTimeString()}] id: ${req.session.id}`);

    return res.status(200).json({
      status: 200,
      message: 'Login successful',
      accessKey,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

loginController.post('/logout', async (req, res) => {
  try {
    const { accessKey } = req.body;
    if (!uuidSchema.safeParse(accessKey).success) {
      return res.status(400).json({
        status: 400,
        message: uuidSchema.safeParse(accessKey).error.issues,
      });
    }

    // Get the target login row by `accesskey` and nullify its `accessKey` column and session
    const [[{ id }]] = await getLoginsByAccessKey(accessKey);
    await updateLoginAccessKeyById(id, null);
    req.session.destroy();

    return res.status(200).json({
      status: 200,
      message: 'Logout successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

loginController.get('/logins/all-emails', async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [emailResults] = await getAllLoginsEmails();

    return res.status(200).json({
      status: 200,
      message: 'Email records successfully retrieved',
      emails: emailResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

loginController.get(
  '/users/user-with-all-details-and-all-emails/key/:accessKey',
  permit('Admin', 'Trainer', 'Member'),
  async (req, res) => {
    try {
      const { accessKey } = req.params;
      if (!uuidSchema.safeParse(accessKey).success) {
        return res.status(400).json({
          status: 400,
          message: uuidSchema.safeParse(accessKey).error.issues,
        });
      }

      const [emailResults] = await getAllLoginsEmails();
      const [[firstLoginResult]] = await getLoginsByAccessKey(accessKey);
      if (!firstLoginResult) {
        return res.status(401).json({
          status: 401,
          message: 'Unauthorized access key',
        });
      }
      let user = null;
      switch (firstLoginResult?.role) {
        case 'Admin':
          [[user]] = await getAdminsWithDetailsByLoginId(firstLoginResult.id);
          break;
        case 'Trainer':
          [[user]] = await getTrainersWithDetailsByLoginId(firstLoginResult.id);
          break;
        case 'Member':
          [[user]] = await getMembersWithDetailsByLoginId(firstLoginResult.id);
          break;
        default:
          return res.status(403).json({
            status: 403,
            message: 'Insufficient privilege',
          });
      }

      return res.status(200).json({
        status: 200,
        message: 'Login record successfully retrieved',
        emails: emailResults,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Database or server error',
        error,
      });
    }
  }
);

export default loginController;
