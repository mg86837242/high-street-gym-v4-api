import pool from '../config/database.js';

// Read Booking
export function getAllBookings() {
  return pool.query('SELECT * FROM Bookings');
}

export function getBookingsById(id) {
  return pool.query('SELECT * FROM Bookings WHERE id = ?', [id]);
}

export function getBookingsByActivityId(activityId) {
  return pool.query('SELECT * FROM Bookings WHERE activityId = ?', [activityId]);
}

export function getBookingsWithDetailsByDate(date) {
  return pool.query(
    `
    SELECT b.id, b.memberId, b.trainerId, b.activityId, b.dateTime,
    m.firstName AS memberFirstName, m.lastName AS memberLastName,
    t.firstName AS trainerFirstName, t.lastName AS trainerLastName,
    a.name AS activityName, a.durationMinutes
    FROM Bookings b 
    INNER JOIN Members m ON b.memberId = m.id
    INNER JOIN Trainers t ON b.trainerId = t.id
    INNER JOIN Activities a ON b.activityId = a.id
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
    FROM Bookings b 
    INNER JOIN Members m ON b.memberId = m.id
    INNER JOIN Trainers t ON b.trainerId = t.id
    INNER JOIN Logins lm on m.loginId = lm.id
    INNER JOIN Logins lt on t.loginId = lt.id
    INNER JOIN Activities a ON b.activityId = a.id
    WHERE b.id = ?
  `,
    [id]
  );
}

export function getBookingsByTrainerAndDateTime(trainerId, dateTime) {
  return pool.query('SELECT * FROM Bookings WHERE trainerId = ? AND dateTime = ?', [trainerId, dateTime]);
}

export function getOtherBookingsByTrainerAndDateTime(id, trainerId, dateTime) {
  return pool.query('SELECT * FROM Bookings WHERE trainerId = ? AND dateTime = ? AND NOT id = ?', [
    trainerId,
    dateTime,
    id,
  ]);
}

export function getBookingsByAttrs(memberId, trainerId, activityId, dateTime) {
  return pool.query('SELECT * FROM Bookings WHERE memberId = ? AND trainerId = ? AND activityId = ? AND dateTime = ?', [
    memberId,
    trainerId,
    activityId,
    dateTime,
  ]);
}

// Create Booking
export function createBooking(memberId, trainerId, activityId, dateTime) {
  return pool.query(
    `
    INSERT INTO Bookings (memberId, trainerId, activityId, dateTime)
    VALUES (?, ?, ?, ?)
    `,
    [memberId, trainerId, activityId, dateTime]
  );
}

// Update Booking
export function updateBookingById(id, memberId, trainerId, activityId, dateTime) {
  return pool.query(
    `
    UPDATE Bookings
    SET memberId = ?, trainerId = ?, activityId = ?, dateTime = ?
    WHERE id = ?
    `,
    [memberId, trainerId, activityId, dateTime, id]
  );
}

// Delete Booking
export function deleteBookingById(id) {
  return pool.query('DELETE FROM Bookings WHERE id = ?', [id]);
}
