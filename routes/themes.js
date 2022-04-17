const themesRouter = require("express").Router();
const Theme = require("../models/theme");

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
  Promise.all([
    Theme.findByName(login),
    Theme.validate(req.body),
  ])
    .then(([existingName, validationErrors]) => {
      if (existingName) return Promise.reject("Already an theme with this name");
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
    Theme.findByNameWithDifferentId(req.body.login, themeId),
  ])
    .then(([theme, otherThemeWithName]) => {
      existingTheme = theme;
      if (!existingTheme) return Promise.reject("RECORD_NOT_FOUND");
      if (otherThemeWithName) return Promise.reject("Another theme has this login");
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

module.exports = themesRouter;
