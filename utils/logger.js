/* Print info and errors only NOT in PRODUCTION mode */

const info = (...params) => {
  if (process.env !== 'production') console.log(...params);
};

const error = (...params) => {
  if (process.env !== 'production') console.error(...params);
};




module.exports = {
  info,
  error,
};
