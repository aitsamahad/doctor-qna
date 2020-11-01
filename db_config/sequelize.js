const Sequelize = require("sequelize");

//creating an instance            // Database, User, Pass
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    pool: {
      max: 9,
      min: 0,
      idle: 10000,
    },
    port: 8889,
  }
);

module.exports = sequelize;
