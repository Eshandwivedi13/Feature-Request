const User = require("../models/user");
const { errorHandler } = require("../helpers/index");
const Feature = require("../models/feature");
const fs = require("fs");
const _ = require("lodash");

const AWS = require("aws-sdk");
let s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  // endpoint: process.env.AWS_ENDPOINT,
});

exports.getUser = (req, res) => {
  const { username } = req.params;
  try {
    // let user;
    if (!username) {
      return res.status(400).json({
        error: "Username required",
      });
    }
    User.findOne({ username }).exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      if (!user) {
        return res.status(404).json({
          error: "could not find a user with that username",
        });
      }
      res.json(user);
      // user = userFromDb;
      // Feature.find({ postedBy: userFromDb._id })
      //   .populate("postedBy", "_id username")
      //   .sort({ createdAt: -1 })
      //   .exec((err, featuresFromDb) => {
      //     if (err) {
      //       return res.status(400).json({
      //         error: errorHandler(err),
      //       });
      //     }
      //     // res.json({ user: user, features: featuresFromDb });
      //     res.json({ userFromDb, featuresFromDb });
      //   });
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.getUser = (req, res) => {
//   const { username } = req.params;
//   try {
//     if (!username) {
//       return res.status(400).json({
//         error: "Username required",
//       });
//     }
//     User.findOne({ username }).exec((err, user) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       if (!user) {
//         return res.status(404).json({
//           error: "could not find a user with that username",
//         });
//       }
//       res.json({ user });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.editAvatar = async (req, res) => {
  const file = req.file;
  console.log("best");

  const user = req.auth;
  console.log(file);
  if (!file) {
    return res.status(400).json({ error: "File is required" });
  }
  const params = {
    Key: file.filename,
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fs.createReadStream(file.path),
    //     ContentType: mime.lookup(req.file.path),
    ACL: "public-read",
  };
  console.log("chest");

  await s3.upload(params, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (data) {
      User.findById({ _id: user._id }).exec((err, user) => {
        console.log("test");
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        user.avatar = Key;
        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              error: errorHandler(err),
            });
          } else {
            console.log(user);
          }
        });
      });
      return res.status(201).json({ success: true });
    }
  });
  res.on("finish", function () {
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.log(err);
            ``;
            throw err;
          }
        });
      }
    } catch (e) {
      console.log("error", e);
    }
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, bio } = req.body;
  try {
    await User.findById(id).exec((err, userFromDb) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      if (username.toLowerCase() !== userFromDb.username.toLowerCase()) {
        User.findOne({ username }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          if (user) {
            return res.status(400).json({
              error:
                "User with that Username already Exists! Please Choose diferent Username",
            });
          }
        });
      }
      let newUser = { name, bio, username };
      userFromDb = _.merge(userFromDb, newUser);
      userFromDb.save((err, user) => {
        // if (err) {
        //   return res.status(400).json({
        //     error: errorHandler(err),
        //   });
        // }
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json(user);
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error " + err,
    });
  }
};
