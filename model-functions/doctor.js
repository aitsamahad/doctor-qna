const Models = require("../models");
const handlers = require("../handlers/auth.js");
const { UPLOAD_DOCTOR_ID } = require("../handlers/upload");
const { isArray } = require("util");

module.exports = {
  doctorSignup: async (req, err, fields, uploads) => {
    const Doctor = Models.Doctor;

    // IF there are error from the form
    if (err)
      return {
        error: true,
        message: err,
        newUser: false,
      };

    // Checking if there is an error in request
    const errors = handlers.errorHandler(req);
    if (!errors.isEmpty()) {
      return {
        error: true,
        message: errors,
        newUser: false,
      };
    }

    // De-structuring information from the fields
    const { d_id, email, f_name, l_name, country, gender } = fields;
    const pmdc_id = fields.pmdc_id || "0";
    const phone = fields.phone || "0";
    const fcm_token = fields.fcm_token || "none";
    const qualifications = fields.qualifications || "none";
    const specializations = fields.specializations || "none";

    // Checking if user already exists
    const userExists = await Doctor.findOne({ where: { d_id: d_id } });
    if (userExists)
      return {
        error: true,
        message: "User already exists",
        newUser: false,
      };

    // Checking if there are images in the fields and uploading them
    if (uploads != null) {
      if (isArray(uploads)) {
        uploads.map(file => UPLOAD_DOCTOR_ID(file, d_id));
      } else {
        UPLOAD_DOCTOR_ID(uploads, d_id);
      }
    }

    // Signing up the doctor
    const newUser = await Doctor.create({
      d_id,
      email,
      f_name,
      l_name,
      gender,
      country,
      pmdc_id,
      phone,
      fcm_token,
      qualifications,
      specializations,
    });

    if (!newUser) {
      return {
        error: true,
        message: "Unable to save the doctor!",
        newUser: false,
      };
    }

    return {
      error: false,
      message: "Doctor signed up successfully!",
      newUser: newUser,
    };
  },
};
