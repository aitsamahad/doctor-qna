const Sequelize = require("sequelize")

//creating an instance            // Database, User, Pass
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: `${process.env.DB_HOST}`,
    pool: {
      max: 9,
      min: 0,
      idle: 10000,
    },
    port: `${process.env.DB_PORT}`,
  }
)

module.exports = sequelize
