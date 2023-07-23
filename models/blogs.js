import pool from '../config/database.js';

// Read Blog
export function getAllBlogs() {
  return pool.query(
    `
    SELECT b.id, b.title, b.body, b.loginId, b.createdAt, b.updatedAt,
    l.username, l.role
    FROM blogs b
    INNER JOIN logins l on b.loginId = l.id
    `,
  );
}

export function getBlogsById(id) {
  return pool.query(
    `
    SELECT b.id, b.title, b.body, b.loginId, b.createdAt, b.updatedAt,
    l.username, l.role
    FROM blogs b
    INNER JOIN logins l on b.loginId = l.id
    WHERE b.id = ?
    `,
    [id],
  );
}

// Create Blog
export function createBlog(title, body, loginId) {
  return pool.query(
    `
		INSERT INTO blogs (title, body, loginId, createdAt)
		VALUES (?, ?, ?, NOW())
		`,
    [title, body, loginId],
  );
}

// Update Blog
export function updateBlogById(id, title, body, loginId) {
  return pool.query(
    `
		UPDATE blogs
		SET title = ?, body = ?, loginId = ?, updatedAt = NOW()
		WHERE id = ?
		`,
    [title, body, loginId, id],
  );
}

// Delete Blog
export function deleteBlogById(id) {
  return pool.query('DELETE FROM blogs WHERE id = ?', [id]);
}
