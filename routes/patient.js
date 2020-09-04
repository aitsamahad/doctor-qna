const router = require("express-promise-router")();
const {
  clearPatients,
  getPatientById,
  getPatient,
  getPatientQuestions,
  updatePatient,
} = require("../controllers/patient");

router.param("patientId", getPatientById);

// @POST Patient Table Clear
router.route("/clear").post(clearPatients);

// @GET Patient By Id
router.route("/:patientId").get(getPatient).put(updatePatient);

// @GET Patient Questions [Paginated]
router.route("/:patientId/questions").get(getPatientQuestions);

module.exports = router;
