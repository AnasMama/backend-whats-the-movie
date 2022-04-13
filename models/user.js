const connection = require('../db-config');
const db = connection.promise();

const findMany = () => {
  const sql = 'SELECT * FROM user';
  const sqlValues = [];
  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query('SELECT * FROM User WHERE id = ?', [id])
    .then(([results]) => results[0]);
};


const create = ({ firstname, lastname, mail, levelUser}) => {
  return db
    .query(
      'INSERT INTO User (firstname, lastname, mail, levelUser) VALUES (?, ?, ?, ?)',
      [firstname, lastname, mail, levelUser]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { firstname, lastname, mail, levelUser};
    });
};

const update = (id, newAttributes) => {
  return db.query('UPDATE User SET ? WHERE id = ?', [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query('DELETE FROM User WHERE id = ?', [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = { findMany, findOne, create, update, destroy };