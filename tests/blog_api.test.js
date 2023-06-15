const mongoose = require('mongoose');
const supertest = require('supertest');


const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app); // initialise
mongoose.set("bufferTimeoutMS", 30000);

/* In api.js we have got 
app.use('/api/blogs', blogsRouter); */
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
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

test('a blog can be added ', async () => {
  const newBlog = {
    title: 'JSON and co.',
    author: 'Eva Miliczka',
    url: 'https://jsonandco.com/',
    likes: 8,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const  blogsFinal = await Blog.find({}); 
 // console.log('Blogs final ', blogsFinal);
  expect(blogsFinal).toHaveLength(initialBlogs.length + 1);

  const contents = (await blogsFinal).map(blog => blog.title);
  expect(contents).toContain('JSON and co.');

})

test('a blog with likes undefined gets likes to be 0 ', async () => {
  const newBlog = {
    title: 'JSON and co.',
    author: 'Eva Miliczka',
    url: 'https://jsonandco.com/',
  }
  const postedBlog = await api.post('/api/blogs').send(newBlog);
  console.log('Posted blog body is ', postedBlog.body);
  expect(postedBlog.body.likes).toBe(0);

})

test('if title is missing the response is 400 Bad Request ', async () => {
  const newBlog = {
    author: 'Eva Miliczka',
    url: 'https://jsonandco.com/',
  }
   await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
})


// app.js does not close the server and we do not need it now
afterAll(async () => {
  await mongoose.connection.close();
});
