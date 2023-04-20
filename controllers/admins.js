import { Router } from 'express';
import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import pool from '../config/database.js';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import { adminSchema } from '../schemas/admins.js';
import { getAllAdmins, getAdminsById, getAdminsWithDetailsById, deleteAdminById } from '../models/admins.js';
import permit from '../middleware/rbac.js';

const adminController = Router();

// Read Admin
adminController.get('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

adminController.get('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

adminController.get('/:id/detailed', permit('Admin'), async (req, res) => {
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
      admin: firstAdminResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Create Admin
adminController.post('/detailed', permit('Admin'), async (req, res) => {
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

    // Find if there's a login row with identical email – referring to the parent table `Logins`
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

    // Create address row – referring to the parent table `Addresses`
    let addressId = null;
    if (lineOne && suburb && postcode && state && country) {
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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  } finally {
    if (conn) conn.release();
  }
});

// Update Admin
adminController.patch('/:id', permit('Admin'), async (req, res) => {
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

    const [[firstAdminResult]] = await getAdminsById(id);
    if (!firstAdminResult) {
      return res.status(404).json({
        status: 404,
        message: 'No admin found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email EXCEPT the request maker – referring to the parent table `Logins`
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM Admins WHERE id = ?', [id]);
    const [[emailExists]] = await conn.query('SELECT * FROM Logins WHERE email = ? AND NOT id = ?', [email, loginId]);
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
      UPDATE Logins
      SET email = ?, password = ?, username = ?
      WHERE id = ?
      `,
      [email, hashedPassword, username, loginId]
    );

    // Update admin row with `loginId` FK
    await conn.query(
      `
      UPDATE Admins
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, id]
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Admin successfully updated',
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

adminController.patch('/:id/detailed', permit('Admin'), async (req, res) => {
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

    const [[firstAdminResult]] = await getAdminsById(id);
    if (!firstAdminResult) {
      return res.status(404).json({
        status: 404,
        message: 'No admin found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email EXCEPT the request maker – referring to the parent table `Logins`
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM Admins WHERE id = ?', [id]);
    const [[emailExists]] = await conn.query('SELECT * FROM Logins WHERE email = ? AND NOT id = ?', [email, loginId]);
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
      UPDATE Logins
      SET email = ?, password = ?, username = ?
      WHERE id = ?
      `,
      [email, hashedPassword, username, loginId]
    );

    // Update address row – referring to the parent table `Addresses`
    let [[{ addressId }]] = await conn.query('SELECT addressId FROM Admins WHERE id = ?', [id]);
    await conn.query(
      `
        UPDATE Addresses
        SET lineOne = ?, lineTwo = ?, suburb = ?, postcode = ?, state = ?, country = ?
        WHERE id = ?
        `,
      [lineOne, lineTwo, suburb, postcode, state, country, addressId]
    );

    // Update admin row with 2 FKs
    await conn.query(
      `
      UPDATE Admins
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, addressId, id]
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Admin successfully updated',
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

// Delete Admin
adminController.delete('/:id', permit('Admin'), async (req, res) => {
  let conn = null;
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

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    await conn.query('DELETE FROM Addresses WHERE id = ?', [firstAdminResult.addressId]);
    await conn.query('DELETE FROM Logins WHERE id = ?', [firstAdminResult.loginId]);
    await conn.query('DELETE FROM Admins WHERE id = ?', [firstAdminResult.id]);

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Admin successfully deleted',
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

export default adminController;
