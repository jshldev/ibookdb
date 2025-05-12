require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Books = require("./models/Books");
const multer = require("multer");

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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "covers/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//Create a book
app.post("/api/books/", upload.single("cover"), async (req, res) => {
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
    console.log(req.body);
    console.log(req.file);
    const book = new Books({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      stars: req.body.stars,
      author: req.body.author,
      publishYear: req.body.publishYear,
      genres: req.body.genres,
      language: req.body.language,
      cover: req.file ? req.file.filename : "no-image.png",
    });
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
app.put("/api/books/", upload.single("cover"), async (req, res) => {
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
    console.log(req.body);
    console.log(req.file);
    const book = {
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      stars: req.body.stars,
      author: req.body.author,
      publishYear: req.body.publishYear,
      genres: req.body.genres,
      language: req.body.language,
    };
    if (req.file) {
      book.cover = req.file.filename;
    }
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
