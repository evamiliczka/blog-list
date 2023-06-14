const mongoose = require('mongoose');
const supertest = require('supertest');

mongoose.set("bufferTimeoutMS", 30000);

const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app); // initialise

/* In api.js we have got 
app.use('/api/blogs', blogsRouter); */
const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

beforeEach(async () => {
  // we are already connected to testBlogs MongoDB, and we are clearing "mongoose.model('Blog', blogSchema);" collection
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 100000);

test('blogs are returned as json ', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('the number of blogs in the DB is tha same as the number of initialBlogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
}, 100000);

test('all blogs have id', async () => {
  const response = await api.get('/api/blogs');
  // all elemnts have id
  response.body.forEach(blog => expect(blog.id).toBeDefined());
}, 100000);


test('all ids are different', async () => {
  const response = await api.get('/api/blogs');
  const blogIds = response.body.map(blog => blog.id);
  console.log(blogIds);
  // set only contins unique values, so we can check if all ids are different
  const setOfUniqueIds = new Set(blogIds);
  expect(blogIds).toHaveLength(setOfUniqueIds.size);
}, 100000);

// app.js does not close the server and we do not need it now
afterAll(async () => {
  await mongoose.connection.close();
});
