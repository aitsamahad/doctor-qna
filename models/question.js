const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Question = sequelize.define("question", {
  patient_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  question: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  question_desc: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  specialization_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  critical_status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  answered: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Question;
