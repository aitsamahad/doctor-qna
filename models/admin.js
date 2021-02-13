const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Admin = sequelize.define("admin", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Admin;
