const pool = require('../config/connection.js'); // Postgres database connection

class Role { // Class constructor for Role table entries
  constructor(role1, role2, role3) {
    pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [role1, role2, role3],
       function (err, { rows }) {
      console.log(rows);
      });
    };
  };

module.exports = Role;