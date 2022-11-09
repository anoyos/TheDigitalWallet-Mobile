// const config = require('../config.js')
const dbConnection = {
  host: "database-1.cl8jcz3tpxxa.eu-west-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "lolG32327",
  database: "digitall",
};
const knex = require("knex")({
  client: "mysql2",
  connection: dbConnection,
});

module.exports = knex;
