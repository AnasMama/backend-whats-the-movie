const Joi = require("joi");
const connection = require("../db-config");
const db = connection.promise();

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    is_found: Joi.number().min(0).max(1).default(0),
    user_id: Joi.number().presence(presence),
    movie_id: Joi.number().presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findAllScoreOfUser = (user_id) => {
  return db
    .query("SELECT * FROM score WHERE user_id = ?", [user_id])
    .then(([results]) => results);
};

const findAllMovieWithScoreFoundOfUserByTheme = (user_id, theme_id) => {
  return db
    .query(
      "SELECT m.* , s.is_found FROM movie AS m INNER JOIN score AS s ON m.id=s.movie_id WHERE user_id = ? AND m.theme_id = ?",
      [user_id, theme_id]
    )
    .then(([results]) => results);
};

const createForEveryMovie = (user_id, movie_id) => {
  const sql = "INSERT INTO score (user_id, movie_id) VALUES ?";

  const valuesOfMovie = movie_id.map((movieId) => [user_id, movieId]);

  return db.query(sql, [valuesOfMovie]).then(([result]) => {
    return { user_id, movie_id };
  });
};

const update = (id, newAttributes) => {
  return db.query("UPDATE score SET ? WHERE id = ?", [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query("DELETE FROM score WHERE id = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

const destroyForEveryMovie = (user_id) => {
  return db
    .query("DELETE FROM score WHERE user_id = ?", [user_id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findAllScoreOfUser,
  findAllMovieWithScoreFoundOfUserByTheme,
  createForEveryMovie,
  update,
  destroy,
  destroyForEveryMovie,
  validate,
};
