const router = require("express-promise-router")();
const { check } = require("express-validator");
const AuthController = require("../controllers/auth");
const Auth = require("../handlers/auth");

// @POST ADMIN LOGIN
router.route("/admin/login").post(AuthController.AdminLogin);

// ***************** DOCTOR SECTION ********************

// @POST Doctor SignUp
router.route("/doctor/signup").post(AuthController.Doctor_Signup);

// @POST Doctor SignIn
router
  .route("/doctor/signin")
  .post(
    [check("d_id", "d_id must contain Firebase ID.").isLength({ min: 3 })],
    AuthController.Doctor_Login
  );

router.route("/doctors").get(function (req, res) {
  res.json({ Message: "Reached!" });
});

// ***************** Patient SECTION ********************

// @POST Patient SignUp
router.route("/patient/signup").post(
  [
    check("p_id", "p_id must contain Firebase ID.").isLength({ min: 3 }),
    check("f_name", "f_name must contain Patient's first name.").isLength({
      min: 3,
    }),
    check("l_name", "l_name must contain Patient's last name").isLength({
      min: 3,
    }),
    check("age", "age must not be empty.").isLength({ min: 1 }),
    check("email", "email is required").isEmail(),
    check("weight", "weight is required").isLength({ min: 1 }),
    check("height", "height is required").isLength({ min: 1 }),
  ],
  AuthController.Patient_Signup
);

// @POST Patient SignIn
router
  .route("/patient/signin")
  .post(
    [check("p_id", "p_id must contain Firebase ID.").isLength({ min: 3 })],
    AuthController.Patient_Login
  );

module.exports = router;
