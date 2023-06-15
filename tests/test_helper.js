/* eslint-disable no-underscore-dangle */
const Blog = require('../models/blog');

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

const allBlogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => blog.toJSON()); // out JSON transform
};

const nonExisitngValidId = async () => {
  const dummyBlog = new Blog({
    title: 'This will soon be deleted',
    author: 'xxx',
    url: 'xxxxx',
    likes: 7,
  });
  await dummyBlog.save();
  await dummyBlog.deleteOne();

  return dummyBlog._id.toString();
};

module.exports = { initialBlogs, allBlogsInDb, nonExisitngValidId };
