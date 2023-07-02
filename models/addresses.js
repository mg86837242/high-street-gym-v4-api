import pool from '../config/database.js';

// Read Address
export function getAllAddresses() {
  return pool.query('SELECT * FROM addresses');
}

export function getAddressesById(id) {
  return pool.query('SELECT * FROM addresses WHERE id = ?', [id]);
}

export function getIdenticalAddressesByDetails(lineOne, lineTwo, suburb, postcode, state, country) {
  return pool.query(
    'SELECT * FROM addresses WHERE lineOne = ? AND lineTwo = ? AND suburb = ? AND postcode = ? AND state = ? AND country = ?',
    [lineOne, lineTwo, suburb, postcode, state, country]
  );
}

// Create Address
export function createAddress(lineOne, lineTwo, suburb, postcode, state, country) {
  return pool.query(
    `
		INSERT INTO addresses
		(lineOne, lineTwo, suburb, postcode, state, country)
		VALUES (?, ?, ?, ?, ?, ?)
		`,
    [lineOne, lineTwo, suburb, postcode, state, country]
  );
}

// Update Address
export function updateAddressById(id, lineOne, lineTwo, suburb, postcode, state, country) {
  return pool.query(
    `
		UPDATE addresses
		SET lineOne = ?, lineTwo = ?, suburb = ?, postcode = ?, state = ?, country = ?
		WHERE id = ?
		`,
    [lineOne, lineTwo, suburb, postcode, state, country, id]
  );
}

// Delete Address
export function deleteAddressById(id) {
  return pool.query('DELETE FROM addresses WHERE id = ?', [id]);
}
