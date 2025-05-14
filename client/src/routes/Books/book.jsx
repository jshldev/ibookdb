import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Stars from "./stars";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import NoImage from "../../assets/no-image.png";

// const datefns = require("date-fns");

function Book() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookID, setBookID] = useState("");
  const [stars, setStars] = useState("");
  const [lastModify, setLastModify] = useState("");
  const urlSLUG = useParams();
  const goURL = `${apiURL}${urlSLUG.slug}`;
  console.log(goURL);
  const navigate = useNavigate();

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
        // setLastModify(
        //   formatInTimeZone(
        //     data.createDate,
        //     "Asia/Hong_Kong",
        //     "yyyy-MM-dd HH:mm:ss zzz"
        //   )
        // );
        setLastModify(format(data.createDate, "yyyy-MM-dd HH:mm:ss O"));
      } catch (error) {
        console.log(error);
        setError("Error when fetching data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  // console.log(lastModify);

  const deleteBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiURL + bookID, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookID("");
        navigate("/books");
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
          <Link to={`/editbook/${data.slug}`} className="linkButton">
            🖍 Edit
          </Link>
          <br></br>
          <button onClick={deleteBook} className="button-24">
            ❌Delete This Book
          </button>
        </div>

        <div className="col-2 bookPage">
          <h1>{data?.title}</h1>
          <p>Author: {data?.author}</p>
          <p>Description: {data?.description}</p>
          <span>Stars: {stars}/5 </span>
          <Stars stars={stars} />
          {/* ⭐☆★ ✰☆*/}
          <p>Publish Year: {data?.publishYear}</p>
          <p>Language: {data?.language}</p>
          <p>Genre:</p>
          <ul>
            {data?.genres?.map((genre, index) => (
              <li key={index}>{genre}</li>
            ))}
          </ul>
          {/* formatInTimeZone(date, 'Asia/Hong_Kong', 'yyyy-MM-dd HH:mm:ss zzz') */}
          <p>Last Modified: {lastModify}</p>
        </div>
      </div>
    </div>
  );
}

export default Book;
