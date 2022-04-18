const scoresRouter = require("express").Router();
const Score = require("../models/score");

scoresRouter.get("/users/:user/themes/:theme", (req, res) => {
  const userId = parseInt(req.params.user);
  const themeId = parseInt(req.params.theme);

  Score.findAllMovieWithScoreFoundOfUserByTheme(userId, themeId)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send("Error retrieving movies and the scores from database");
    });
});

module.exports = scoresRouter;
