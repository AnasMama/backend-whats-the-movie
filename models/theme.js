const Joi = require("joi");
const connection = require("../db-config");
const db = connection.promise();

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    name: Joi.string().max(45).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findAll = () => {
  return db.query("SELECT * FROM theme").then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query("SELECT * FROM theme WHERE id = ?", [id])
    .then(([results]) => results[0]);
};

const findByName = (name) => {
  return db
    .query("SELECT * FROM theme WHERE name = ?", [name])
    .then(([results]) => results[0]);
};
const findByNameWithDifferentId = (name, id) => {
  return db
    .query("SELECT * FROM theme WHERE name = ? AND id <> ?", [name, id])
    .then(([results]) => results[0]);
};

const create = ({ name }) => {
  return db
    .query(
      "INSERT INTO theme (name) VALUES (?)",
      [name]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { name };
    });
};

const update = (id, newAttributes) => {
  return db.query("UPDATE theme SET ? WHERE id = ?", [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query("DELETE FROM theme WHERE id = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findOne,
  findAll,
  findByName,
  findByNameWithDifferentId,
  create,
  update,
  destroy,
  validate,
};
