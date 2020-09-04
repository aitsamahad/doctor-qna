const Models = require("../models");
const handlers = require("../handlers/auth.js");

module.exports = {
  patientSignup: async req => {
    const Patient = Models.Patient;

    // Checking if there is an error in request
    const errors = handlers.errorHandler(req);
    if (!errors.isEmpty()) {
      return {
        error: true,
        message: errors,
        newUser: false,
      };
    }

    // De-structuring information from the req
    const {
      p_id,
      email,
      f_name,
      l_name,
      age,
      weight,
      height,
      gender,
    } = req.body;

    // Checking if user already exists
    const userExists = await Patient.findOne({ where: { p_id: p_id } });
    if (userExists) {
      return {
        error: true,
        message: "User already exists",
        newUser: false,
      };
    }

    // Signing up the Patient
    const newUser = await Patient.create({
      p_id,
      email,
      f_name,
      l_name,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      gender,
    });

    if (!newUser) {
      return {
        error: true,
        message: "Unable to save the patient!",
        newUser: false,
      };
    }

    return {
      error: false,
      message: "Patient signed up successfully!",
      newUser: newUser,
    };
  },
};
