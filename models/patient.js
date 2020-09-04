const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Patient = sequelize.define("patient", {
  p_id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  f_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  l_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gender: {
    type: Sequelize.ENUM,
    values: ["Female", "Male", "Other"],
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  height: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  questions_asked: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  answers_received: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  fcm_token: {
    type: Sequelize.TEXT,
    defaultValue: 0,
  },
});

module.exports = Patient;
