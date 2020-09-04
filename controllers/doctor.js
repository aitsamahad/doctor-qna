const Models = require("../models");

module.exports = {
  clearDoctors: async (req, res) => {
    await Models.Doctor.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });
    res.json({ message: "Doctor's table has been cleared!" });
  },
};
