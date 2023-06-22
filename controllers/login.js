/* eslint-disable no-underscore-dangle */
require('express-async-errors');

const loginRouter = require('express').Router();


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

// const { info } = require('../utils/logger');

const isPasswordCorrect = async (user, password) => {
    if ( user === null ) return false;
    if ( await bcrypt.compare(password, user.passwordHash )) return true;
    //  if  (( user !== null ) && (! await bcrypt.compare(password, user.passwordHash)) 
    return false;
}

loginRouter.get('/', async (request,response) => {
    response.json('Hi there');
})

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;
    const user = await User.findOne({username});

    if (await isPasswordCorrect(user, password)){
        const userForToken =  {
            username: user.username,
            id: user._id
        }
        const token = jwt.sign(userForToken, process.env.SECRET);
        return response.status(200).send({ token, username: user.username, name: user.name});
    } // else
    return response.status(401).json({ error: 'invalid username or password '});
})

module.exports = loginRouter;

