import pool from '../config/database.js';

// Read Address
export function getAllAddresses() {
  return pool.query('SELECT * FROM Addresses');
}

export function getAddressesById(id) {
  return pool.query('SELECT * FROM Addresses WHERE id = ?', [id]);
}

export function getAddressesByDetails(streetOne, streetTwo, suburb, postcode, state, country) {
  return pool.query(
    'SELECT * FROM Addresses WHERE streetOne = ? AND streetTwo = ? AND suburb = ? AND postcode = ? AND state = ? AND country = ?',
    [streetOne, streetTwo, suburb, postcode, state, country]
  );
}

// Create Address
export function createAddress(streetOne, streetTwo, suburb, postcode, state, country) {
  return pool.query(
    `
		INSERT INTO Addresses
		(streetOne, streetTwo, suburb, postcode, state, country)
		VALUES (?, ?, ?, ?, ?, ?)
		`,
    [streetOne, streetTwo, suburb, postcode, state, country]
  );
}

// Update Address
export function updateAddressById(id, streetOne, streetTwo, suburb, postcode, state, country) {
  return pool.query(
    `
		UPDATE Addresses
		SET streetOne = ?, streetTwo = ?, suburb = ?, postcode = ?, state = ?, country = ?
		WHERE id = ?
		`,
    [streetOne, streetTwo, suburb, postcode, state, country, id]
  );
}

// Delete Address
export function deleteAddressById(id) {
  return pool.query('DELETE FROM Addresses WHERE id = ?', [id]);
}
