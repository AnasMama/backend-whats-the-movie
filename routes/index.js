const usersRouter = require('./users');
const authRouter = require('./auth');
const themesRouter = require('./users');

const setupRoutes = (app) => {
  app.use('/api/users', usersRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/themes', themesRouter);
};

module.exports = {
  setupRoutes,
};