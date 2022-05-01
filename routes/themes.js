const themesRouter = require("express").Router();
const Theme = require("../models/theme");
const Movie = require("../models/movie");

themesRouter.get("/", (req, res) => {
  Theme.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving themes from database");
    });
});

themesRouter.get("/:id", (req, res) => {
  Theme.findOne(req.params.id)
    .then((theme) => {
      if (theme) res.json(theme).status(201);
      else res.status(404).send("Theme not found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving Theme from database");
    });
});

themesRouter.post("/", (req, res) => {
  const { name } = req.body;
  Promise.all([Theme.findByName(name), Theme.validate(req.body)])
    .then(([existingName, validationErrors]) => {
      if (existingName)
        return Promise.reject("Already an theme with this name");
      if (validationErrors) return Promise.reject("Invalid data");
      return Theme.create(req.body);
    })
    .then((newTheme) => {
      console.log(newTheme);
      res.status(201).json(newTheme);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the theme");
    });
});

themesRouter.put("/:id", (req, res) => {
  const themeId = req.params.id;
  let existingTheme = null;
  Promise.all([
    Theme.findOne(themeId),
    Theme.findByNameWithDifferentId(req.body.name, themeId),
  ])
    .then(([theme, otherThemeWithName]) => {
      existingTheme = theme;
      if (!existingTheme) return Promise.reject("RECORD_NOT_FOUND");
      if (otherThemeWithName)
        return Promise.reject("Another theme has this name");
      return Theme.update(themeId, req.body);
    })
    .then(() => {
      res.status(200).json({ ...existingTheme, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === "RECORD_NOT_FOUND")
        res.status(404).send(`Theme with id ${themeId} not found.`);
      else res.status(500).send("Error updating a theme.");
    });
});

themesRouter.delete("/:id", (req, res) => {
  Theme.destroy(req.params.id)
    .then((deleted) => {
      if (deleted) res.status(200).send("🎉 Theme deleted!");
      else res.status(404).send("Theme not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting a theme");
    });
});

themesRouter.get("/:themeId/movies", (req, res) => {
    console.log(req.params)
  Movie.findMany({
    filters: { theme_id: req.params.themeId, level: req.query.level },
  })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving movies from database");
    });
});

themesRouter.post("/:themeId/movies", (req, res) => {
  const themeId = parseInt(req.params.themeId);
  const { mdb_identification, french_name } = req.body;

  Promise.all([
    Movie.findByMdbId(mdb_identification),
    Movie.findByName(french_name),
    Movie.validate({ ...req.body, theme_id: themeId }),
  ])
    .then(([existingMdb, existingName, validationErrors]) => {
      if (existingMdb)
        return Promise.reject("Already an movie with this mdb identification");
      if (existingName)
        return Promise.reject("Already an movie with this name");
      if (validationErrors) return Promise.reject("Invalid data");
      return Movie.create({ ...req.body, theme_id: themeId });
    })
    .then((newMovie) => {
      console.log(newMovie);
      res.status(201).json(newMovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
});

module.exports = themesRouter;
