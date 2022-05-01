const usersRouter = require("express").Router();
const User = require("../models/user");
const Movie = require("../models/movie");
const Score = require("../models/score");

usersRouter.get("/", (req, res) => {
  const { login, email } = req.query;
  User.findMany({ filters: { login, email } })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving users from database");
    });
});

usersRouter.get("/:id", (req, res) => {
  User.findOne(req.params.id)
    .then((user) => {
      if (user) res.json(user).status(201);
      else res.status(404).send("User not found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving User from database");
    });
});

usersRouter.post("/", (req, res) => {
  const { login, email } = req.body;
  let allIdMovie = [];
  Promise.all([
    User.findByLogin(login),
    User.findByEmail(email),
    User.validate(req.body),
    Movie.findAllId(),
  ])
    .then(([existingLogin, existingEmail, validationErrors, idMovie]) => {
      if (existingLogin) return Promise.reject("Already an user with this login");
      if (existingEmail) return Promise.reject("Already an user with this email");
      if (validationErrors) return Promise.reject("Invalid data");
      allIdMovie = idMovie;
      return User.create(req.body)
    })
    .then((newUser) => {
      User.findByLogin(newUser.login)
      .then(user => Score.createForEveryMovie(user.id, allIdMovie));
      res.status(201).json(newUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
});

usersRouter.put("/:id", (req, res) => {
  const userId = req.params.id;
  let existingUser = null;
  Promise.all([
    User.findOne(userId),
    User.findByLoginWithDifferentId(req.body.login, userId),
    User.findByEmailWithDifferentId(req.body.email, userId),
  ])
    .then(([user, otherUserWithLogin, otherUserWithEmail]) => {
      existingUser = user;
      if (!existingUser) return Promise.reject("RECORD_NOT_FOUND");
      if (otherUserWithLogin) return Promise.reject("Another user has this login");
      if (otherUserWithEmail) return Promise.reject("Another user has this email");
      return User.update(userId, req.body);
    })
    .then(() => {
      res.status(200).json({ ...existingUser, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === "RECORD_NOT_FOUND")
        res.status(404).send(`User with id ${userId} not found.`);
      else res.status(500).send("Error updating a user.");
    });
});

usersRouter.delete("/:id", (req, res) => {
  Score.destroyForEveryMovie(req.params.id)
  .then((scoreDeleted) => {
    if (scoreDeleted) {
      User.destroy(req.params.id)
        .then((deleted) => {
          if (deleted) {
            res.status(200).send("🎉 User deleted!");
          }
          else res.status(404).send("User not found");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Error deleting a user");
        });
    }
    else res.status(404).send("Scores not found");
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error deleting scores of user");
  });
});

module.exports = usersRouter;
