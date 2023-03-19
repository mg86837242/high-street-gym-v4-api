import pool from '../config/database.js';

// Read Trainer
export function getAllTrainers() {
  return pool.query('SELECT * FROM Trainers');
}

export function getTrainersById(id) {
  return pool.query('SELECT * FROM Trainers WHERE id = ?', [id]);
}

export function getTrainersByLoginId(loginId) {
  return pool.query('SELECT * FROM Trainers WHERE loginId = ?', [loginId]);
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
		INSERT INTO Trainers (loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl)
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
		UPDATE Trainers
		SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, description = ?, specialty = ?, certificate = ?, imageUrl = ?
		WHERE id = ?
		`,
    [loginId, firstName, lastName, phone, addressId, description, specialty, certificate, imageUrl, id]
  );
}

// Delete Trainer
export function deleteTrainerById(id) {
  return pool.query('DELETE FROM Trainers WHERE id = ?', [id]);
}
