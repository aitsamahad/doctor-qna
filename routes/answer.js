const router = require("express-promise-router")();

const { getAnswerById } = require("../controllers/answer");

// @GET Answer By Id
router.route("/:answerId").get(getAnswerById);

module.exports = router;
