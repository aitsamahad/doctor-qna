const router = require("express-promise-router")();
const {
  clearDoctors,
  getDoctorById,
  getDoctor,
  getAllDoctors,
  getDoctorSpecializationNotifications,
  getDoctorSpecificSpecializationAnsweredQuestions,
  getDoctorAnsweredQuestionsForAllSpecializations,
  getDoctorSpecificSpecializationQuestions,
  updateDoctor,
  postAnswer,
  updateDoctorFCM,
  doctorLogin,
  doctorLogout,
  addDoctorProfileImage,
  toggleDoctorApproval,
  getAllSpecializationNotification,
  getAllQuestionsFromSpecialization,
} = require("../controllers/doctor");

router.param("doctorId", getDoctorById);

// @GET/@PUT Doctor By Id
router.route("/:doctorId").get(getDoctor).put(updateDoctor);

// @GET * Doctors
router.route("/get/doctors").get(getAllDoctors);

// @POST Doctor Post answer
router.route("/:doctorId/post-answer").post(postAnswer);

// @POST Doctor Post answer
router.route("/:doctorId/toggle-doctor").post(toggleDoctorApproval);

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

// @GET All Notifications
router
  .route("/:doctorId/notifications/all")
  .get(getAllSpecializationNotification);

// @GET Doctor's All answer by ID
router
  .route("/:doctorId/answers")
  .get(getDoctorAnsweredQuestionsForAllSpecializations);

// @POST Doctor Profile pic upload
router.route("/upload/profile").post(addDoctorProfileImage);

// @GET Doctor's All answer by ID
router
  .route("/:doctorId/:specializationId/answers")
  .get(getDoctorSpecificSpecializationAnsweredQuestions);

// @GET Doctor's Questions By specializationId
router
  .route("/:doctorId/specialization/:specializationId")
  .get(getDoctorSpecificSpecializationQuestions);

// @GET Doctor's Questions By specializationId All
router
  .route("/:doctorId/specialization/:specializationId/all")
  .get(getAllQuestionsFromSpecialization);

// @POST Doctor Table Clear
router.route("/clear").post(clearDoctors);

module.exports = router;
