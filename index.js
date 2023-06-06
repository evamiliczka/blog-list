const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const { PORT, MONGODB_URI } = require('./utils/config');

const app = express();
const blogsRouter = require('./controllers/blogs');


require ('dotenv').config();
// console.log('Process env: ', process.env);

const { info, error} = require('./utils/logger'); // error not in use

mongoose.connect(MONGODB_URI)
.then(() => {
  // replaced result by ()
  info('Connected to MongoDB');
})
.catch((err) => {
  error('Error connecting to MongoDB: ', err.message);
});;
info('Connecting to ', MONGODB_URI);


app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);


app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});