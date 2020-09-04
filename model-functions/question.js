const Models = require("../models");
const handlers = require("../handlers/auth.js");
const { UPLOAD_PATIENT_DOCS } = require("../handlers/upload");
const { isArray } = require("util");

module.exports = {
  postQuestion: async (req, err, fields, uploads) => {
    const Question = Models.Question;

    // IF there are error from the form
    if (err)
      return {
        error: true,
        message: err,
        newQuestion: false,
      };

    // Checking if there is an error in request
    const errors = handlers.errorHandler(req);
    if (!errors.isEmpty()) {
      return {
        error: true,
        message: errors,
        newQuestion: false,
      };
    }

    // De-structuring information from the fields
    const {
      patient_id,
      question,
      question_desc,
      specialization_id,
      critical_status,
    } = fields;

    // Signing up the doctor
    const newQuestion = await Question.create({
      patient_id,
      question,
      question_desc,
      specialization_id: parseInt(specialization_id),
      critical_status,
    });

    if (!newQuestion) {
      return {
        error: true,
        message: "Unable to post the question!",
        newQuestion: false,
      };
    } else {
      // Incrementing the total question asked in profile
      const stats = await Models.Patient.findByPk(patient_id);
      await stats.update({
        questions_asked: stats.questions_asked + 1,
      });

      // Checking if there are images in the fields and uploading them
      if (isArray(uploads)) {
        uploads.map(file =>
          UPLOAD_PATIENT_DOCS(file, patient_id, newQuestion.id)
        );
      } else if (uploads.type != null) {
        UPLOAD_PATIENT_DOCS(uploads, patient_id, newQuestion.id);
      }
    }

    return {
      error: false,
      message: "Question Posted up successfully!",
      newQuestion: newQuestion,
    };
  },
};
