/* Handling of environment variables */
/* The environment variables from the ".env" file are available globally,
 before the code from the other modules is imported. */
require("dotenv").config();

const { info } = require("./logger");

const { PORT } = process.env;
info('This is config, port is ', PORT)

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

info(`Port is ${PORT}, URL is ${MONGODB_URI}`);

module.exports = {
  PORT,
  MONGODB_URI,
};
