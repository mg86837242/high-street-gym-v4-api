import Router from 'express-promise-router';
import { XMLParser } from 'fast-xml-parser';
import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import pool from '../config/database.js';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import {
  signupSchema,
  memberDetailedSchema,
  updateMemberSchema,
  updateMemberDetailedSchema,
} from '../schemas/members.js';
import {
  getAllMembers,
  getAllMembersWithDetails,
  getMembersById,
  getMembersWithDetailsById,
} from '../models/members.js';
import permit from '../middleware/authorization.js';
import upload from '../middleware/multer.js';

const memberController = new Router();

// Read Member
memberController.get('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await emptyObjSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }

    const [memberResults] = await getAllMembers();

    return res.status(200).json({
      status: 200,
      message: 'Member records successfully retrieved',
      members: memberResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

memberController.get(
  '/detailed',
  // permit('Admin', 'Trainer', 'Member'),
  async (req, res) => {
    try {
      const result = await emptyObjSchema.spa(req.body);
      if (!result.success) {
        return res.status(400).json({
          status: 400,
          message: JSON.stringify(result.error.flatten()),
        });
      }
      const [memberResults] = await getAllMembersWithDetails();

      return res.status(200).json({
        status: 200,
        message: 'Member records successfully retrieved',
        members: memberResults,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        message: 'Database or server error',
      });
    }
  },
);

memberController.get('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

memberController.get('/:id/detailed', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

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
      member: firstMemberResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Create Member
memberController.post(['/', '/signup'], async (req, res) => {
  let conn = null;
  try {
    const result = await signupSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    // PS1 `req.body`/`result.data` does NOT explicitly contain `loginId` that is necessary for `createCustomer()`
    //  function, however, contains `email`, `password` and `username`, based on which `loginId` can be generated; same
    //  goes for`addressId`
    const { email, password, username, firstName, lastName, phone, age, gender } = result.data;

    // #region un-foldable
    // NB Use SQL query i/o JS array method => transaction is preferred over multiple INSERT, see:
    //  https://stackoverflow.com/questions/16014295
    // NB `await` pauses the thread, (while `then()` doesn't pause), see:
    //  -- https://stackoverflow.com/questions/54495711
    //  -- https://stackoverflow.com/questions/64328865
    //  -- https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke#asyncawait
    // NB Bug: `createLogin()` succeeds, but `createMember()` fails (e.g., when missing an argument such as missing
    //  `null` as the `addressId` within the arguments passed into `createMember()` and leading to error 500),
    //  resulting in new login row but no member row ; on a side note, in ORM, it still needs to set up relations/
    //  associations and helper functions => Google '"mysql2" transaction' => Solutions: https://github.com/sidorares/node-mysql2/issues/384#issuecomment-673726520
    // #endregion
    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email – referring to the parent table `logins`
    const [[emailExists]] = await conn.query('SELECT * FROM logins WHERE email = ?', [email]);
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
      INSERT INTO logins (email, password, username, role)
      VALUES (?, ?, ?, ?)
      `,
      [email, hashedPassword, username, 'Member'],
    );
    const loginId = createLoginResult.insertId;

    // Leave the `addressId` FK null
    const addressId = null;

    // Create member row with 2 FKs
    const [{ insertId }] = await conn.query(
      `
      INSERT INTO members (loginId, firstName, lastName, phone, addressId, age, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [loginId, firstName, lastName, phone, addressId, age, gender],
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Signup successful',
      insertId,
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  } finally {
    if (conn) conn.release();
  }
});

memberController.post('/detailed', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  let conn = null;
  try {
    const result = await memberDetailedSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
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
    } = result.data;

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email – referring to the parent table `logins`
    const [[emailExists]] = await conn.query('SELECT * FROM logins WHERE email = ?', [email]);
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
      INSERT INTO logins (email, password, username, role)
      VALUES (?, ?, ?, ?)
      `,
      [email, hashedPassword, username, 'Member'],
    );
    const loginId = createLoginResult.insertId;

    // Create address row – referring to the parent table `addresses`
    let addressId = null;
    if (lineOne && suburb && postcode && state && country) {
      const [createAddressResult] = await conn.query(
        `
        INSERT INTO addresses
        (lineOne, lineTwo, suburb, postcode, state, country)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [lineOne, lineTwo, suburb, postcode, state, country],
      );
      addressId = createAddressResult.insertId;
    }

    // Create member row with 2 FKs
    const [{ insertId }] = await conn.query(
      `
      INSERT INTO members (loginId, firstName, lastName, phone, addressId, age, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [loginId, firstName, lastName, phone, addressId, age, gender],
    );
    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Member successfully created',
      insertId,
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  } finally {
    if (conn) conn.release();
  }
});

memberController.post(
  '/upload/xml',
  upload.single('new-member-xml'),
  // permit('Admin', 'Trainer'),
  async (req, res) => {
    let conn = null;
    try {
      const xmlStr = req?.file?.buffer?.toString();
      const parser = new XMLParser({
        numberParseOptions: {
          leadingZeros: false,
          hex: false,
          eNotation: false,
        },
      });
      const {
        memberList: { member: members },
      } = parser.parse(xmlStr);
      // NB After parsing, (1) empty text content within XML Elements becomes empty string, (2) left-out XML Elements
      //  becomes undefined

      // NB Bug: after configuring the `numberParseOptions` of the parser as shown above, and properly sanitizing the
      //  field w/ empty content (falsy value), the JS object generated from parsing XML string is still considered
      //  invalid by the schema (designed in accordance with the database constraints) => Solution: write a constructor
      //  to type cast the member object during sanitization
      class Member {
        constructor(
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
        ) {
          this.email = email.toString();
          this.password = password.toString();
          this.username = username.toString();
          this.firstName = firstName.toString();
          this.lastName = lastName.toString();
          this.phone = phone.toString();
          this.age = Number.isNaN(parseInt(age, 10)) ? null : parseInt(age, 10);
          this.gender = gender.toString();
          this.lineOne = lineOne.toString();
          this.lineTwo = lineTwo.toString();
          this.suburb = suburb.toString();
          this.postcode = postcode.toString();
          this.state = state.toString();
          this.country = country.toString();
        }
      }

      const sanitizeMemberPromises = members.map(
        async ({
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
        }) => {
          const castMember = new Member(
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
          );

          return Object.keys(castMember).reduce((acc, cv) => {
            if (castMember[cv] === '' && cv !== 'lineTwo') {
              acc[cv] = null;
            } else {
              acc[cv] = castMember[cv];
            }
            return acc;
          }, {});
        },
      );
      const sanitizedMembers = await Promise.all(sanitizeMemberPromises);

      const hasInvalid = sanitizedMembers.find(m => !memberDetailedSchema.safeParse(m).success);
      if (hasInvalid) {
        const result = await memberDetailedSchema.spa(hasInvalid);
        return res.status(400).json({
          status: 400,
          message: JSON.stringify(result.error.flatten()),
        });
      }

      // Manually acquire a connection from the pool & start a TRANSACTION
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const createMemberPromises = sanitizedMembers.map(
        async ({
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
        }) => {
          // Find if there's a login row with identical email – referring to the parent table `logins`
          const [[emailExists]] = await conn.query('SELECT * FROM logins WHERE email = ?', [email]);
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
            INSERT INTO logins (email, password, username, role)
            VALUES (?, ?, ?, ?)
            `,
            [email, hashedPassword, username, 'Member'],
          );
          const loginId = createLoginResult.insertId;

          // Create address row – referring to the parent table `addresses`
          let addressId = null;
          if (lineOne && suburb && postcode && state && country) {
            // -- Create address row if NOT exists
            const [createAddressResult] = await conn.query(
              `
              INSERT INTO addresses
              (lineOne, lineTwo, suburb, postcode, state, country)
              VALUES (?, ?, ?, ?, ?, ?)
              `,
              [lineOne, lineTwo, suburb, postcode, state, country],
            );
            addressId = createAddressResult.insertId;
          }

          // Create member row with 2 FKs
          await conn.query(
            `
            INSERT INTO members (loginId, firstName, lastName, phone, addressId, age, gender)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [loginId, firstName, lastName, phone, addressId, age, gender],
          );
          return undefined;
        },
      );
      await Promise.all(createMemberPromises);

      await conn.commit();
      return res.status(200).json({
        status: 200,
        message: 'Member(s) successfully created',
      });
    } catch (error) {
      if (conn) await conn.rollback();
      console.error(error);
      return res.status(500).json({
        status: 500,
        message: 'Database or server error',
      });
    } finally {
      if (conn) conn.release();
    }
  },
);

// Update Member
// PS1 Depending on the business logic, it's possible to update login and address info separately in their respective routers, e.g., GitHub
// PS2 The logic of React Router calls for the juxtaposed usage of `req.body` and `req.params` in update routes
// NB If anything, catch 409 i/o 404 within an update operation, see: https://stackoverflow.com/questions/10727699/is-http-404-an-appropriate-response-for-a-put-operation-where-some-linked-resour
memberController.patch('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  let conn = null;
  try {
    const result = await updateMemberSchema.spa({
      params: req.params,
      body: req.body,
    });
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const {
      params: { id },
      body: { email, password, username, firstName, lastName, phone, age, gender },
    } = result.data;

    const [[firstMemberResult]] = await getMembersById(id);
    if (!firstMemberResult) {
      return res.status(404).json({
        status: 404,
        message: 'No member found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email EXCEPT the request maker – referring to the parent table `logins`
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM members WHERE id = ?', [id]);
    const [[emailExists]] = await conn.query('SELECT * FROM logins WHERE email = ? AND NOT id = ?', [email, loginId]);
    if (emailExists) {
      // -- Return error if exists
      return res.status(409).json({
        status: 409,
        message: 'Email has already been used',
      });
    }
    // -- Update login row if NOT exists (NB current business logic doesn't allow role change, and requires a separate
    //  account for any diff role)
    const hashedPassword = password.startsWith('$2') ? password : await bcrypt.hash(password, 6);
    await conn.query(
      `
      UPDATE logins
      SET email = ?, password = ?, username = ?
      WHERE id = ?
      `,
      [email, hashedPassword, username, loginId],
    );

    // Update member row with `loginId` FK
    await conn.query(
      `
      UPDATE members
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, age = ?, gender = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, age, gender, id],
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Member successfully updated',
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  } finally {
    if (conn) conn.release();
  }
});

memberController.patch('/:id/detailed', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  let conn = null;
  try {
    const result = await updateMemberDetailedSchema.spa({
      params: req.params,
      body: req.body,
    });
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const {
      params: { id },
      body: {
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
      },
    } = result.data;

    const [[firstMemberResult]] = await getMembersById(id);
    if (!firstMemberResult) {
      return res.status(404).json({
        status: 404,
        message: 'No member found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email EXCEPT the request maker – referring to the parent table `logins`
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM members WHERE id = ?', [id]);
    const [[emailExists]] = await conn.query('SELECT * FROM logins WHERE email = ? AND NOT id = ?', [email, loginId]);
    if (emailExists) {
      // -- Return error if exists
      return res.status(409).json({
        status: 409,
        message: 'Email has already been used',
      });
    }
    // -- Update login row if NOT exists (NB current business logic doesn't allow role change, and requires a separate
    //  account for any diff role)
    const hashedPassword = password.startsWith('$2') ? password : await bcrypt.hash(password, 6);
    await conn.query(
      `
      UPDATE logins
      SET email = ?, password = ?, username = ?
      WHERE id = ?
      `,
      [email, hashedPassword, username, loginId],
    );

    // Update address row – referring to the parent table `addresses`
    const [[{ addressId }]] = await conn.query('SELECT addressId FROM members WHERE id = ?', [id]);
    await conn.query(
      `
      UPDATE addresses
      SET lineOne = ?, lineTwo = ?, suburb = ?, postcode = ?, state = ?, country = ?
      WHERE id = ?
      `,
      [lineOne, lineTwo, suburb, postcode, state, country, addressId],
    );

    // Update member row with 2 FKs
    await conn.query(
      `
      UPDATE members
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, age = ?, gender = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, addressId, age, gender, id],
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Member successfully updated',
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  } finally {
    if (conn) conn.release();
  }
});

// Delete Member
memberController.delete('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  let conn = null;
  try {
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

    const [[firstMemberResult]] = await getMembersById(id);
    if (!firstMemberResult) {
      return res.status(404).json({
        status: 404,
        message: 'No member found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    await conn.query('DELETE FROM addresses WHERE id = ?', [firstMemberResult.addressId]);
    await conn.query('DELETE FROM logins WHERE id = ?', [firstMemberResult.loginId]);
    await conn.query('DELETE FROM members WHERE id = ?', [firstMemberResult.id]);

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Member successfully deleted',
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  } finally {
    if (conn) conn.release();
  }
});

export default memberController;
