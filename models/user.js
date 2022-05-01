const Joi = require("joi");
const connection = require("../db-config");
const db = connection.promise();
const argon2 = require("argon2");

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    login: Joi.string().max(45).presence(presence),
    password: Joi.string().min(8).max(255).presence(presence),
    email: Joi.string().email().max(255).presence(presence),
    profil_img: Joi.string().allow(null, "").max(255),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = ({ filters: { login, email } }) => {
  let sql = "SELECT * FROM user";
  let sqlValues = [];
  if (login) {
    sql += " WHERE login = ?";
    sqlValues.push(login);
  }
  if (email) {
    if (login) sql += " AND email = ? ;";
    else sql += " WHERE email = ?";

    sqlValues.push(email);
  }
  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query("SELECT * FROM user WHERE id = ?", [id])
    .then(([results]) => results[0]);
};

const findByLogin = (login) => {
  return db
    .query("SELECT * FROM user WHERE login = ?", [login])
    .then(([results]) => results[0]);
};
const findByLoginWithDifferentId = (login, id) => {
  return db
    .query("SELECT * FROM user WHERE login = ? AND id <> ?", [login, id])
    .then(([results]) => results[0]);
};

const findByEmail = (email) => {
  return db
    .query("SELECT * FROM user WHERE email = ?", [email])
    .then(([results]) => results[0]);
};

const findByEmailWithDifferentId = (email, id) => {
  return db
    .query("SELECT * FROM user WHERE email = ? AND id <> ?", [email, id])
    .then(([results]) => results[0]);
};

const create = ({ login, password, email, profil_img }) => {
  return hashPassword(password).then((hashedPassword) => {
    return db
      .query(
        "INSERT INTO user (login, password, email, profil_img) VALUES (?, ?, ?, ?)",
        [login, hashedPassword, email, profil_img]
      )
      .then(([result]) => {
        const id = result.insertId;
        return { login, password, email, profil_img };
      });
  });
};

const update = (id, newAttributes) => {
  return db.query("UPDATE user SET ? WHERE id = ?", [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query("DELETE FROM user WHERE id = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOptions);
};

const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

module.exports = {
  findMany,
  findOne,
  findByLogin,
  findByLoginWithDifferentId,
  findByEmail,
  findByEmailWithDifferentId,
  create,
  update,
  destroy,
  validate,
  verifyPassword
};
