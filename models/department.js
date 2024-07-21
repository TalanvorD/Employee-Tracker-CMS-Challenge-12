const pool = require('../config/connection.js'); // Postgres database connection

class Department { // Class constructor for Department table entries
  constructor(newDepartment) {
    pool.query(`INSERT INTO department (name) VALUES ($1)`, [newDepartment],
       function (err, { rows }) {
      console.log(rows);
      });
    };
  };

module.exports = Department;