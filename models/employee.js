const pool = require('../config/connection.js'); // Postgres database connection

class Employee { // Class constructor for Department table entries
  constructor(e1, e2, e3, e4) {
    if (e4 !== 0){
      pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [e1, e2, e3, e4],
        function (err, { rows }) {
        console.log(rows);
        });
    } else {
      pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, NULL)`, [e1, e2, e3],
        function (err, { rows }) {
        console.log(rows);
        });
    };
  };
};

module.exports = Employee;