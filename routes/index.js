const userRouter = require('./users');

const setupRoutes = (app) => {
  app.use('/api/users', userRouter);
};

module.exports = {
  setupRoutes,
};