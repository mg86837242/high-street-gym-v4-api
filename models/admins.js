import pool from '../config/database.js';

// Read Admin
export function getAllAdmins() {
  return pool.query('SELECT * FROM admins');
}

export function getAdminsById(id) {
  return pool.query('SELECT * FROM admins WHERE id = ?', [id]);
}

export function getAdminsWithDetailsById(id) {
  return pool.query(
    `
    SELECT d.id, d.firstName, d.lastName, d.phone,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM admins d
    INNER JOIN logins l on d.loginId = l.id
    INNER JOIN addresses a on d.addressId = a.id
    WHERE d.id = ?
    `,
    [id],
  );
}

export function getAdminsByLoginId(loginId) {
  return pool.query('SELECT * FROM admins WHERE loginId = ?', [loginId]);
}

export function getAdminsWithDetailsByLoginId(loginId) {
  return pool.query(
    `
    SELECT d.id, d.firstName, d.lastName, d.phone,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM admins d
    INNER JOIN logins l on d.loginId = l.id
    INNER JOIN addresses a on d.addressId = a.id
    WHERE d.loginId = ?
    `,
    [loginId],
  );
}

export function getAdminsAddressesIdById(id) {
  return pool.query('SELECT addressId FROM admins WHERE id = ?', [id]);
}

// Create Admin
export function createAdmin(loginId, firstName, lastName, phone, addressId) {
  return pool.query(
    `
		INSERT INTO admins (loginId, firstName, lastName, phone, addressId)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
    [loginId, firstName, lastName, phone, addressId],
  );
}

// Update Admin
export function updateAdminById(id, loginId, firstName, lastName, phone, addressId) {
  return pool.query(
    `
		UPDATE admins
		SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?
		WHERE id = ?
		`,
    [loginId, firstName, lastName, phone, addressId, id],
  );
}

// Delete Admin
export function deleteAdminById(id) {
  return pool.query('DELETE FROM admins WHERE id = ?', [id]);
}
