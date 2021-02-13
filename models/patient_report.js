const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Patient_Report = sequelize.define("patient_report", {
  doctor_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  patient_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  answer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Patient_Report;
