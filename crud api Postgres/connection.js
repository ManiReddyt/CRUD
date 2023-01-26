const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "9390348710",
  database: "postgres",
});

module.exports = client;
