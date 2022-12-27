const User = require("../models/user");
const { expressjwt: expressJwt } = require("express-jwt");
const user = require("../models/user");
// require("dotenv").config();
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers");
const Feature = require("../models/feature");
const crypto = require("crypto");
const Comment = require("../models/Comment");
const CommentReply = require("../models/CommentReply");
const Page = require("../models/Page");
var ObjectId = require("mongoose").Types.ObjectId;

exports.signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(403).json({
        error: "email is taken",
      });

    const user = await new User({
      username,
      email,
      // hashed_password: password    // for pre crypto method
      password,
    });

    user.save((err, user) => {
      if (err) {
        console.log("err hai", err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      // res.status(200).json({
      //   message: "signup success! please signin",
      // });
      const { _id, email, username } = user;
      // const user =   { user._id, user.name, user.email, user.username },
      res.status(200).json({
        token,
        user: { _id, email, username },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
};
// crypto wala pre method-
// exports.signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     await User.findOne({ email }).exec((err, user) => {
//       if (err || !user) {
//         return res.status(400).json({
//           error: "user with that email doesn not exist please signup!",
//         });
//       }
//       if (!user.authenticate(password)) {
//         return res.status(400).json({
//           error: "Email and password do not match",
//         });
//       }
//       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "1d",
//       });
//       res.cookie("t", token, { expiresIn: new Date() + 9999 });
//       const { _id, name, email, username } = user;
//       return res.json({
//         token,
//         user: { _id, name, email, username },
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       error: error,
//     });
//   }
// };

// const authenticateUserPassword = (user, password) => {
//   // for pre crypto method
//   const munna = crypto
//     .createHmac("sha1", user.salt)
//     .update(password)
//     .digest("hex");

//   console.log(password);
//   console.log(munna);
//   console.log(user.hashed_password);

//   return munna === user.hashed_password;
// };

exports.signin = async (req, res) => {
  try {
    const { emailorusername, password } = req.body;

    await User.findOne({
      $or: [{ username: emailorusername }, { email: emailorusername }],
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user with that email doesn not exist please signup!",
        });
      }
      if (!user) {
        return res.status(404).json({
          error: "User doesn't exist",
        });
      }
      //crypto ke pre method ke liye
      // if (!authenticateUserPassword(user, password)) {
      //   // for pre crypto method
      //   return res.status(401).json({
      //     error: "Email and password do not match",
      //   });
      // }

      if (!user.authenticate(password)) {
        console.log(password);
        return res.status(401).json({
          error: "Email and password do not match",
        });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("t", token, { expiresIn: new Date() + 9999 });
      const { _id, name, email, username } = user;
      return res.status(200).json({
        token,
        user: { _id, name, email, username },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({
    message: "Signout Success",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.optionalSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
});

//optionalAuth
// exports.OptionalAuth = (req, res, next) => {
//   console.log("test");
//   // console.log(req.headers);
//   const { authorization } = req.headers;
//   if (authorization) {
//     // authorization = authorization.split("")
//     // authorization[1] // ye hai token
//     // console.log("authorzation", authorization);
//     try {
//       // const verifyUser = expressJwt({
//       //   secret: process.env.JWT_SECRET,
//       //   algorithms: ["HS256"],
//       // });
//       // const decodedJwt = jwt.decode(token, { complete: true });
//       // if (decodedJwt.payload) console.log("test", typeof verifyUser);

//       // console.log(expressJwt.getToken);
//       // const verifiedUser = expressJwt({
//       //   secret: process.env.JWT_SECRET,
//       //   algorithms: ["HS256"],
//       //   requestProperty: req.headers.authorization,
//       // });
//       console.log("HEHE");
//       const verifiedUser = expressJwt.verify(
//         authorization,
//         process.env.JWT_SECRET,
//         // { algorithms: ["HS256"] },
//         (err, data) => console.log("HHE 2", err, data)
//       );
//       // const verifiedUser = this.requireSignin(req);
//       console.log("HEHE 3");
//       console.log(verifiedUser);

//       next();

//       // const verifyJwt = jwt.verify(token, secret, (err, success) => {
//       //   if (err) {
//       //     return res.status(401).send("Not authorized");
//       //   } else {
//       //     next();
//       //   }
//       // });
//     } catch (err) {
//       console.log(err);
//       return res.status(403).send({ error: err });
//     }
//   } else {
//     next();
//   }
// };
exports.canUpdateDeletePage = (req, res, next) => {
  try {
    const { slug } = req.params;
    Page.findOne({ slug: slug.toLowerCase() }).exec((err, page) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      const authorizedUser =
        page.postedBy &&
        req.auth &&
        page.postedBy._id.toString() === req.auth._id.toString();
      console.log(
        "found page.postedby",
        page.postedBy._id,
        "req auth Id",
        req.auth._id
      );
      if (!authorizedUser) {
        return res.status(400).json({
          error: "You are not Authorized",
        });
      }
      next();
    });
  } catch (error) {
    console.log(error);
  }
};
exports.canUpdateDeleteFeature = (req, res, next) => {
  console.log("tappu");
  const { slug } = req.params;
  Feature.findOne({ slug: slug.toLowerCase() }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    const authorizedUser =
      data.postedBy &&
      req.auth &&
      req.auth._id.toString() === data.postedBy._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: "You are not Authorized",
      });
    }
    next();
  });
};

exports.canEditDeleteComment = (req, res, next) => {
  console.log("haha");
  const { commentId } = req.params;
  Comment.findById({ _id: commentId }).exec((err, comment) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    const canUpdate =
      req.auth &&
      comment.postedBy &&
      req.auth._id.toString() === comment.postedBy._id.toString();
    if (!canUpdate) {
      return res.status(400).json({
        error: "You are not Authorized",
      });
    }
    next();
  });
};
exports.canEditDeleteCommentReply = (req, res, next) => {
  console.log("test");
  const { commentReplyId } = req.params;
  // if (!ObjectId.isValid(commentReplyId)) {
  //   return res.status(400).send({
  //     error: "Comment ID not valid",
  //   });
  // } else if (!commentReplyId) {
  //   return res.status(400).send({
  //     error: "Comment ID not Given",
  //   });
  // }
  CommentReply.findOne({ _id: commentReplyId }).exec((err, commentreply) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    const canUpdateDelete =
      commentreply.postedBy &&
      req.auth._id &&
      commentreply.postedBy._id.toString() === req.auth._id.toString();
    if (!canUpdateDelete) {
      return res.status(400).json({
        error: "You are not Authorized",
      });
    }
    next();
  });
};

// exports.OptionalAuth = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (authorization) {
//     try {
//       const id = jwt.decode(authorization, process.env.JWT_SECRET).id;
//       console.log("id", id);
//       const user = User.findOne({ _id: id }).exec((err, user) => {
//         console.log(user);
//       });
//     } catch (err) {
//       return res.status(401).send({ error: err });
//     }
//   }
//   next();
// };
