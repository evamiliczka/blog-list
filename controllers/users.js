require('express-async-errors');

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { info } = require('../utils/logger');

const usersRouter = express.Router();



usersRouter.get('/', async (request, response) => {
    const allUsers = await User.find({});
    response.json(allUsers);
})

usersRouter.post('/', async (request, response) => {
    info('Request body ', request.body);
    const { name, username, password } = request.body;
    // password must be chceked before Sent to MongoDB, as it is send hashed!!!
    if (!password) {
        return response.status(400).json({ error: 'password missing' })
    }
    if (password.length < 3)
       return response.status(400).json({ error: 'password must be at least 3 chars long' }) 


    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ name, username, passwordHash })
    info('This is my new user created with hashed password ', newUser);

    const savedUser = await newUser.save();
    info('This is my saved user ', savedUser);
    return response.status(201).json(savedUser);
}
)

module.exports = usersRouter;
