const usersRouter = require("express").Router();
const User = require("../models/user");

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
  Promise.all([
    User.findByLogin(login),
    User.findByEmail(email),
    User.validate(req.body),
  ])
    .then(([existingLogin, existingEmail, validationErrors]) => {
      if (existingLogin) return Promise.reject("Already an user with this login");
      if (existingEmail) return Promise.reject("Already an user with this email");
      if (validationErrors) return Promise.reject("Invalid data");
      return User.create(req.body);
    })
    .then((newUser) => {
      console.log(newUser);
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
  User.destroy(req.params.id)
    .then((deleted) => {
      if (deleted) res.status(200).send("🎉 User deleted!");
      else res.status(404).send("User not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting a user");
    });
});

module.exports = usersRouter;
