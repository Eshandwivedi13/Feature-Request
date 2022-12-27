const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  requireSignin,
  signout,
  canUpdateDeleteFeature,
  // OptionalAuth,
  optionalSignin,
} = require("../controllers/auth");
const {
  makeFeature,
  getAllFeaturesOfPage,
  getSingleFeature,
  deleteFeature,
  updateFeature,
  voteFeature,
  getAllFeaturesFromUser,
  getAllFeatures,
} = require("../controllers/feature");

router.post("/feature/:pageId", requireSignin, makeFeature);
router.get("/features/:pageId", optionalSignin, getAllFeaturesOfPage);
//getFeatures basedon Loggedin User
router.get("/features", getAllFeatures);

router.get("/featuresFromUser", optionalSignin, getAllFeaturesFromUser);

router.get("/feature/:slug", optionalSignin, getSingleFeature);
router.delete(
  "/feature/:slug",
  requireSignin,
  canUpdateDeleteFeature,
  deleteFeature
);
router.patch(
  "/feature/:slug",
  requireSignin,
  canUpdateDeleteFeature,
  updateFeature
);

router.post("/feature/vote/:featureId", requireSignin, voteFeature);

module.exports = router;
