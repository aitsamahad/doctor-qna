const Doctor = require("./doctor");
const Patient = require("./patient");
const Question = require("./question");
const Answer = require("./answer");
const Specialization = require("./specialization");
const ToBeAnswered = require("./tobeanswered");
const ID_UPLOAD = require("./id_upload");
const PATIENT_UPLOAD = require("./patient_upload");
const DOCTOR_PROFILE = require("./doctor_profile");
const PATIENT_PROFILE = require("./patient_profile");
const PATIENT_REPORT = require("./patient_report");
const DOCTOR_REPORT = require("./doctor_report");
module.exports = {
  Doctor,
  Patient,
  Question,
  Specialization,
  ID_UPLOAD,
  PATIENT_UPLOAD,
  Answer,
  ToBeAnswered,
  DOCTOR_PROFILE,
  PATIENT_PROFILE,
  PATIENT_REPORT,
  DOCTOR_REPORT,
};
