import { Router } from 'express';
import { emptyObjSchema, idSchema } from '../schemas/index.js';
import { getAllBlogs, getBlogsById, createBlog, updateBlogById, deleteBlogById } from '../models/blogs.js';

const blogController = Router();

// Read Blog
blogController.get('/blogs', async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [blogResults] = await getAllBlogs();

    return res.status(200).json({
      status: 200,
      message: 'Blog records successfully retrieved',
      blogs: blogResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

blogController.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstBlogResult]] = await getBlogsById(id);

    if (!firstBlogResult) {
      return res.status(404).json({
        status: 404,
        message: 'No blogs found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Blog record successfully retrieved',
      blog: firstBlogResult,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Create Blog
blogController.post('/blogs', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { memberId, title, body } = req.body;

    const [{ insertId }] = await createBlog(memberId, title, body);

    res.status(200).json({
      status: 200,
      message: 'Blog successfully created',
      insertId,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Update Blog
blogController.patch('/blogs/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const { memberId, title, body } = req.body;

    const [{ affectedRows }] = await updateBlogById(id, memberId, title, body);
    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No blogs found with the ID provided',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Blog successfully updated',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Delete Blog
blogController.delete('/blogs/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [{ affectedRows }] = await deleteBlogById(id);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No blogs found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Blog successfully deleted',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default blogController;
