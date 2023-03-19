import pool from '../config/database.js';

// Read Blog
export function getAllBlogs() {
  return pool.query('SELECT * FROM Blogs');
}

export function getBlogsById(id) {
  return pool.query('SELECT * FROM Blogs WHERE id = ?', [id]);
}

export function getBlogsByMemberId(memberId) {
  return pool.query('SELECT * FROM Blogs WHERE memberId = ?', [memberId]);
}

// Create Blog
export function createBlog(memberId, title, body) {
  return pool.query(
    `
		INSERT INTO Blogs (memberId, title, body, createdAt)
		VALUES (?, ?, ?, NOW())
		`,
    [memberId, title, body]
  );
}

// Update Blog
export function updateBlogById(id, memberId, title, body) {
  return pool.query(
    `
		UPDATE Blogs
		SET memberId = ?, title = ?, body = ?, updatedAt = NOW()
		WHERE id = ?
		`,
    [memberId, title, body, id]
  );
}

// Delete Blog
export function deleteBlogById(id) {
  return pool.query('DELETE FROM Blogs WHERE id = ?', [id]);
}
