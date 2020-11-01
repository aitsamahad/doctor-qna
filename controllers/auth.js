const Models = require("../models");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");
const handlers = require("../handlers/auth.js");
const { doctorSignup } = require("../model-functions/doctor");
const { patientSignup } = require("../model-functions/patient");

// Secret key
const SECRET = process.env.SECRET;

module.exports = {
  // Doctor Registration
  Doctor_Signup: async (req, res) => {
    let form = new formidable.IncomingForm({ multiples: true });
    form.keepExtensions = true;

    await form.parse(req, (err, fields, { uploads }) => {
      (async function () {
        const doctor = await doctorSignup(req, err, fields, uploads);
        if (doctor.error)
          return res
            .status(201)
            .json({ error: true, message: doctor.message, newUser: false });
        const token = await jwt.sign(
          {
            user: doctor.newUser,
          },
          SECRET,
          // this token will last for a year, but you can change it
          { expiresIn: "1y" }
        );

        res.json({
          name: doctor.newUser.f_name + " " + doctor.newUser.l_name,
          email: doctor.newUser.email,
          id: doctor.newUser.d_id,
          token,
        });
      })();
    });
  },

  //   Doctor Login and return Token
  Doctor_Login: async (req, res) => {
    const Doctor = Models.Doctor;

    // check if the user exists
    const user = await Doctor.findByPk(req.body.d_id);

    // Set User signedIn false if he is signed in as Patient already
    const patient = await Models.Patient.findByPk(req.body.d_id);

    await patient.update({
      isSignedIn: 0,
    });

    await user.update({
      isSignedIn: 1,
    });

    if (user) {
      // if the user exist then create a token for them
      const token = await jwt.sign(
        {
          user: user,
        },
        SECRET,
        // this token will last for a year, but you can change it
        { expiresIn: "1y" }
      );
      res.json({ token });
    } else {
      res.status(404).json({ error: "No user found " });
    }
  },

  // Patient Registration
  Patient_Signup: async (req, res) => {
    const patient = await patientSignup(req);

    if (patient.error)
      return res
        .status(201)
        .json({ error: true, message: patient.message, newUser: false });

    const token = await jwt.sign(
      {
        user: patient.newUser,
      },
      SECRET,
      // this token will last for a year, but you can change it
      { expiresIn: "1y" }
    );

    res.json({
      name: patient.newUser.f_name + " " + patient.newUser.l_name,
      email: patient.newUser.email,
      id: patient.newUser.p_id,
      token,
    });
  },

  //   Patient Login and return Token
  Patient_Login: async (req, res) => {
    const Patient = Models.Patient;

    // Set User signedIn false if he is signed in as Doctor already
    const doctor = await Models.Doctor.findByPk(req.body.p_id);

    await doctor.update({
      isSignedIn: 0,
    });

    // check if the user exists
    const user = await Patient.findByPk(req.body.p_id);

    await user.update({
      isSignedIn: 1,
    });

    if (user) {
      // if the user exist then create a token for them
      const token = await jwt.sign(
        {
          user: user,
        },
        SECRET,
        // this token will last for a year, but you can change it
        { expiresIn: "1y" }
      );
      res.json({ token });
    } else {
      res.status(404).json({ error: "No user found " });
    }
  },
};
