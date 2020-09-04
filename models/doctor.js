const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Doctor = sequelize.define(
  "doctor",
  {
    d_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pmdc_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "None",
    },
    f_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    l_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    qualifications: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "none",
    },
    specializations: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "none",
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    d_status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    total_answered: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    fcm_token: {
      type: Sequelize.TEXT,
      defaultValue: 0,
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

module.exports = Doctor;
