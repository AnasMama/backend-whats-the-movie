const scoresRouter = require("express").Router();
const Score = require("../models/score");

scoresRouter.get("/users/:user/themes/:theme/", (req, res) => {
  const userId = parseInt(req.params.user);
  const themeId = parseInt(req.params.theme);
  const level = parseInt(req.query.level);

  Score.findAllMovieWithScoreFoundOfUserByTheme({filters: userId, themeId, level })
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

scoresRouter.put("/movies/:movie/users/:user", (req,res) => {
    const movieId = req.params.movie;
    const userId = req.params.user;
    let scoreId = null;
    let existingScore = null;
    Promise.all([
        Score.findOneWithMovieAndUser(movieId, userId),
        Score.validate(req.body)
    ])
    .then((score) => {
        existingScore = score;
        scoreId = score.id;
        if (!existingScore) return Promise.reject("RECORD_NOT_FOUND");
        return Score.update(scoreId, req.body)
    })
    .then(() => {
        res.status(200).json({ ...existingScore, ...req.body });
      })
      .catch((err) => {
        console.error(err);
        if (err === "RECORD_NOT_FOUND")
          res.status(404).send(`Score not found.`);
        else res.status(500).send("Error updating a score.");
      });
});

module.exports = scoresRouter;
