const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  requireSignin,
  signout,
} = require("../controllers/auth");
const {
  userSignupValidator,
  userSigninValidator,
  runValidation,
} = require("../validators/auth");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
