const express = require("express");

// const userAuth = require("../middleware/userAuth");

// controller functions
const {
  loginUser,
  signupUser,
  userAddFavBook,
  userDelFavBook,
  userGetAllFavBook,
} = require("../controllers/userController");

const router = express.Router();

// multer for formData
// const multer = require("multer");
// const upload = multer();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// get all favouriteBooks route
router.post("/favbook/", userGetAllFavBook);

// add favouriteBooks route
router.post("/addfavbook/:id", userAddFavBook);

// delete favouriteBooks route
router.post("/delfavbook/:id", userDelFavBook);

module.exports = router;
