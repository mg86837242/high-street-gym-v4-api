import { Router } from 'express';
import bcrypt from 'bcryptjs'; // reason to use `bcryptjs`: https://github.com/kelektiv/node.bcrypt.js/issues/705
import pool from '../config/database.js';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import { trainerDetailedSchema, updateTrainerDetailedSchema, updateTrainerSchema } from '../schemas/trainers.js';
import { getAllTrainers, getTrainersById, getTrainersWithDetailsById } from '../models/trainers.js';
import permit from '../middleware/authorization.js';

const trainerController = Router();

// Read Trainer
trainerController.get('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await emptyObjSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }

    const [trainerResults] = await getAllTrainers();

    return res.status(200).json({
      status: 200,
      message: 'Trainer record successfully retrieved',
      trainers: trainerResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

trainerController.get('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

trainerController.get('/:id/detailed', permit('Admin', 'Trainer'), async (req, res) => {
  try {
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

    const [[firstTrainerResult]] = await getTrainersWithDetailsById(id);
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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Create Trainer
trainerController.post('/detailed', permit('Admin', 'Trainer'), async (req, res) => {
  let conn = null;
  try {
    const result = await trainerDetailedSchema.spa(req.body);
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
      [email, hashedPassword, username, 'Trainer'],
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

    // Create trainer row with 2 FKs
    const [{ insertId }] = await conn.query(
      `
      INSERT INTO trainers (loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl],
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Trainer successfully created',
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

// Update Trainer
trainerController.patch('/:id', permit('Admin', 'Trainer'), async (req, res) => {
  let conn = null;
  try {
    const result = await updateTrainerSchema.spa({
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
      body: { email, password, username, firstName, lastName, phone, description, specialty, certificate, imageUrl },
    } = result.data;

    const [[firstTrainerResult]] = await getTrainersById(id);
    if (!firstTrainerResult) {
      return res.status(404).json({
        status: 404,
        message: 'No trainer found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email EXCEPT the request maker – referring to the parent table `logins`
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM trainers WHERE id = ?', [id]);
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

    // Update trainer row with `loginId` FK
    await conn.query(
      `
      UPDATE trainers
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, description = ?, specialty = ?, certificate = ?, imageUrl = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, description, specialty, certificate, imageUrl, id],
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'trainer successfully updated',
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

trainerController.patch('/:id/detailed', permit('Admin', 'Trainer'), async (req, res) => {
  let conn = null;
  try {
    const result = await updateTrainerDetailedSchema.spa({
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
      },
    } = result.data;

    const [[firstTrainerResult]] = await getTrainersById(id);
    if (!firstTrainerResult) {
      return res.status(404).json({
        status: 404,
        message: 'No trainer found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Find if there's a login row with identical email EXCEPT the request maker – referring to the parent table `logins`
    const [[{ loginId }]] = await conn.query('SELECT loginId FROM trainers WHERE id = ?', [id]);
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
    const [[{ addressId }]] = await conn.query('SELECT addressId FROM trainers WHERE id = ?', [id]);
    await conn.query(
      `
      UPDATE addresses
      SET lineOne = ?, lineTwo = ?, suburb = ?, postcode = ?, state = ?, country = ?
      WHERE id = ?
      `,
      [lineOne, lineTwo, suburb, postcode, state, country, addressId],
    );

    // Update trainer row with 2 FKs
    await conn.query(
      `
      UPDATE trainers
      SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, description = ?, specialty = ?, certificate = ?. imageUrl = ?
      WHERE id = ?
      `,
      [loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl, id],
    );

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Trainer successfully updated',
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

// Delete Trainer
trainerController.delete('/:id', permit('Admin', 'Trainer'), async (req, res) => {
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

    const [[firstTrainerResult]] = await getTrainersById(id);
    if (!firstTrainerResult) {
      return res.status(404).json({
        status: 404,
        message: 'No trainer found with the ID provided',
      });
    }

    // Manually acquire a connection from the pool & start a TRANSACTION
    conn = await pool.getConnection();
    await conn.beginTransaction();

    await conn.query('DELETE FROM addresses WHERE id = ?', [firstTrainerResult.addressId]);
    await conn.query('DELETE FROM logins WHERE id = ?', [firstTrainerResult.loginId]);
    await conn.query('DELETE FROM trainers WHERE id = ?', [firstTrainerResult.id]);

    await conn.commit();
    return res.status(200).json({
      status: 200,
      message: 'Trainer successfully deleted',
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

export default trainerController;
