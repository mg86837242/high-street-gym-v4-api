import pool from '../config/database.js';

// Read Activity
export function getAllActivities() {
  return pool.query('SELECT * FROM activities');
}

export function getActivitiesById(id) {
  return pool.query('SELECT * FROM activities WHERE id = ?', [id]);
}

export function getActivitiesByName(name) {
  return pool.query('SELECT * FROM activities WHERE name = ?', [name]);
}

// Create Activity
export function createActivity(
  name,
  category,
  description,
  intensityLevel,
  maxPeopleAllowed,
  requirementOne,
  requirementTwo,
  durationMinutes,
  price,
) {
  return pool.query(
    `
      INSERT INTO activities
      (name, category, description, intensityLevel, maxPeopleAllowed, requirementOne, requirementTwo, durationMinutes, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name,
      category,
      description,
      intensityLevel,
      maxPeopleAllowed,
      requirementOne,
      requirementTwo,
      durationMinutes,
      price,
    ],
  );
}

// Update Activity
export function updateActivityById(
  id,
  name,
  category,
  description,
  intensityLevel,
  maxPeopleAllowed,
  requirementOne,
  requirementTwo,
  durationMinutes,
  price,
) {
  return pool.query(
    `
      UPDATE activities
      SET name = ?, category = ?, description = ?, intensityLevel = ?, maxPeopleAllowed = ?, requirementOne = ?, requirementTwo = ?, durationMinutes = ?, price = ?
      WHERE id = ?
    `,
    [
      name,
      category,
      description,
      intensityLevel,
      maxPeopleAllowed,
      requirementOne,
      requirementTwo,
      durationMinutes,
      price,
      id,
    ],
  );
}

// Delete Activity
export function deleteActivityById(id) {
  return pool.query('DELETE FROM activities WHERE id = ?', [id]);
}
