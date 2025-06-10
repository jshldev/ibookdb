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

const adminAuth = require("../middleware/adminAuth");

const multer = require("multer");
const upload = multer();

//fetch all books
router.get("/", getAllBooks);

//fetch book by URL SLUG
router.get("/:slug", getBook);

//Create a book
// app.post("/api/books/", upload.single("cover"), async (req, res) => { //use multer , but vercel cannot handle multer bandwidth
router.post("/", adminAuth, upload.none(), createBook);

//Edit a book
// app.put("/api/books/", upload.single("cover"), async (req, res) => {
//use multer , but vercel cannot handle multer bandwidth
router.patch("/", adminAuth, upload.none(), editBook);

//Delete a book by ID
router.delete("/:id", adminAuth, deleteBook);

module.exports = router;
