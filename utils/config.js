/* Handling of environment variables */
/* The environment variables from the ".env" file are available globally,
 before the code from the other modules is imported. */
require("dotenv").config();

const { info } = require("./logger");

const { PORT, MONGODB_URI } = process.env;

info(`Port is ${PORT}, URL is ${MONGODB_URI}`);

module.exports = {
  PORT,
  MONGODB_URI,
};
