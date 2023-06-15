const logger = require('./logger');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

/* --------------error  ------------*/
// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  logger.error('Error handler: ', error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
