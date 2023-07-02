import pool from '../config/database.js';

// Read Member
export function getAllMembers() {
  return pool.query('SELECT * FROM members');
}

export function getAllMembersWithDetails() {
  return pool.query(
    `
    SELECT m.id, m.firstName, m.lastName, m.phone, m.age, m.gender,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM members m
    INNER JOIN logins l on m.loginId = l.id
    INNER JOIN addresses a on m.addressId = a.id
    `
  );
}

export function getMembersById(id) {
  return pool.query('SELECT * FROM members WHERE id = ?', [id]);
}

export function getMembersWithDetailsById(id) {
  return pool.query(
    `
    SELECT m.id, m.firstName, m.lastName, m.phone, m.age, m.gender,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM members m
    INNER JOIN logins l on m.loginId = l.id
    INNER JOIN addresses a on m.addressId = a.id
    WHERE m.id = ?
    `,
    [id]
  );
}

export function getMembersByLoginId(loginId) {
  return pool.query('SELECT * FROM members WHERE loginId = ?', [loginId]);
}

export function getMembersWithDetailsByLoginId(loginId) {
  return pool.query(
    `
    SELECT m.id, m.firstName, m.lastName, m.phone, m.age, m.gender,
    l.email, l.password, l.username,
    a.lineOne, a.lineTwo, a.suburb, a.postcode, a.state, a.country
    FROM members m
    INNER JOIN logins l on m.loginId = l.id
    INNER JOIN addresses a on m.addressId = a.id
    WHERE m.loginId = ?
  `,
    [loginId]
  );
}

export function getMembersAddressesIdById(id) {
  return pool.query('SELECT addressId FROM members WHERE id = ?', [id]);
}

// Create Member
export function createMember(loginId, firstName, lastName, phone, addressId, age, gender) {
  return pool.query(
    `
		INSERT INTO members (loginId, firstName, lastName, phone, addressId, age, gender)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		`,
    [loginId, firstName, lastName, phone, addressId, age, gender]
  );
}

// Update Member
export function updateMemberById(id, loginId, firstName, lastName, phone, addressId, age, gender) {
  return pool.query(
    `
		UPDATE members
		SET loginId = ?, firstName = ?, lastName = ?, phone = ?, addressId = ?, age = ?, gender = ?
		WHERE id = ?
		`,
    [loginId, firstName, lastName, phone, addressId, age, gender, id]
  );
}

// Delete Member
export function deleteMemberById(id) {
  return pool.query('DELETE FROM members WHERE id = ?', [id]);
}
