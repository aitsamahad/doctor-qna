const Sequelize = require("sequelize")
var pg = require("pg")
pg.defaults.ssl = true

//creating an instance            // Database, User, Pass
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: `${process.env.DB_HOST}`,
    ssl: true,
    pool: {
      max: 9,
      min: 0,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    port: `${process.env.DB_PORT}`,
  }
)

module.exports = sequelize
