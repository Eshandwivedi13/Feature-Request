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
  searchPages,
} = require("../controllers/page");

router.post("/page", requireSignin, makePage);
router.get("/page/:slug", optionalSignin, getSinglePage);
router.get("/pages", getAllPages);
router.get("/pagesFromUser", optionalSignin, getAllPagesFromUser);
//key lo ya search lo, frontend se search aa rha hai ab usko as a keyForm lelo
router.get("/pages/search/:key", searchPages);

router.delete("/page/:slug", requireSignin, canUpdateDeletePage, deletePage);
router.patch("/page/:slug", requireSignin, canUpdateDeletePage, updatePage);

module.exports = router;
