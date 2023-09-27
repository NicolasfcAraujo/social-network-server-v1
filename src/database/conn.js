const mysql = require("mysql2")
const dotenv = require("dotenv")

dotenv.config()

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

const connection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
}).promise()

module.exports = connection