const Joi = require("joi");
const connection = require("../db-config");
const db = connection.promise();

const findMany = ({ filters: { theme_id, level } }) => {
  let sql = "SELECT * FROM movie";
  let sqlValues = [];
  if (theme_id) {
    sql += " WHERE theme_id = ?";
    sqlValues.push(theme_id);
  }
  if (level) {
    if (theme_id) sql += " AND level = ? ;";
    else sql += " WHERE level = ?";
    sqlValues.push(level);
  }
  return db.query(sql, sqlValues).then(([results]) => results);
};

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    mdb_identification: Joi.number().presence(presence),
    icon: Joi.string().max(255).allow(null, ""),
    french_name: Joi.string().max(45).presence(presence),
    level: Joi.number().min(1).max(5).presence(presence),
    theme_id: Joi.number().presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findAll = () => {
  return db.query("SELECT * FROM movie").then(([results]) => results);
};

const findAllId = () => {
  return db.query("SELECT id FROM movie").then(([results]) => results.map(movie => movie.id));
};

const findOne = (id) => {
  return db
    .query("SELECT * FROM movie WHERE id = ?", [id])
    .then(([results]) => results[0]);
};

const findByMdbId = (mdb_identification) => {
  return db
    .query("SELECT * FROM movie WHERE mdb_identification = ?", [mdb_identification])
    .then(([results]) => results[0]);
};

const findByName = (french_name) => {
  return db
    .query("SELECT * FROM movie WHERE french_name = ?", [french_name])
    .then(([results]) => results[0]);
};


const findByMdbWithDifferentId = (mdb_identification, id) => {
  return db
    .query("SELECT * FROM movie WHERE name = ? AND id <> ?", [mdb_identification, id])
    .then(([results]) => results[0]);
};

const findByNameWithDifferentId = (french_name, id) => {
  return db
    .query("SELECT * FROM movie WHERE french_name = ? AND id <> ?", [french_name, id])
    .then(([results]) => results[0]);
};

const create = ({ mdb_identification, icon, french_name, level, theme_id }) => {
  return db
    .query(
      "INSERT INTO movie (mdb_identification, icon, french_name, level, theme_id) VALUES (?,?,?,?,?)",
      [mdb_identification, icon, french_name, level, theme_id]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { mdb_identification, icon, french_name, level, theme_id };
    });
};

const update = (id, newAttributes) => {
  return db.query("UPDATE movie SET ? WHERE id = ?", [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query("DELETE FROM movie WHERE id = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findOne,
  findMany,
  findAll,
  findAllId,
  findByMdbId,
  findByName,
  findByMdbWithDifferentId,
  findByNameWithDifferentId,
  create,
  update,
  destroy,
  validate,
};
