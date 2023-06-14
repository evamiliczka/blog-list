const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const { MONGODB_URI } = require('./utils/config');

const app = express();
const blogsRouter = require('./controllers/blogs');

const { info, error} = require('./utils/logger'); // error not in use

mongoose.set('strictQuery', false);

info('Connecting to ', MONGODB_URI);

mongoose
    .connect(MONGODB_URI)
    .then(() => {     // replaced result by ()
        info('Connected to MongoDB');
    })
    .catch((err) => {
        error('Error connecting to MongoDB: ', err.message);
    });


app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);


module.exports = app;
