const { validationResult } = require("express-validator");
const expressJwt = require("express-jwt");

module.exports = {
  errorHandler: req => {
    // Binding errors from request into validation and assigning it to 'errors' const
    const errors = validationResult(req);
    return errors;
  },

  isSignedId: expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
  }),
};
