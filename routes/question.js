const router = require("express-promise-router")();
const {
  addQuestion,
  getQuestionById,
  getQuestion,
} = require("../controllers/question");
const { getPatientById } = require("../controllers/patient");

// Calling middlewares to get param of patientId, questionId automatically for futher routes along the line
router.param("patientId", getPatientById);
router.param("questionId", getQuestionById);

// @POST Post Question by Patient
router.route("/create").post(addQuestion);

// @GET Question By Id
router.route("/:questionId").get(getQuestion);

module.exports = router;
