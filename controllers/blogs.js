/* eslint-disable no-underscore-dangle */
require('express-async-errors');

const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const { info, error } = require('../utils/logger');


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  // console.log('This is get by id, request');
  const blog = await Blog.findById(request.params.id);

  if (blog) response.json(blog);
  else {
    // valid id, non existing blog
    error('Blog not found error');
    response.status(404).end();
  }

  // if id is INVALID, i.e. error.name === 'CastError', then express-async-errors package finds and executes
  // errorHandler in middleware.js , with status 400, 'malformed id
});

blogsRouter.post('/', async (request, response) => {
  // verify indentity of user in Authentification header
  const authorization = request.get('authorization');
  if (!authorization) return response.status(401).json({ error: 'Authorization missing'});

  const token = authorization.replace('bearer ','');
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) return response.status(401).json({ error: 'Invalid token'});

  const user = await User.findById(decodedToken.id);

  // eslint-disable-next-line prefer-const
  let { title, author, url, likes } = request.body;
  // if likes is not defined, set it to 0 (if it is 0, does not matter)

  if (likes) likes = 0;

  const newBlogModel = new Blog({ title, author, url, likes, user: user._id });
  // info('model to save  ', newBlogModel);
  const savedBlog = await newBlogModel.save();

  user.blogs = user.blogs.concat(savedBlog._id);

  await user.save();

  return response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes} = request.body;
   info('This is put, we are going to put ', title, author, url, likes)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query'} );

 
  response.status(204).json(updatedBlog);
})

module.exports = blogsRouter;
