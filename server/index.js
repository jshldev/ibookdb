require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Books = require("./models/Books");

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

//fetch note by URL SLUG
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
