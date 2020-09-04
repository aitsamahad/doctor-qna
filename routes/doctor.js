const router = require("express-promise-router")();
const { clearDoctors } = require("../controllers/doctor");

// @POST Doctor Table Clear
router.route("/clear").post(clearDoctors);

module.exports = router;
