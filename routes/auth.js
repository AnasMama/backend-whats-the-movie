const authRouter = require("express").Router();
const User = require("../models/user");
const { generateToken } = require("../services/auth");

authRouter.post("/login", (req, res) => {
  const { login, password } = req.body;
  let token = null;
  User.findByLogin(login).then((user) => {
    if (!user) res.status(401).send("Invalid credentials");
    else {
      token = generateToken(user);
      User.verifyPassword(password, user.password).then((passwordIsCorrect) => {
        if (!passwordIsCorrect) res.status(401).send("Invalid credentials");
        else res.cookie("access-token", token).status(201).send("Welcome !");
      });
    }
  }).catch(err=>{
    console.error(err);
    res.status(500).send("Error to login");
  });
});

module.exports = authRouter;
