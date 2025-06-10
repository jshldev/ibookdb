require("dotenv").config();
// import { format } from "date-fns";
// import { v2 as cloudinary } from "cloudinary";

const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Books = require("./models/Books");

const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

const multer = require("multer");
const datefns = require("date-fns");
const cloudinary = require("./cloudinary");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/covers", express.static("covers"));

// routes
app.use("/api/books/", bookRoutes);
app.use("/api/user/", userRoutes);

//fetch all books

//fetch book by URL SLUG

//Create a book
//multer for upload image
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "covers/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     // cb(null, uniqueSuffix + "-" + file.originalname);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

//multer for formData , if no multer, need to send JSON
const upload = multer();

//Create a book

//Edit a book

//Delete a book by ID

app.get("/", (req, res) => {
  res.json("ibdb - Internet Book Database");
});

//express version 4:
// app.get("*", (req, res) => {
//express version 5:
// app.get("/{*any}", (req, res) => {
app.get(/(.*)/, (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

(async function () {
  // Configuration
  // cloudinary.config({
  //   cloud_name: "dxmcu2wdw",
  //   api_key: "114529579145627",
  //   api_secret: "irRtBz8ZS0WqhMsR59erghZxD6c", // Click 'View API Keys' above to copy your API secret
  // });
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload("./covers/no-image.png", {
      public_id: "my-no-image",
      folder: "ibookdb-covers",
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("my-no-image", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("my-no-image", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
});
