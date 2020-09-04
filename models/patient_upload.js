const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const PATIENT_UPLOAD = sequelize.define(
  "patient_upload",
  {
    p_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    question_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mimetype: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }
  // {
  //   tableName: "questions",
  //   hooks: {
  //     beforeCreate: (record, options) => {
  //       record.dataValues.createdAt = Math.floor(Date.now() / 1000);
  //       record.dataValues.updatedAt = Math.floor(Date.now() / 1000);
  //     },
  //     beforeUpdate: (record, options) => {
  //       record.dataValues.updatedAt = Math.floor(Date.now() / 1000);
  //     }
  //   }
  // }
);

module.exports = PATIENT_UPLOAD;
