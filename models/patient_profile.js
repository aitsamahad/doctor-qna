const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Patient_Profile = sequelize.define(
  "patient_profile",
  {
    p_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mimetype: {
      type: Sequelize.STRING,
      allowNull: false,
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

module.exports = Patient_Profile;
