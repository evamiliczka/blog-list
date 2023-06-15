require('express-async-errors');

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { info } = require('../utils/logger');

info('This is blogs.js');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  // if likes is not defined, set it to 0 (if it is 0, does not matter)
  if (!blog.likes) blog.likes = 0;

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
