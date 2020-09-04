const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const ToBeAnswered = sequelize.define("tobeanswered", {
  patient_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  doctor_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  specialization_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = ToBeAnswered;
