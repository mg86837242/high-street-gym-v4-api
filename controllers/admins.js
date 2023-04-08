import { Router } from 'express';
import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import pool from '../config/database.js';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import { adminSchema } from '../schemas/admins.js';
import { getAllAdmins, getAdminsById, getAdminsWithDetailsById, deleteAdminById } from '../models/admins.js';
import permit from '../middleware/rbac.js';

const adminController = Router();

// Read Admin
adminController.get('/admins', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [adminResults] = await getAllAdmins();

    return res.status(200).json({
      status: 200,
      message: 'Admin record successfully retrieved',
      admins: adminResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

adminController.get('/admins/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstAdminResult]] = await getAdminsById(id);

    if (!firstAdminResult) {
      return res.status(404).json({
        status: 404,
        message: 'No admin found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Admin record successfully retrieved',
      admin: firstAdminResult,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

adminController.get('/admins/admin-with-all-details/:id', permit('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstAdminResult]] = await getAdminsWithDetailsById(id);

    if (!firstAdminResult) {
      return res.status(404).json({
        status: 404,
        message: 'No admin found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Admin record successfully retrieved',
      initialValues: firstAdminResult,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Create Admin
adminController.post(
  '/admins',
  [
    // Enable as needed
    // permit('Admin'),
  ],
  async (req, res) => {
    let conn = null;
    try {
      const {
        email,
        password,
        username,
        firstName,
        lastName,
        phone,
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
        [email, hashedPassword, username, 'Admin']
      );
      const loginId = createLoginResult.insertId;

      // Find if there's existing address row – referring to the parent table `Addresses`
      let addressId = null;
      if (lineOne && suburb && postcode && state && country) {
        const [[addressExists]] = await conn.query(
          'SELECT * FROM Addresses WHERE lineOne = ? AND lineTwo = ? AND suburb = ? AND postcode = ? AND state = ? AND country = ?',
          [lineOne, null, suburb, postcode, state, country]
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

      // Create admin row with 2 FKs
      const [{ insertId }] = await conn.query(
        `
      INSERT INTO Admins (loginId, firstName, lastName, phone, addressId)
      VALUES (?, ?, ?, ?, ?)
      `,
        [loginId, firstName, lastName, phone, addressId]
      );

      await conn.commit();
      return res.status(200).json({
        status: 200,
        message: 'Admin successfully created',
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
  }
);

// Update Admin
adminController.patch('/admins/:id', permit('Admin'), async (req, res) => {
  let conn = null;
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    if (!adminSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: adminSchema.safeParse(req.body).error.issues,
      });
    }
    const { email, password, username, firstName, lastName, phone } = req.body;

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's login row with duplicate email EXCEPT the request maker – referring to the parent table `Logins`
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM Admins WHERE id = ?', [id]);
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

    // Update admin row with 2 FKs
    const [{ affectedRows }] = await conn.query(
      `
      UPDATE Admins
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, id]
    );

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No admin found with the ID provided',
      });
    }
    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Admin successfully updated',
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  } finally {
    if (conn) conn.release();
  }
});

adminController.patch('/admins/admin-with-all-details/:id', permit('Admin'), async (req, res) => {
  let conn = null;
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      phone,
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
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM Admins WHERE id = ?', [id]);
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
    let [[addressId]] = await conn.query('SELECT addressId FROM Admins WHERE id = ?', [id]);
    const [[addressExists]] = await conn.query(
      'SELECT * FROM Addresses WHERE lineOne = ? AND lineTwo = ? AND suburb = ? AND postcode = ? AND state = ? AND country = ?',
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

    // Update admin row with 2 FKs
    const [{ affectedRows }] = await conn.query(
      `
      UPDATE Admins
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, addressId, id]
    );

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No admin found with the ID provided',
      });
    }
    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Admin successfully updated',
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

// Delete Admin
adminController.delete('/admins/:id', permit('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [{ affectedRows }] = await deleteAdminById(id);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No admin found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Admin successfully deleted',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default adminController;
