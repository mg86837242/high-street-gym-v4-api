import pool from '../config/database.js';

// Read Login
export function getAllLogins() {
  return pool.query('SELECT * FROM Logins');
}

export function getAllEmails() {
  return pool.query('SELECT email FROM Logins');
}

export function getLoginsById(id) {
  return pool.query('SELECT * FROM Logins WHERE id = ?', [id]);
}

export function getLoginsByEmail(email) {
  return pool.query('SELECT * FROM Logins WHERE email = ?', [email]);
}

export function getLoginsByAccessKey(accessKey) {
  return pool.query('SELECT * FROM Logins WHERE accessKey = ?', [accessKey]);
}

// Create Login
export function createLogin(email, password, username) {
  return pool.query(
    `
		INSERT INTO Logins (email, password, username)
		VALUES (?, ?, ?)
		`,
    [email, username, password]
  );
}

// Update Login (NB current business logic doesn't allow role change, and requires a separate account for any diff role)
export function updateLoginById(id, email, password, username) {
  return pool.query(
    `
		UPDATE Logins
		SET email = ?, password = ?, username = ?
		WHERE id = ?
		`,
    [email, username, password, id]
  );
}

export function updateLoginAccessKeyById(id, accessKey) {
  return pool.query(
    `
    UPDATE Logins
    SET accessKey = ?
    WHERE id = ?
    `,
    [accessKey, id]
  );
}

// Delete Login
export function deleteLoginById(id) {
  return pool.query('DELETE FROM Logins WHERE id = ?', [id]);
}
