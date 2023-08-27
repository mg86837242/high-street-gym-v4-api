import Router from 'express-promise-router';

import permit from '../middleware/authorization.js';
import { createBlog, deleteBlogById,getAllBlogs, getBlogsById, updateBlogById } from '../models/blogs.js';
import { blogSchema, updateBlogSchema } from '../schemas/blogs.js';
import { emptyObjSchema, idSchema } from '../schemas/params.js';

const blogController = new Router();

// Read Blog
blogController.get('/', async (req, res) => {
  try {
    const result = await emptyObjSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }

    const [blogResults] = await getAllBlogs();

    return res.status(200).json({
      status: 200,
      message: 'Blog records successfully retrieved',
      blogs: blogResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

blogController.get('/:id', async (req, res) => {
  try {
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Create Blog
blogController.post('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await blogSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const { title, body, loginId } = result.data;

    const [{ insertId }] = await createBlog(title, body, loginId);

    return res.status(200).json({
      status: 200,
      message: 'Blog successfully created',
      insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Update Blog
blogController.patch('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await updateBlogSchema.spa({
      params: req.params,
      body: req.body,
    });
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const {
      params: { id },
      body: { title, body, loginId },
    } = result.data;

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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Delete Blog
blogController.delete('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

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
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

export default blogController;
