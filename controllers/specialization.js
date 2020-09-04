const Models = require("../models");

module.exports = {
  addSpecialization: async (req, res) => {
    const specialization = await Models.Specialization.create({
      title: req.body.title,
    });
    if (!specialization)
      return res.status(201).json({ error: "Not able to save!" });
    res.json({ message: `${req.body.title} has been saved successfully!` });
  },
};
