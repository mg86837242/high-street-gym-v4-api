import { Router } from 'express';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import blogSchema from '../schemas/blogs.js';
import { getAllBlogs, getBlogsById, createBlog, updateBlogById, deleteBlogById } from '../models/blogs.js';
import permit from '../middleware/rbac.js';

const blogController = Router();

// Read Blog
blogController.get('/', async (req, res) => {
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
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

blogController.get('/:id', async (req, res) => {
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
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Create Blog
blogController.post('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!blogSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: blogSchema.safeParse(req.body).error.issues,
      });
    }
    const { title, body, loginId } = req.body;

    const [{ insertId }] = await createBlog(title, body, loginId);

    return res.status(200).json({
      status: 200,
      message: 'Blog successfully created',
      insertId,
    });
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Update Blog
blogController.patch('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    if (!blogSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: blogSchema.safeParse(req.body).error.issues,
      });
    }
    const { title, body, loginId } = req.body;

    const [{ affectedRows }] = await updateBlogById(id, title, body, loginId);

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
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Delete Blog
blogController.delete('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
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
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

export default blogController;
