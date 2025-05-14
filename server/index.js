require("dotenv").config();
// import { format } from "date-fns";
// import { v2 as cloudinary } from "cloudinary";

const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Books = require("./models/Books");
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

//fetch all books
app.get("/api/books", async (req, res) => {
  try {
    const genre = req.query.genre;
    // console.log(genre);

    const filter = {};
    if (genre) {
      filter.genres = genre;
    }
    // console.log(filter);

    const data = await Books.find(filter);
    if (!data) {
      throw new Error("An error occured while fetching books.");
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching books." });
  }
});

//fetch book by URL SLUG
app.get("/api/books/:slug", async (req, res) => {
  try {
    const bookSLUG = req.params.slug;

    const data = await Books.findOne({ slug: bookSLUG });
    if (!data) {
      throw new Error("An error occured while fetching book.");
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching book." });
  }
});

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
// app.post("/api/books/", upload.single("cover"), async (req, res) => { //use multer , but vercel cannot handle multer bandwidth
app.post("/api/books/", upload.none(), async (req, res) => {
  try {
    // const {
    //   title,
    //   slug,
    //   description,
    //   stars,
    //   author,
    //   publishYear,
    //   genres,
    //   language,
    // } = req.body;

    const now = new Date(Date.now());
    console.log(datefns.format(now, "yyyy-MM-dd h:mm:ss a"));

    console.log(req.body);
    // console.log(req.file);
    const book = new Books({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      stars: req.body.stars,
      author: req.body.author,
      publishYear: req.body.publishYear,
      genres: req.body.genres,
      language: req.body.language,
      // cover: req.file ? req.file.filename : "no-image.png",

      // cover: req.file
      //   ? uploadResult.url
      //   : "https://res.cloudinary.com/dxmcu2wdw/image/upload/v1747161472/no-image.png",

      cover: req.body.coverURL
        ? req.body.coverURL
        : // : "https://res.cloudinary.com/dxmcu2wdw/image/upload/v1747161472/no-image.png",
          "",
      createDate: Date.now(),
      // createDate: datefns.format(now, "yyyy-MM-dd h:mm:ss a"),
    });

    // const uploadResult = null;

    //this path = multer + cloudinary
    // if (req.file) {
    //   const uploadResult = await cloudinary.uploader
    //     .upload(req.file.path, {
    //       public_id: req.file.filename.replace(req.file.originalname, "cover"),
    //       folder: "ibookdb-covers",
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });

    //   console.log(uploadResult);
    //   console.log(uploadResult.url);

    //   book.cover = uploadResult.url;
    // } else {
    //   book.cover =
    //     "https://res.cloudinary.com/dxmcu2wdw/image/upload/v1747161472/no-image.png";
    // }
    //this path = multer + cloudinary

    // const data = await Notes.create({
    //   title,
    //   slug,
    //   description,
    //   stars,
    //   author,
    //   publishYear,
    //   genres,
    //   language,
    // });
    const data = await Books.create(book);
    if (!data) {
      throw new Error("An error occured while creating a book.");
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while creating a book." });
  }
});

//Edit a book
// app.put("/api/books/", upload.single("cover"), async (req, res) => {
//use multer , but vercel cannot handle multer bandwidth

app.put("/api/books/", upload.none(), async (req, res) => {
  try {
    const bookID = req.body.bookID;
    // const {
    //   title,
    //   slug,
    //   description,
    //   stars,
    //   author,
    //   publishYear,
    //   genres,
    //   language,
    // } = req.body;

    const now = new Date(Date.now());
    console.log(datefns.format(now, "yyyy-MM-dd h:mm:ss a"));

    console.log(req.body);
    // console.log(req.file);

    const book = {
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      stars: req.body.stars,
      author: req.body.author,
      publishYear: req.body.publishYear,
      genres: req.body.genres,
      language: req.body.language,
      cover: req.body.coverURL
        ? req.body.coverURL
        : // : "https://res.cloudinary.com/dxmcu2wdw/image/upload/v1747161472/no-image.png",
          "",
    };

    // if (req.file) {
    //   book.cover = req.file.filename;
    //   // book.cover = uploadResult.url;
    // }

    //this path = multer + cloudinary
    // if (req.file) {
    //   const uploadResult = await cloudinary.uploader
    //     .upload(req.file.path, {
    //       public_id: req.file.filename.replace(req.file.originalname, "cover"),
    //       folder: "ibookdb-covers",
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });

    //   console.log(uploadResult);
    //   console.log(uploadResult.url);

    //   book.cover = uploadResult.url;
    // }
    //this path = multer + cloudinary

    // const data = await Notes.create({
    //   title,
    //   slug,
    //   description,
    //   stars,
    //   author,
    //   publishYear,
    //   genres,
    //   language,
    // });
    const data = await Books.findByIdAndUpdate(bookID, book);
    if (!data) {
      throw new Error("An error occured while updating a book.");
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating a book." });
  }
});

//Delete a book by ID
app.delete("/api/books/:id", async (req, res) => {
  try {
    const bookID = req.params.id;

    // const data = await Books.findByIdAndDelete(bookID);
    const data = await Books.deleteOne({ _id: bookID });
    if (!data) {
      throw new Error("An error occured while deleting a book.");
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while deleting a book." });
  }
});

app.get("/", (req, res) => {
  res.json("hello");
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
