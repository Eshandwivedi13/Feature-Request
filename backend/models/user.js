const mongoose = require("mongoose");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 20,
      unique: true,
      index: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    hashed_password: {
      type: String,
      // required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "user",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    // avatar: {
    //   data: Buffer,
    //   contentType: String,
    // },
    avatar: String,
  },
  { timestamps: true }
);

// userSchema.pre("save", function (next) {
//   // Check if the password has been modified
//   if (this.modifiedPaths().includes("hashed_password")) {
//     console.log();
//     this.salt = Math.round(new Date().valueOf() * Math.random()) + "";

//     const munna = crypto
//       .createHmac("sha1", this.salt)
//       .update(this.hashed_password)
//       .digest("hex");

//     console.log(this.hashed_password);
//     console.log(munna);

//     this.hashed_password = munna;
//     next();
//   } else {
//     next();
//   }
// });

userSchema
  .virtual("password")
  .set(function (password) {
    // this matlab part of userSchema jo db mei store h
    // create a temporarity variable called _password
    this._password = password;
    //generate salt
    this.salt = this.makeSalt();
    // encryptPassword
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userSchema);
