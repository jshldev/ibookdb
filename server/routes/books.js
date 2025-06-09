const express = require("express");
const Books = require("../models/Books");
const router = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  editBook,
  deleteBook,
} = require("../controllers/booksController");

const multer = require("multer");
const upload = multer();

//fetch all books
router.get("/", getAllBooks);

//fetch book by URL SLUG
router.get("/:slug", getBook);

//Create a book
// app.post("/api/books/", upload.single("cover"), async (req, res) => { //use multer , but vercel cannot handle multer bandwidth
router.post("/", upload.none(), createBook);

//Edit a book
// app.put("/api/books/", upload.single("cover"), async (req, res) => {
//use multer , but vercel cannot handle multer bandwidth
router.patch("/", upload.none(), editBook);

//Delete a book by ID
router.delete("/:id", deleteBook);

module.exports = router;
