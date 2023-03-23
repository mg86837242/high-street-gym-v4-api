import { Router } from 'express';
import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import pool from '../config/database.js';
import { emptyObjSchema, idSchema } from '../schemas/index.js';
import { signupSchema, memberSchema } from '../schemas/members.js';
import { getAllMembers, getMembersById, getMembersWithDetailsById, deleteMemberById } from '../models/members.js';
import permit from '../middleware/rbac.js';

const memberController = Router();

// Read Member
memberController.get('/members', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [memberResults] = await getAllMembers();

    return res.status(200).json({
      status: 200,
      message: 'Member records successfully retrieved',
      members: memberResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

memberController.get('/members/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstMemberResult]] = await getMembersById(id);

    if (!firstMemberResult) {
      return res.status(404).json({
        status: 404,
        message: 'No member found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Member record successfully retrieved',
      member: firstMemberResult,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

memberController.get(
  '/members/member-with-details-by-id/:id',
  permit('Admin', 'Trainer', 'Member'),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!idSchema.safeParse(id).success) {
        return res.status(400).json({
          status: 400,
          message: idSchema.safeParse(id).error.issues,
        });
      }
      const [[firstMemberResult]] = await getMembersWithDetailsById(id);

      if (!firstMemberResult) {
        return res.status(404).json({
          status: 404,
          message: 'No member found with the ID provided',
        });
      }
      return res.status(200).json({
        status: 200,
        message: 'Member record successfully retrieved',
        defaultValues: firstMemberResult,
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

// Create Member
memberController.post('/members/signup', async (req, res) => {
  let conn = null;
  try {
    if (!signupSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: signupSchema.safeParse(req.body).error.issues,
      });
    }
    // PS1 `req.body` does NOT explicitly contain `loginId` that is necessary for `createCustomer()` function, however,
    //  contains `email`, `password` and `username`, based on which `loginId` can be generated; same goes for
    //  `addressId`
    // PS2 DA could be avoided here to improve the readability of parameters within the `createCustomer()` function;
    //  however, DA is used here for the benefit of (1) rapidly generating `req.body` for testing in Postman, (2)
    //  assigning a default value if needed
    const { email, password, username, firstName, lastName, phone, age, gender } = req.body;

    // #region un-foldable
    // NB Use SQL query i/o JS array method, if possible, see:
    //  https://stackoverflow.com/questions/16014295/which-is-more-efficient-javascript-array-search-or-mysql-like-query,
    //  so transaction is preferred for multiple INSERT
    // NB `await` pauses the thread, (while `then()` doesn't pause), see:
    //  -- https://stackoverflow.com/questions/54495711/async-await-vs-then-which-is-the-best-for-performance/70206098#70206098
    //  -- https://stackoverflow.com/questions/64328865/what-makes-async-await-statements-run-sequentially-vs-in-parallel-in-es6
    //  -- https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke#asyncawait
    // NB Bug: `createLogin()` succeeds, but `createMember()` fails (e.g., when missing an argument such as missing
    //  `null` as the `addressId` within the arguments passed into `createMember()` and leading to error 500),
    //  resulting in new login row but no member row ; on a side note, in ORM, it still needs to set up relations/
    //  associations and helper functions => Google '"mysql2" transaction' => Solutions: https://github.com/sidorares/node-mysql2/issues/384#issuecomment-673726520
    // #endregion
    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's login row with duplicate email – referring to the parent table `Logins`
    const [[emailExists]] = await conn.query('SELECT * FROM Logins WHERE email = ?', [email]);
    if (emailExists) {
      // -- Return error if exists
      return res.status(409).json({
        status: 409,
        message: 'Email has already been used',
      });
    }
    // -- Create login row if NOT exists
    const hashedPassword = await bcrypt.hash(password, 6);
    const [createLoginResult] = await conn.query(
      `
      INSERT INTO Logins (email, password, username, role)
      VALUES (?, ?, ?, ?)
      `,
      [email, hashedPassword, username, 'Member']
    );
    const loginId = createLoginResult.insertId;

    // Create member row with 2 FKs
    const [{ insertId }] = await conn.query(
      `
      INSERT INTO Members (loginId, firstName, lastName, phone, addressId, age, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [loginId, firstName, lastName, phone, null, age, gender]
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Signup successful',
      insertId,
    });
  } catch (error) {
    if (conn) await conn.rollback();
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  } finally {
    if (conn) conn.release();
  }
});

memberController.post('/members', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  let conn = null;
  try {
    if (!memberSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: memberSchema.safeParse(req.body).error.issues,
      });
    }
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      phone,
      age,
      gender,
      lineOne,
      lineTwo,
      suburb,
      postcode,
      state,
      country,
    } = req.body;

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's login row with duplicate email – referring to the parent table `Logins`
    const [[emailExists]] = await conn.query('SELECT * FROM Logins WHERE email = ?', [email]);
    if (emailExists) {
      // -- Return error if exists
      return res.status(409).json({
        status: 409,
        message: 'Email has already been used',
      });
    }
    // -- Create login row if NOT exists
    const hashedPassword = await bcrypt.hash(password, 6);
    const [createLoginResult] = await conn.query(
      `
      INSERT INTO Logins (email, password, username, role)
      VALUES (?, ?, ?, ?)
      `,
      [email, hashedPassword, username, 'Member']
    );
    const loginId = createLoginResult.insertId;

    // Find if there's duplicate address row – referring to the parent table `Addresses`
    let addressId = null;
    if (lineOne && suburb && postcode && state && country) {
      // NB `WHERE lineTwo = null` returns null i/o true, therefore the extra evaluation o/w the following query
      //  won't work as intended, see: https://stackoverflow.com/questions/8775098/mysql-display-rows-where-value-is-null-or-equal-to-x
      const [[addressExists]] = await conn.query(
        'SELECT * FROM Addresses WHERE lineOne = ? AND (lineTwo = ? OR lineTwo IS NULL) AND suburb = ? AND postcode = ? AND state = ? AND country = ?',
        [lineOne, lineTwo, suburb, postcode, state, country]
      );
      if (addressExists) {
        // -- Use the found address row's PK if exists
        addressId = addressExists.id;
      } else {
        // -- Create address row if NOT exists
        const [createAddressResult] = await conn.query(
          `
          INSERT INTO Addresses
          (lineOne, lineTwo, suburb, postcode, state, country)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [lineOne, lineTwo, suburb, postcode, state, country]
        );
        addressId = createAddressResult.insertId;
      }
    }

    // Create member row with 2 FKs
    const [{ insertId }] = await conn.query(
      `
      INSERT INTO Members (loginId, firstName, lastName, phone, addressId, age, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [loginId, firstName, lastName, phone, addressId, age, gender]
    );
    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Member successfully created',
      insertId,
    });
  } catch (error) {
    if (conn) await conn.rollback();
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  } finally {
    if (conn) conn.release();
  }
});

// Update Member
// PS1 Depending on the business logic, it's possible to update login and address info separately in their respective routers, e.g., GitHub
// PS2 The logic of React Router calls for the juxtaposed usage of `req.body` and `req.params` in update routes
// NB If anything, catch 409 i/o 404 within an update operation, see: https://stackoverflow.com/questions/10727699/is-http-404-an-appropriate-response-for-a-put-operation-where-some-linked-resour
memberController.patch('/members/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  let conn = null;
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    if (!memberSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: memberSchema.safeParse(req.body).error.issues,
      });
    }
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      phone,
      age,
      gender,
      lineOne,
      lineTwo,
      suburb,
      postcode,
      state,
      country,
    } = req.body;

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's login row with duplicate email EXCEPT the request maker – referring to the parent table `Logins`
    const [[loginId]] = await conn.query('SELECT loginId FROM Members WHERE id = ?', [id]);
    const [[emailExists]] = await conn.query('SELECT * FROM Logins WHERE email = ? AND NOT id = ?', [email, loginId]);
    if (emailExists) {
      // -- Return error if exists
      return res.status(409).json({
        status: 409,
        message: 'Email has already been used',
      });
    }
    // -- Update login row if NOT exists (NB current business logic doesn't deal with role change, and requires a
    //  separate account for any diff role)
    const hashedPassword = password.startsWith('$2') ? password : await bcrypt.hash(password, 6);
    await conn.query(
      `
      UPDATE Logins
      SET email = ?, password = ?, username = ?
      WHERE id = ?
      `,
      [email, hashedPassword, username, loginId]
    );

    // Find if there's duplicate address row
    let [[addressId]] = await conn.query('SELECT addressId FROM Members WHERE id = ?', [id]);
    const [[addressExists]] = await conn.query(
      'SELECT * FROM Addresses WHERE lineOne = ? AND (lineTwo = ? OR lineTwo IS NULL) AND suburb = ? AND postcode = ? AND state = ? AND country = ?',
      [lineOne, lineTwo, suburb, postcode, state, country]
    );
    if (addressExists) {
      // -- Use the found address row's PK if exists
      addressId = addressExists.id;
    } else {
      // -- Update address row if NOT exists
      await conn.query(
        `
        UPDATE Addresses
        SET lineOne = ?, lineTwo = ?, suburb = ?, postcode = ?, state = ?, country = ?
        WHERE id = ?
        `,
        [lineOne, lineTwo, suburb, postcode, state, country, addressId]
      );
    }

    // Update member row with 2 FKs
    const [{ affectedRows }] = await conn.query(
      `
      UPDATE Members
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, age = ?, gender = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, addressId, age, gender, id]
    );

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No member found with the ID provided',
      });
    }
    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Member successfully updated',
    });
  } catch (error) {
    if (conn) await conn.rollback();
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  } finally {
    if (conn) conn.release();
  }
});

// Delete Member
memberController.delete('/members/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [{ affectedRows }] = await deleteMemberById(id);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No member found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Member successfully deleted',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default memberController;
