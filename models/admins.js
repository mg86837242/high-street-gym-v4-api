import pool from '../config/database.js';

// Read Admin
export function getAllAdmins() {
  return pool.query('SELECT * FROM Admins');
}

export function getAdminsById(id) {
  return pool.query('SELECT * FROM Admins WHERE id = ?', [id]);
}

export function getAdminsWithDetailsById(id) {
  return pool.query(
    `
    SELECT d.firstName, d.lastName, d.phone,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM Admins d
    INNER JOIN Logins l on d.loginId = l.id
    INNER JOIN Addresses a on d.addressId = a.id
    WHERE d.id = ?
    `,
    [id]
  );
}

export function getAdminsByLoginId(loginId) {
  return pool.query('SELECT * FROM Admins WHERE loginId = ?', [loginId]);
}

// Create Admin
export function createAdmin(loginId, firstName, lastName, phone, addressId) {
  return pool.query(
    `
		INSERT INTO Admins (loginId, firstName, lastName, phone, addressId)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
    [loginId, firstName, lastName, phone, addressId]
  );
}

// Update Admin
export function updateAdminById(id, loginId, firstName, lastName, phone, addressId) {
  return pool.query(
    `
		UPDATE Admins
		SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?
		WHERE id = ?
		`,
    [loginId, firstName, lastName, phone, addressId, id]
  );
}

// Delete Admin
export function deleteAdminById(id) {
  return pool.query('DELETE FROM Admins WHERE id = ?', [id]);
}
