const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Answer = sequelize.define("answer", {
  patient_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  question: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  specialization_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  doctor_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  answer: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Answer;
