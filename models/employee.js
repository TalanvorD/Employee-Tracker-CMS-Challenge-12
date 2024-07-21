const pool = require('../config/connection.js'); // Postgres database connection

class Employee { // Class constructor for Department table entries
  constructor(newEmployee) {
    pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, NULL)`, [newEmployee],
       function (err, { rows }) {
      console.log(rows);
      });
    };
  };

module.exports = Employee;