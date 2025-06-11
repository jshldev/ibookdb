import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Stars from "./stars";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import NoImage from "../../assets/no-image.png";
import Swal from "sweetalert2";

import { useAuthContext } from "../../hooks/useAuthContext";

// const datefns = require("date-fns");

function Book() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  const apiAddFavBookURL = `${baseURL}/api/user/addfavbook/`;
  const apiDelFavBookURL = `${baseURL}/api/user/delfavbook/`;
  const apiAddReviewURL = `${baseURL}/api/books/addreview/`;
  const apiFavBookIdURL = `${baseURL}/api/user/favbook`;
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookID, setBookID] = useState("");
  const [stars, setStars] = useState("");
  const [lastModify, setLastModify] = useState("");
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [addedReviewCount, setAddedReviewCount] = useState(0);
  const [favBookID, setFavBookID] = useState([]);
  const [favouritedThisBook, setFavouritedThisBook] = useState(false);

  const urlSLUG = useParams();
  const goURL = `${apiURL}${urlSLUG.slug}`;
  console.log(goURL);
  const navigate = useNavigate();

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(goURL);

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        setBookID(data._id);
        setData(data);
        setIsLoading(false);
        console.log(data.stars);
        setStars(data.stars);
        setReviews(data.reviews);
        console.log(data.reviews);
        // setLastModify(
        //   formatInTimeZone(
        //     data.createDate,
        //     "Asia/Hong_Kong",
        //     "yyyy-MM-dd HH:mm:ss zzz"
        //   )
        // );
        setLastModify(format(data.createDate, "yyyy-MM-dd HH:mm:ss O"));

        const email = user.email;

        const fav_response = await fetch(apiFavBookIdURL, {
          method: "POST",
          // headers: { Authorization: `Bearer ${user.token}` },

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
          }),
        });

        if (!fav_response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const fav_data = await fav_response.json();
        setFavBookID();
        if (fav_data.result.favouriteBooks.includes(data._id))
          setFavouritedThisBook(true);
        console.log("FavBookID:");
        console.log(fav_data.result.favouriteBooks);
      } catch (error) {
        console.log(error);
        setError("Error when fetching data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [addedReviewCount, favouritedThisBook]);
  // console.log(lastModify);

  function deleteConfirm(e) {
    Swal.fire({
      title: "Are you sure to delete this book?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Book has been deleted.",
          // text: "Book has been deleted.",
          icon: "success",
        });
        deleteBook(e);
      }
    });
  }

  const deleteBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiURL + bookID, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        setBookID("");
        navigate("/books");
      }
    } catch (error) {
      console.log("Failed to delete data.");
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const addFavBook = async () => {
    // const formData = new FormData();
    // formData.append("email", user.email);
    // formData.append("bookID", bookID);
    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    const email = user.email;
    try {
      const response = await fetch(apiAddFavBookURL + bookID, {
        method: "POST",
        // headers: { Authorization: `Bearer ${user.token}` },
        // body: formData,

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          bookID,
        }),
      });

      console.log(apiAddFavBookURL);
      console.log(bookID);
      console.log(apiAddFavBookURL + bookID);
      console.log(user.email);

      if (response.ok) {
        // setBookID("");
        // navigate("/books");
        setFavouritedThisBook(true);
      }
    } catch (error) {
      console.log("Failed to delete data.");
    }
  };

  const delFavBook = async () => {
    const email = user.email;
    try {
      const response = await fetch(apiDelFavBookURL + bookID, {
        method: "POST",
        // headers: { Authorization: `Bearer ${user.token}` },

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          bookID,
        }),
      });

      console.log(apiAddFavBookURL);
      console.log(bookID);
      console.log(apiAddFavBookURL + bookID);
      console.log(user.email);

      if (response.ok) {
        // setBookID("");
        // navigate("/books");
        setFavouritedThisBook(false);
      }
    } catch (error) {
      console.log("Failed to delete data.");
    }
  };

  const handleAddReview = async () => {
    try {
      const response = await fetch(apiAddReviewURL, {
        method: "PATCH",
        // headers: { Authorization: `Bearer ${user.token}` },

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookID: bookID,
          email: user.email,
          name: user.name,
          review: review,
        }),
      });

      console.log(apiAddReviewURL);
      console.log(bookID);
      console.log(user.email);
      console.log(user.name);
      console.log(user.review);

      if (response.ok) {
        setReview("");
        setAddedReviewCount(addedReviewCount + 1);

        // navigate("/books");
      }
    } catch (error) {
      console.log("Failed to delete data.");
    }
  };

  return (
    <div>
      <h2>Book</h2>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="bookdetails">
        <div className="col-1">
          <Link to={"/books"} className="linkButton">
            ↩ Back
          </Link>
          {/* <img src={`${baseURL}/covers/${data?.cover}`} alt={data?.title} /> */}
          <img src={data.cover ? data.cover : NoImage} alt={data?.title} />
          {user &&
            (favouritedThisBook ? (
              <Link to="" onClick={delFavBook} className="linkButton">
                ♥ Delete from Favourite ♥
              </Link>
            ) : (
              <Link to="" onClick={addFavBook} className="linkButton">
                ♥ Add to Favourite ♥
              </Link>
            ))}
          <br />
          {user
            ? user.email === "ibdb_admin@gmail.com" && (
                <>
                  <Link to={`/editbook/${data.slug}`} className="linkButton">
                    🖍 Edit
                  </Link>
                  <br></br>
                  <button onClick={deleteConfirm} className="button-24">
                    ❌Delete This Book
                  </button>
                </>
              )
            : ""}
        </div>

        <div className="col-2 bookPage">
          <h1>{data?.title}</h1>
          <p>
            <label className="book-label">Author:</label> {data?.author}
          </p>
          <p>
            <label className="book-label">Description:</label>{" "}
            {data?.description}
          </p>
          <span>
            <label className="book-label">Stars:</label> {stars}/5{" "}
          </span>
          <Stars stars={stars} />
          {/* ⭐☆★ ✰☆*/}
          <p>
            <label className="book-label">Publish Year:</label>{" "}
            {data?.publishYear}
          </p>
          <p>
            <label className="book-label">Language:</label> {data?.language}
          </p>
          <label className="book-label">Genre:</label>
          <ul>
            {data?.genres?.map((genre, index) => (
              <li key={index}>{capitalizeFirstLetter(genre)}</li>
            ))}
          </ul>
          {/* formatInTimeZone(date, 'Asia/Hong_Kong', 'yyyy-MM-dd HH:mm:ss zzz') */}
          <p>
            <label className="book-label">Last Modified:</label> {lastModify}
          </p>

          <div className="reviews-box">
            {user && (
              <div className="add-review">
                <label>Leave a review:</label>
                <textarea
                  rows="2"
                  cols="50"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button onClick={handleAddReview}>Send Review</button>
              </div>
            )}
            <div className="reviews">
              <p>Reviews by users:</p>
              {reviews
                .slice(-10)
                .reverse()
                .map(({ userName, review }) => (
                  <>
                    <p>
                      <label className="book-label">{`${userName}: `}</label>
                      {review}
                    </p>
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Book;
