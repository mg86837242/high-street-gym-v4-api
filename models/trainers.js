import pool from '../config/database.js';

// Read Trainer
export function getAllTrainers() {
  return pool.query('SELECT * FROM trainers');
}

export function getTrainersById(id) {
  return pool.query('SELECT * FROM trainers WHERE id = ?', [id]);
}

export function getTrainersWithDetailsById(id) {
  return pool.query(
    `
    SELECT t.id, t.firstName, t.lastName, t.phone, t.description, t.specialty, t.certificate, t.imageUrl,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM trainers t
    INNER JOIN logins l on t.loginId = l.id
    INNER JOIN addresses a on t.addressId = a.id
    WHERE t.id = ?
    `,
    [id]
  );
}

export function getTrainersByLoginId(loginId) {
  return pool.query('SELECT * FROM trainers WHERE loginId = ?', [loginId]);
}

export function getTrainersWithDetailsByLoginId(loginId) {
  return pool.query(
    `
    SELECT t.id, t.firstName, t.lastName, t.phone, t.description, t.specialty, t.certificate, t.imageUrl,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM trainers t
    INNER JOIN logins l on t.loginId = l.id
    INNER JOIN addresses a on t.addressId = a.id
    WHERE t.loginId = ?
    `,
    [loginId]
  );
}

export function getTrainersAddressesIdById(id) {
  return pool.query('SELECT addressId FROM trainers WHERE id = ?', [id]);
}

// Create Trainer
export function createTrainer(
  loginId,
  firstName,
  lastName,
  phone,
  addressId,
  description,
  specialty,
  certificate,
  imageUrl
) {
  return pool.query(
    `
		INSERT INTO trainers (loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
    [loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl]
  );
}

// Update Trainer
export function updateTrainerById(
  id,
  loginId,
  firstName,
  lastName,
  phone,
  addressId,
  description,
  specialty,
  certificate,
  imageUrl
) {
  return pool.query(
    `
		UPDATE trainers
		SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, description = ?, specialty = ?, certificate = ?, imageUrl = ?
		WHERE id = ?
		`,
    [loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl, id]
  );
}

// Delete Trainer
export function deleteTrainerById(id) {
  return pool.query('DELETE FROM trainers WHERE id = ?', [id]);
}
