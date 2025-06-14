import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home/home";
import About from "./routes/About/about";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Books from "./routes/Books/books";
import Book from "./routes/Books/book";
import CreateBook from "./routes/Books/createBook";
import EditBook from "./routes/Books/editBook";
import Login from "./routes/Login/Login";
import Signup from "./routes/Login/Signup";
import FavouriteBooks from "./routes/Books/favouriteBooks";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/books" element={<Books />}></Route>
          <Route path="/books/:slug" element={<Book />}></Route>
          <Route path="/createbook" element={<CreateBook />}></Route>
          <Route path="/editbook/:slug" element={<EditBook />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/favouritebooks" element={<FavouriteBooks />}></Route>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
