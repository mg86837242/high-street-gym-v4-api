import pool from '../config/database.js';

// Read Member
export function getAllMembers() {
  return pool.query('SELECT * FROM Members');
}

export function getMembersById(id) {
  return pool.query('SELECT * FROM Members WHERE id = ?', [id]);
}

export function getMembersByLoginId(loginId) {
  return pool.query('SELECT * FROM Members WHERE loginId = ?', [loginId]);
}

// Create Member
export function createMember(loginId, firstName, lastName, phone, addressId, age, gender) {
  return pool.query(
    `
		INSERT INTO Members (loginId, firstName, lastName, phone, addressId, age, gender)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		`,
    [loginId, firstName, lastName, phone, addressId, age, gender]
  );
}

// Update Member
export function updateMemberById(id, loginId, firstName, lastName, phone, addressId, age, gender) {
  return pool.query(
    `
		UPDATE Members
		SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, age = ?, gender = ?
		WHERE id = ?
		`,
    [loginId, firstName, lastName, phone, addressId, age, gender, id]
  );
}

// Delete Member
export function deleteMemberById(id) {
  return pool.query('DELETE FROM Members WHERE id = ?', [id]);
}
