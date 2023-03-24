import { Router } from 'express';
import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import pool from '../config/database.js';
import { emptyObjSchema, idSchema } from '../schemas/index.js';
import { getAllTrainers, getTrainersById, deleteTrainerById } from '../models/trainers.js';
import permit from '../middleware/rbac.js';

const trainerController = Router();

// Read Trainer
trainerController.get('/trainers', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [trainerResults] = await getAllTrainers();

    return res.status(200).json({
      status: 200,
      message: 'Trainer record successfully retrieved',
      trainers: trainerResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

trainerController.get('/trainers/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstTrainerResult]] = await getTrainersById(id);

    if (!firstTrainerResult) {
      return res.status(404).json({
        status: 404,
        message: 'No trainer found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Trainer record successfully retrieved',
      trainer: firstTrainerResult,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Create Trainer
trainerController.post('/trainers', permit('Admin', 'Trainer'), async (req, res) => {
  let conn = null;
  try {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      phone,
      description,
      specialty,
      certificate,
      imageUrl,
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
      [email, hashedPassword, username, 'Trainer']
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

    // Create trainer row with 2 FKs
    const [{ insertId }] = await conn.query(
      `
      INSERT INTO Trainers (loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl]
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Trainer successfully created',
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

// Update Trainer
trainerController.patch('/trainers/:id', permit('Admin', 'Trainer'), async (req, res) => {
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
      description,
      specialty,
      certificate,
      imageUrl,
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
    const [[loginId]] = await conn.query('SELECT loginId FROM Trainers WHERE id = ?', [id]);
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
    let [[addressId]] = await conn.query('SELECT addressId FROM Trainers WHERE id = ?', [id]);
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

    // Update trainer row with 2 FKs
    const [{ affectedRows }] = await conn.query(
      `
      UPDATE Trainers
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, description = ?, specialty = ?, certificate = ?. imageUrl = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl, id]
    );

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No trainer found with the ID provided',
      });
    }
    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Trainer successfully updated',
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

// Delete Trainer
trainerController.delete('/trainers/:id', permit('Admin', 'Trainer'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [{ affectedRows }] = await deleteTrainerById(id);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No trainer found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Trainer successfully deleted',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default trainerController;
