const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

module.exports = {
  authGuard: async (req, res, next) => {
    const token = await req.headers["authentication"];
    if (token) {
      let user;
      try {
        user = await jwt.verify(token, SECRET);
        if (user) {
          next();
        }
        // console.log(`${user.user} user`);
      } catch (error) {
        res.status(406).json({
          error: "Invalid 'authentication' token or Expired!",
          detail: error,
        });
      }
    } else {
      res.status(401).json({ error: "'authentication' token is not provided" });
    }
  },
};
