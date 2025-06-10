const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_PW_SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, name: user.name, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.signup(email, password, name);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, name: user.name, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all favouriteBooks route
const userGetAllFavBook = async (req, res) => {
  // const user_id = req.user.id;
  const { email } = req.body;

  try {
    const query = { email: email };

    const result = await User.findOne(query).select("favouriteBooks");
    if (result) {
      console.log("Document updated successfully:", result);
    } else {
      console.log("Document not found.");
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// add favouriteBooks route
const userAddFavBook = async (req, res) => {
  const bookID = req.params.id;
  // const user_id = req.user.id;
  const { email } = req.body;

  try {
    const query = { email: email };
    const valueToAdd = bookID;

    const result = await User.findOneAndUpdate(
      query,
      { $addToSet: { favouriteBooks: valueToAdd } },
      { new: true } // This option returns the modified document rather than the original
    );
    if (result) {
      console.log("Document updated successfully:", result);
    } else {
      console.log("Document not found.");
    }

    res.status(200).json({ email, bookID });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete favouriteBooks route
const userDelFavBook = async (req, res) => {
  const bookID = req.params.id;
  // const user_id = req.user.id;
  const { email } = req.body;

  try {
    const query = { email: email };
    const valueToRemove = bookID;

    const result = await User.updateOne(
      query,
      { $pull: { favouriteBooks: valueToRemove } },
      { new: true } // This option returns the modified document rather than the original
    );
    if (result) {
      console.log("Document updated successfully:", result);
    } else {
      console.log("Document not found.");
    }

    res.status(200).json({ email, bookID });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  userGetAllFavBook,
  userAddFavBook,
  userDelFavBook,
};
