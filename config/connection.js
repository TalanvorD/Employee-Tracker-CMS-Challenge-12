const { Pool } = require('pg');  // Importing Postgres
require('dotenv').config(); // Using dotenv to hide variables

// Connect to the company database
const pool = new Pool(
    {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: 'localhost',
      database: process.env.DB_NAME
  },
  console.log(`Connected to the ${process.env.DB_NAME} database!`)
  )

  module.exports = pool;