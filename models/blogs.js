import pool from '../config/database.js';

// Read Blog
export function getAllBlogs() {
  return pool.query('SELECT * FROM Blogs');
}

export function getBlogsById(id) {
  return pool.query('SELECT * FROM Blogs WHERE id = ?', [id]);
}

export function getBlogsByLoginId(loginId) {
  return pool.query('SELECT * FROM Blogs WHERE loginId = ?', [loginId]);
}

// Create Blog
export function createBlog(title, body, loginId) {
  return pool.query(
    `
		INSERT INTO Blogs (title, body, loginId, createdAt)
		VALUES (?, ?, ?, NOW())
		`,
    [title, body, loginId]
  );
}

// Update Blog
export function updateBlogById(id, title, body, loginId) {
  return pool.query(
    `
		UPDATE Blogs
		SET title = ?, body = ?, loginId = ?, updatedAt = NOW()
		WHERE id = ?
		`,
    [title, body, loginId, id]
  );
}

// Delete Blog
export function deleteBlogById(id) {
  return pool.query('DELETE FROM Blogs WHERE id = ?', [id]);
}
