const router = require("express-promise-router")();
const {
  clearPatients,
  getPatientById,
  getPatient,
  getPatientQuestions,
  updatePatient,
  updatePatientFCM,
  patientLogin,
  patientLogout,
} = require("../controllers/patient");

router.param("patientId", getPatientById);

// @POST Patient Table Clear
router.route("/clear").post(clearPatients);

// @PUT Patient Update FCM
router.route("/:patientId/update-fcm").put(updatePatientFCM);

// @POST Patient Login
router.route("/:patientId/patient-login").post(patientLogin);

// @POST Patient Logout
router.route("/:patientId/patient-logout").post(patientLogout);

// @GET/@PUT Patient By Id
router.route("/:patientId").get(getPatient).put(updatePatient);

// @GET Patient Questions [Paginated]
router.route("/:patientId/questions").get(getPatientQuestions);

module.exports = router;
