const Models = require("../models");
const sequelize = require("../db_config/sequelize");
const { UPLOAD_PATIENT_PROFILE_PIC } = require("../handlers/upload");
const formidable = require("formidable");
const { isArray } = require("util");

module.exports = {
  getPatientById: async (req, res, next, id) => {
    // const user = await Models.Patient.findByPk(id);
    const user = await Models.Patient.findOne({
      // attributes: ["*", sequelize.fn("COUNT", sequelize.col("Questions.id"))],
      where: { p_id: id },
      include: [
        {
          model: Models.PATIENT_PROFILE,
        },
      ],
    });

    const categories = await Models.Specialization.findAll({
      include: [
        {
          model: Models.Question,
          attributes: ["id"],
          where: [
            {
              patient_id: id,
            },
            // { "$questions.specialization_id$": "$specializations.id$" },
          ],
        },
      ],
      attributes: ["id"],
      required: true,
    });
    if (!user)
      return res.status(400).json({
        error: "No User found",
      });
    req.patient = user;
    req.patient.categories = categories;
    next();
  },

  getPatient: async (req, res) => {
    const reConstructCategories = [];
    req.patient.categories.map((category) =>
      reConstructCategories.push({
        id: category.id,
        count: category.questions.length,
      })
    );
    return res.json({
      patient: req.patient,
      categories: reConstructCategories,
    });
  },
  reportDoctor: async (req, res) => {
    const { patient_id, doctor_id, question_id, answer_id } = req.body;
    const report = await Models.DOCTOR_REPORT.create({
      patient_id,
      doctor_id,
      question_id,
      answer_id,
    });
    if (report) return res.json({ error: false, message: "Doctor reported!" });
    return res.json({ error: true, message: "Not Reported, check logs!" });
  },

  clearPatients: async (req, res) => {
    await Models.Patient.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });
    res.json({ message: "Patient's table has been cleared!" });
  },

  getPatientQuestions: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit + 1 - 1;

    const questions = await Models.Question.findAndCountAll({
      where: { patient_id: req.patient.p_id },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
      attributes: [
        "id",
        "question",
        "question_desc",
        "specialization_id",
        "critical_status",
        "createdAt",
      ],
    });

    const { count, rows } = questions;

    const pages = Math.ceil(parseInt(count) / limit);

    let next = page < pages ? true : false;

    res.json({ count: count, pages, next, questions: rows });
  },

  updatePatient: async (req, res) => {
    // De-structuring information from the req
    const { f_name, l_name, age, weight, height } = req.body;

    await Models.Patient.findOne({
      where: { p_id: req.patient.p_id },
      attributes: [
        "p_id",
        "email",
        "f_name",
        "l_name",
        "gender",
        "age",
        "weight",
        "height",
        "updatedAt",
      ],
    })
      .then(async (result) => {
        const updated = await result.update({
          f_name,
          l_name,
          age,
          weight,
          height,
        });
        res.json({ updated: true });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ updated: false, message: "Not able to update!" });
      });
  },

  updatePatientFCM: async (req, res) => {
    const { fcm_token } = req.body;

    const patient = await Models.Patient.findOne({
      where: { p_id: req.patient.p_id },
    });

    if (!patient)
      return res
        .status(400)
        .json({ updated: false, message: "Not able to update FCM!" });

    await patient.update({
      fcm_token: fcm_token,
    });

    return res.json({
      updated: true,
      message: "FCM Updated!",
    });
  },

  patientLogin: async (req, res) => {
    const patient = await Models.Patient.findOne({
      where: { p_id: req.patient.p_id },
    });

    if (!patient)
      return res
        .status(400)
        .json({ error: true, message: "Patient not found" });

    await patient.update({
      isSignedIn: true,
    });

    res.json({ error: false, message: "Patient Login successful!" });
  },

  patientLogout: async (req, res) => {
    const patient = await Models.Patient.findOne({
      where: { p_id: req.patient.p_id },
    });

    if (!patient)
      return res
        .status(400)
        .json({ error: true, message: "Patient not found" });

    await patient.update({
      isSignedIn: false,
    });

    res.json({ error: false, message: "Patient Log out successfully!" });
  },
  addPatientProfileImage: async (req, res) => {
    let form = new formidable.IncomingForm({ multiples: true });
    form.keepExtensions = true;

    await form.parse(req, (err, fields, { uploads }) => {
      (async function () {
        // Checking if there are images in the fields and uploading them
        if (isArray(uploads)) {
          uploads.map((file) => UPLOAD_PATIENT_PROFILE_PIC(file, fields.p_id));
        } else if (uploads) {
          UPLOAD_PATIENT_PROFILE_PIC(uploads, fields.p_id);
        }

        if (err)
          return res.status(400).json({
            error: true,
            message: "Masla yeh hai!, " + err,
          });

        return res.status(201).json({
          error: false,
          message: "Profile picture uploaded successfully!",
        });
      })();
    });
  },
};
