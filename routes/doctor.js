const router = require("express-promise-router")();
const {
  clearDoctors,
  getDoctorById,
  getDoctor,
  getDoctorSpecializationNotifications,
  getDoctorSpecificSpecializationQuestions,
  updateDoctor,
  postAnswer,
  updateDoctorFCM,
  doctorLogin,
  doctorLogout,
} = require("../controllers/doctor");

router.param("doctorId", getDoctorById);

// @GET/@PUT Doctor By Id
router.route("/:doctorId").get(getDoctor).put(updateDoctor);

// @POST Doctor Post answer
router.route("/:doctorId/post-answer").post(postAnswer);

// @PUT Doctor Update FCM
router.route("/:doctorId/update-fcm").put(updateDoctorFCM);

// @POST Doctor Login
router.route("/:doctorId/doctor-login").post(doctorLogin);

// @POST Doctor Logout
router.route("/:doctorId/doctor-logout").post(doctorLogout);

// @GET Doctor's Notifications By Id
router
  .route("/:doctorId/notifications")
  .get(getDoctorSpecializationNotifications);

// @GET Doctor's Questions By specializationId
router
  .route("/:doctorId/specialization/:specializationId")
  .get(getDoctorSpecificSpecializationQuestions);

// @POST Doctor Table Clear
router.route("/clear").post(clearDoctors);

module.exports = router;
