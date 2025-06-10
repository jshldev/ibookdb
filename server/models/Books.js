const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    cover: {
      type: String,
    },
    stars: {
      type: Number,
    },
    author: {
      type: String,
    },
    publishYear: {
      type: Number,
    },
    genres: {
      type: Array,
    },
    language: {
      type: String,
    },
    createDate: {
      type: Date,
      defalut: Date.now(),
    },
  },
  { collection: "books" }
);

module.exports = mongoose.model("Book", BookSchema);
