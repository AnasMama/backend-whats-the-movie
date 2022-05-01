const usersRouter = require('./users');
const authRouter = require('./auth');
const themesRouter = require('./themes');
const moviesRouter = require('./movies');
const scoresRouter = require('./scores');

const setupRoutes = (app) => {
  app.use('/api/users', usersRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/themes', themesRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/scores', scoresRouter);
};

module.exports = {
  setupRoutes,
};