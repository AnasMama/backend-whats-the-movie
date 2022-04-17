const moviesRouter = require("express").Router();
const Movie = require("../models/movie");

moviesRouter.get("/", (req, res) => {
  Movie.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving movies from database");
    });
});

moviesRouter.get("/:id", (req, res) => {
  Movie.findOne(req.params.id)
    .then((movie) => {
      if (movie) res.json(movie).status(201);
      else res.status(404).send("Movie not found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving Movie from database");
    });
});



moviesRouter.put("/:id", (req, res) => {
  const movieId = req.params.id;
  let existingMovie = null;
  Promise.all([
    Movie.findOne(movieId),
    Movie.findByMdbWithDifferentId(req.body.mdb_identification, movieId),
    Movie.findByNameWithDifferentId(req.body.french_name, movieId),
  ])
    .then(([movie, otherMovieWithMdb, otherMovieWithName]) => {
      existingMovie = movie;
      if (!existingMovie) return Promise.reject("RECORD_NOT_FOUND");
      if (otherMovieWithMdb) return Promise.reject("Another movie has this mdb identification");
      if (otherMovieWithName) return Promise.reject("Another movie has this name");
      return Movie.update(movieId, req.body);
    })
    .then(() => {
      res.status(200).json({ ...existingMovie, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === "RECORD_NOT_FOUND")
        res.status(404).send(`Movie with id ${movieId} not found.`);
      else res.status(500).send("Error updating a movie.");
    });
});

moviesRouter.delete("/:id", (req, res) => {
  Movie.destroy(req.params.id)
    .then((deleted) => {
      if (deleted) res.status(200).send("🎉 Movie deleted!");
      else res.status(404).send("Movie not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting a movie");
    });
});

module.exports = moviesRouter;
