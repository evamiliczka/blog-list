require('express-async-errors');

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { info, error } = require('../utils/logger');

const usersRouter = express.Router();



usersRouter.get('/', async (request, response) => {
    const allUsers = await User.find({});
    response.json(allUsers);
})

usersRouter.post('/', async (request, response) => {
    info('Request body ', request.body);
    const { name, username, password } = request.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ name, username, passwordHash })
    info('This is my new user created with hashed password ', newUser);

    const savedUser = await newUser.save();
    info('This is my saved user ', savedUser);
    response.status(201).json(savedUser);
}
)

module.exports = usersRouter;
