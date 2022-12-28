const express = require("express");
const router = express.Router();
const {
  getUser,
  editAvatar,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const multer = require("multer");
const shortId = require("shortid");
const { requireSignin, canUpdateDeleteUser } = require("../controllers/auth");
const { userUpdateValidator, runValidation } = require("../validators/auth");

//multer
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./testing");
  },
  filename: function (req, file, callback) {
    const random =
      Date.now() + shortId.generate() + Date.now() + shortId.generate();
    callback(null, `${random}-${file.originalname}`);
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 }, // 1GB
}) // frontend se konsa variable aney wala hai, FILE waney wala hai aur single
  .single("file");

function multerUpload(req, res, next) {
  upload(req, res, function (err) {
    // console.log("req.file", req.file);

    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ error: err });
    } else if (err) {
      // console.log("lallu");
      // An unknown error occurred when uploading.
      return res.status(400).json({ error: err });
    }
    // Everything went fine.
    next();
  });
}

router.get("/profile/:username", getUser);
router.post(
  "/user/avatar",
  requireSignin,
  // canUpdateDeleteUser,
  multerUpload,
  editAvatar
);
router.patch(
  "/profile/:id",
  requireSignin,
  // canUpdateDeleteUser,
  userUpdateValidator,
  runValidation,
  updateUser
);
router.delete(
  "/profile/:username",
  requireSignin,
  canUpdateDeleteUser,
  deleteUser
);
// router.get("/user/:username", getUser);

module.exports = router;
