const authRouter = require("express").Router();
const User = require("../models/user");
const { generateToken } = require("../services/auth");
// const { calculateToken } = require("../helpers/users");

// authRouter.post("/checkCredentials", (req, res) => {
//   const { login, password } = req.body;
//   User.findByLogin(login).then((user) => {
//     if (!user) res.status(401).send("Invalid credentials");
//     else {
//       User.verifyPassword(password, user.hashedPassword)
//       .then((passwordIsCorrect) => {
//           if (passwordIsCorrect) {
//             const token = calculateToken(login);
//             User.update(user.id, { token: token });
//             res.cookie("user_token", token);
//             res.send();
//           } else res.status(401).send("Invalid credentials");
//         }
//       );
//     }
//   });
// });

authRouter.post('/login', (req, res) => {
  const { login, password } = req.body;
  let token = null;
  User.findByLogin(login).then((user) => {
    token = generateToken(user);
    User.verifyPassword(password, user.password)
    .then((passwordIsCorrect) => {
      if (!passwordIsCorrect) res.status(401).send("Invalid credentials");
      else res.cookie('access-token', token).status(201).send("Welcome !");
    });
  });
});

module.exports = authRouter;
