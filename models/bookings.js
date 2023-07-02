import pool from '../config/database.js';

// Read Booking
export function getAllBookings() {
  return pool.query('SELECT * FROM bookings');
}

export function getBookingsById(id) {
  return pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
}

export function getBookingsByActivityId(activityId) {
  return pool.query('SELECT * FROM bookings WHERE activityId = ?', [activityId]);
}

export function getBookingsWithDetailsByDate(date) {
  return pool.query(
    `
    SELECT b.id, b.memberId, b.trainerId, b.activityId, b.dateTime,
    m.firstName AS memberFirstName, m.lastName AS memberLastName,
    t.firstName AS trainerFirstName, t.lastName AS trainerLastName,
    a.name AS activityName, a.durationMinutes
    FROM bookings b 
    INNER JOIN members m ON b.memberId = m.id
    INNER JOIN trainers t ON b.trainerId = t.id
    INNER JOIN activities a ON b.activityId = a.id
    WHERE DATE(b.dateTime) = ?
    ORDER BY b.dateTime
    `,
    [date]
  );
}

export function getBookingsWithDetailsById(id) {
  return pool.query(
    `
    SELECT b.id, b.memberId, b.trainerId, b.activityId, b.dateTime,
    m.firstName AS memberFirstName, m.lastName AS memberLastName, m.phone AS memberPhone,
    t.firstName AS trainerFirstName, t.lastName AS trainerLastName, t.phone AS trainerPhone,
    lm.email AS memberEmail,
    lt.email AS trainerEmail,
    a.name AS activityName, a.category, a.description, a.intensityLevel, a.maxPeopleAllowed, a.requirementOne, a.requirementTwo, a.durationMinutes, a.price
    FROM bookings b 
    INNER JOIN members m ON b.memberId = m.id
    INNER JOIN trainers t ON b.trainerId = t.id
    INNER JOIN logins lm on m.loginId = lm.id
    INNER JOIN logins lt on t.loginId = lt.id
    INNER JOIN activities a ON b.activityId = a.id
    WHERE b.id = ?
    `,
    [id]
  );
}

export function getConflictBookingsByMemberTrainerAndDateTime(memberId, trainerId, dateTime) {
  return pool.query('SELECT * FROM bookings WHERE (memberId = ? OR trainerId = ?) AND dateTime = ?', [
    memberId,
    trainerId,
    dateTime,
  ]);
}

export function getIdenticalBookings(memberId, trainerId, activityId, dateTime) {
  return pool.query('SELECT * FROM bookings WHERE memberId = ? AND trainerId = ? AND activityId = ? AND dateTime = ?', [
    memberId,
    trainerId,
    activityId,
    dateTime,
  ]);
}

export function getConflictBookingsByMemberTrainerAndDateTimeExceptCurr(id, memberId, trainerId, dateTime) {
  return pool.query('SELECT * FROM bookings WHERE (memberId = ? OR trainerId = ?) AND dateTime = ? AND NOT id = ?', [
    memberId,
    trainerId,
    dateTime,
    id,
  ]);
}

// Create Booking
export function createBooking(memberId, trainerId, activityId, dateTime) {
  return pool.query(
    `
    INSERT INTO bookings (memberId, trainerId, activityId, dateTime)
    VALUES (?, ?, ?, ?)
    `,
    [memberId, trainerId, activityId, dateTime]
  );
}

// Update Booking
export function updateBookingById(id, memberId, trainerId, activityId, dateTime) {
  return pool.query(
    `
    UPDATE bookings
    SET memberId = ?, trainerId = ?, activityId = ?, dateTime = ?
    WHERE id = ?
    `,
    [memberId, trainerId, activityId, dateTime, id]
  );
}

// Delete Booking
export function deleteBookingById(id) {
  return pool.query('DELETE FROM bookings WHERE id = ?', [id]);
}
