const Books = require("../models/Books");

const datefns = require("date-fns");

//fetch all books
const getAllBooks = async (req, res) => {
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
};

//fetch book by URL SLUG
const getBook = async (req, res) => {
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
};

//Create a book
const createBook = async (req, res) => {
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
      genres: req.body.genres
        ? req.body.genres.map((str) => str.toLowerCase())
        : "",
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
    // res.status(500).json({ error: "An error occured while creating a book." });
    res.status(500).json({ error: error.message });
  }
};

//Edit a book
const editBook = async (req, res) => {
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
      genres: req.body.genres
        ? req.body.genres.map((str) => str.toLowerCase())
        : "",
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
};

//Delete a book by ID
const deleteBook = async (req, res) => {
  try {
    const bookID = req.params.id;

    // const data = await Books.findByIdAndDelete(bookID);
    const data = await Books.deleteOne({ _id: bookID });
    if (!data) {
      throw new Error("An error occured while deleting a book.");
    }
    res.status(200).json(data);
  } catch (error) {
    // res.status(500).json({ error: "An error occured while deleting a book." });
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  editBook,
  deleteBook,
};
