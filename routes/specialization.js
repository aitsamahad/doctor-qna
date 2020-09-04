const router = require("express-promise-router")();
const { addSpecialization } = require("../controllers/specialization");

// @POST Add Specialization
router.route("/add").post(addSpecialization);

module.exports = router;
