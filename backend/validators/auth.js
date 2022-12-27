const { check } = require("express-validator");
const { validationResult } = require("express-validator");

exports.userSignupValidator = [
  check("username").not().isEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Must be a valid email"),
  check("password")
    // khud se(name se) - neche wala part
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters long")
    // khud se(puraney course se)- neche wala part
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

exports.userSigninValidator = [
  check("email").isEmail().withMessage("Must be a valid email"),
  check("password")
    // khud se(name se) - neche wala part
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters long")
    // khud se(puraney course se)- neche wala part
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

exports.userUpdateValidator = [
  check("username").not().isEmpty().withMessage("Username is required"),
  // check("name").not().isEmpty().withMessage("Name is required"),
];

exports.forgotPasswordValidator = [
  check("email").not().isEmpty().isEmail().withMessage("Must be a valid email"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    // khud se(name se) - neche wala part
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters long")
    // khud se(puraney course se)- neche wala part
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
};
//
//

///

///
//

// exports.createPostValidator = (req, res, next) => {
//   // title
//   req.check("title", "Write a title").notEmpty();
//   req.check("title", "Title must be between 4 to 150 characters").isLength({
//     min: 4,
//     max: 150,
//   });
//   // body
//   req.check("body", "Write a body").notEmpty();
//   req.check("body", "Body must be between 4 to 2000 characters").isLength({
//     min: 4,
//     max: 2000,
//   });
//   // check for errors
//   const errors = req.validationErrors();
//   // if error show the first one as they happen
//   if (errors) {
//     const firstError = errors.map((error) => error.msg)[0];
//     return res.status(400).json({ error: firstError });
//   }
//   // proceed to next middleware
//   next();
// };
// exports.userSignupValidator = (req, res, next) => {
//     // name is not null and between 4-10 characters
//     req.check("name", "Name is required").notEmpty();
//     // email is not null, valid and normalized
//     req
//       .check("email", "Email must be between 3 to 32 characters")
//       .matches(/.+\@.+\..+/)
//       .withMessage("Email must contain @")
//       .isLength({
//         min: 4,
//         max: 2000,
//       });
//     // check for password
//     req.check("password", "Password is required").notEmpty();
//     req
//       .check("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must contain at least 6 characters")
//       .matches(/\d/)
//       .withMessage("Password must contain a number");
//     // check for errors
//     const errors = req.validationErrors();
//     // if error show the first one as they happen
//     if (errors) {
//       const firstError = errors.map((error) => error.msg)[0];
//       return res.status(400).json({ error: firstError });
//     }
//     // proceed to next middleware
//     next();
//   };

//   exports.userSigninValidator = (req, res, next) => {
//     // email is not null, valid and normalized
//     req
//       .check("email", "Email must be between 3 to 32 characters")
//       .matches(/.+\@.+\..+/)
//       .withMessage("Email must contain @")
//       .isLength({
//         min: 4,
//         max: 15,
//       });
//     // check for password
//     req.check("password", "Password is required").notEmpty();
//     req
//       .check("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must contain at least 6 characters")
//       .matches(/\d/)
//       .withMessage("Password must contain a number");
//     // check for errors
//     const errors = req.validationErrors();
//     // if error show the first one as they happen
//     if (errors) {
//       const firstError = errors.map((error) => error.msg)[0];
//       return res.status(400).json({ error: firstError });
//     }
//     // proceed to next middleware
//     next();
//   };

//   exports.passwordResetValidator = (req, res, next) => {
//     // check for password
//     req.check("newPassword", "Password is required").notEmpty();
//     req
//       .check("newPassword")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 chars long")
//       .matches(/\d/)
//       .withMessage("must contain a number")
//       .withMessage("Password must contain a number");

//     // check for errors
//     const errors = req.validationErrors();
//     // if error show the first one as they happen
//     if (errors) {
//       const firstError = errors.map((error) => error.msg)[0];
//       return res.status(400).json({ error: firstError });
//     }
//     next();
//   };
