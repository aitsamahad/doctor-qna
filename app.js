const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const sequelize = require("./db_config/sequelize");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mkdirp = require("mkdirp");

// API Authorization Middlewares
const { authGuard } = require("./apiAuth/authGuard");

// Importing Routes Files
const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctor");
const patientRoutes = require("./routes/patient");
const specializationRoutes = require("./routes/specialization");
const questionRoutes = require("./routes/question");
const answerRoutes = require("./routes/answer");

// Ensure upload directory exists.
const UPLOAD_DIR = "./uploads";
mkdirp.sync(UPLOAD_DIR);

const app = express();

// Essential Middlewares Setup
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes Section
app.use("/api/auth", authRoutes);
app.use("/api/doctor", authGuard, doctorRoutes);
app.use("/api/patient", authGuard, patientRoutes);
app.use("/api/specialization", authGuard, specializationRoutes);
app.use("/api/question", authGuard, questionRoutes);
app.use("/api/answer", authGuard, answerRoutes);
// app.use(authGuard);

// Error Handlers
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500; // 500 is server error

  // Respond to client
  res.status(status).json({
    error: {
      message: error.message,
    },
  });
  // Respond to terminal
  console.error(err);
});

const port = process.env.PORT || 4000;

// Setting up SEQUELIZE Relations
const Question = require("./models/question");
const Patient = require("./models/patient");
const PATIENT_UPLOAD = require("./models/patient_upload");
const Doctor = require("./models/doctor");
const ID_UPLOAD = require("./models/id_upload");
const ToBeAnswered = require("./models/tobeanswered");
const Answer = require("./models/answer");
const Specialization = require("./models/specialization");

// Patients have many question and a Question belongs to a Patient
Question.belongsTo(Patient, { foreignKey: "patient_id" });
Patient.hasMany(Question, {
  // as: "questions",
  foreignKey: "patient_id",
});
Patient.hasMany(Answer, {
  // as: "patient_answers_list",
  foreignKey: "patient_id",
});
Patient.hasMany(ToBeAnswered, {
  // as: "patient_queries_notifications_list",
  foreignKey: "patient_id",
});

// Doctors have many tobeanswered and Answer belongs to Doctor
Answer.belongsTo(Doctor, { foreignKey: "doctor_id" });
ToBeAnswered.belongsTo(Doctor, { foreignKey: "doctor_id" });
Doctor.hasMany(ToBeAnswered, {
  // as: "doctor_notifications_list",
  foreignKey: "doctor_id",
});
Doctor.hasMany(Answer, {
  // as: "doctor_answers_list",
  foreignKey: "doctor_id",
});

// Question has many uplaods and a upload belongs to a Question
PATIENT_UPLOAD.belongsTo(Question, { foreignKey: "question_id" });
Question.hasMany(PATIENT_UPLOAD, {
  // as: "refDocs",
  foreignKey: "question_id",
});
ToBeAnswered.belongsTo(Question, { foreignKey: "question_id" });
Question.hasMany(ToBeAnswered, { foreignKey: "question_id" });

// Doctor has many ID's and ID belongs to a doctor
ID_UPLOAD.belongsTo(Doctor, { foreignKey: "d_id" });
Doctor.hasMany(ID_UPLOAD, {
  // as: "ids",
  foreignKey: "d_id",
});

// Specialization Relations
Answer.belongsTo(Specialization, { foreignKey: "specialization_id" });
Question.belongsTo(Specialization, { foreignKey: "specialization_id" });
Specialization.hasMany(Answer, {
  // as: "totalAnswers",
  foreignKey: "specialization_id",
});
Specialization.hasMany(Question, {
  // as: "totalQuestions",
  foreignKey: "specialization_id",
});
ToBeAnswered.belongsTo(Specialization, { foreignKey: "specialization_id" });
Specialization.hasMany(ToBeAnswered, { foreignKey: "specialization_id" });

// Answer relationship
Answer.belongsTo(Question, {
  foreignKey: "question_id",
  as: "totalAnswers",
  onDelete: "CASCADE",
});
Question.hasMany(Answer, { foreignKey: "question_id" });

(async function () {
  const syncDB = await sequelize.sync();
  app.listen(port);
})();
