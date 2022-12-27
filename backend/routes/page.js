const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  requireSignin,
  signout,
  canUpdateDeletePage,
  // OptionalAuth,
  optionalSignin,
} = require("../controllers/auth");
const {
  makePage,
  getSinglePage,
  getAllPages,
  getAllPagesFromUser,
  updatePage,
  deletePage,
} = require("../controllers/page");

router.post("/page", requireSignin, makePage);
router.get("/page/:slug", optionalSignin, getSinglePage);
router.get("/pages", getAllPages);
router.get("/pagesFromUser", optionalSignin, getAllPagesFromUser);

router.delete("/page/:slug", requireSignin, canUpdateDeletePage, deletePage);
router.patch("/page/:slug", requireSignin, canUpdateDeletePage, updatePage);

module.exports = router;
