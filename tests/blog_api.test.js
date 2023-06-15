const mongoose = require('mongoose');
const supertest = require('supertest');

const { initialBlogs, allBlogsInDb, nonExisitngValidId } = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app); // initialise
mongoose.set("bufferTimeoutMS", 30000);

const { info } = require('../utils/logger'); // we can also use "error" message


beforeEach(async () => {
  // we are already connected to testBlogs MongoDB, and we are clearing "mongoose.model('Blog', blogSchema);" collection
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
}, 100000);

describe('when some blogs are initially saved', () => {
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
    info(blogIds);
    // set only contins unique values, so we can check if all ids are different
    const setOfUniqueIds = new Set(blogIds);
    expect(blogIds).toHaveLength(setOfUniqueIds.size);
  }, 100000);
}) // describe

describe('viewing a specific blog ', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await allBlogsInDb(); // maped with JSON belonging to noteSchema
    const blogToView = blogsAtStart[0];
    // info('noteToView is ', noteToView);
    const result = await api
      .get(`/api/blogs/${blogToView.id}`) // the app uses JSON belonging to noteSchema
      .expect(200)
      .expect('Content-Type', /application\/json/);

    //  info(' body is ', result.body);
    expect(result.body).toEqual(blogToView);
  });

  
  test('fails with status code 404 if note does not exist ', async () => {
    const validNonexisitngId = await nonExisitngValidId();

    await api.get(`/api/blogs/${validNonexisitngId}`).expect(404);
  });

  test('fails with status code 400 if id is invalid ', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  }); 
});

describe ('The addition of a blog', () =>
  {
    test('succeeds if data is valid ', async () => {
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

    const  blogsFinal = allBlogsInDb(); // helper 
  // info('Blogs final ', blogsFinal);
    expect(blogsFinal).toHaveLength(initialBlogs.length + 1);

    const contents = blogsFinal.map(blog => blog.title);
    expect(contents).toContain('JSON and co.');

  })

  test('gets likes to be 0 if likes are not defined ', async () => {
    const newBlog = {
      title: 'JSON and co.',
      author: 'Eva Miliczka',
      url: 'https://jsonandco.com/',
    }
    const postedBlog = await api.post('/api/blogs').send(newBlog);
    info('Posted blog body is ', postedBlog.body);
    expect(postedBlog.body.likes).toBe(0);

  })

  test('if title is missing, returns 400 Bad Request ', async () => {
    const newBlog = {
      author: 'Eva Miliczka',
      url: 'https://jsonandco.com/',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  })

}) // describe

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await allBlogsInDb();
    const blogToBeDeleted = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .expect(204);;

    const blogsAtEnd = await allBlogsInDb();

    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map((n) => n.title);
    expect(titles).not.toContain(blogToBeDeleted.title);
  });
}); // describe

describe('an update of a blog ', () => {
  const updatedBlog = {
    title: 'Lets update',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.miliczki.sk',
    likes: 5,
  };

 test('succeeds with a valid note and valid id', async () => {
  
    const blogs = await allBlogsInDb();
    const aBlog = blogs[0];
  
    await api.put(`/api/blogs/${aBlog.id}`).send(updatedBlog).expect(204);
  
    const blogsFinal = await allBlogsInDb();
    expect(blogsFinal).toHaveLength(initialBlogs.length);
    info('Notes final[0] is ', blogsFinal[0].title);
    expect(blogsFinal[0].title).toBe('Lets update');
  });


  test('succeeds even if the blog to be updated does not exist => a blog is added ', async () => {
    
    const validNonexisitngId = await nonExisitngValidId();

    await api.put(`/api/blogs/${validNonexisitngId}`).send(updatedBlog).expect(204);
  }); 

  test('fails with status code 400 if id is invalid ', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.put(`/api/blogs/${invalidId}`).send(updatedBlog).expect(400);
  }); 

  
  
}) // describe

// app.js does not close the server and we do not need it now
afterAll(async () => {
  await mongoose.connection.close();
});
