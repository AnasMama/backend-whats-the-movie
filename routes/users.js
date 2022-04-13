const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', (req, res) => {
  User.findMany()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving users from database');
    });
});

userRouter.get('/:id', (req, res) => {
  User.findOne(req.params.id)
    .then((track) => {
      if (track) res.json(track).status(201);
      else res.status(404).send('User not found');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving User from database');
    });
});

userRouter.post('/', (req, res) => {
  User.create(req.body)
    .then((createdMovie) => {
      res.status(201).json(createdMovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the User');
    });
});

userRouter.put('/:id', (req, res) => {
  let existingUser = null;
  User.findOne(req.params.id)
    .then((track) => {
      existingTrack = track;
      if (!existingUser) return Promise.reject('RECORD_NOT_FOUND');
    })
    .then(() => {
      res.status(204).json({ ...existingUser, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`User with id ${req.params.id} not found.`);
      else res.status(500).send('Error updating a movie.');
    });
});

userRouter.delete('/:id', (req, res) => {
  User.destroy(req.params.id)
    .then((deleted) => {
      if (deleted) res.status(204).send('🎉 User deleted!');
      else res.status(404).send('User not found');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error deleting a User');
    });
});

module.exports = userRouter;