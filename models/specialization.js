const Sequelize = require("sequelize");

const sequelize = require("../db_config/sequelize");

const Specialization = sequelize.define(
  "specialization",
  {
    title: {
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

module.exports = Specialization;
