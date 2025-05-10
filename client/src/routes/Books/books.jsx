import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Books() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  //   const baseURL = "http://localhost:8000/api/books/";
  //   console.log(import.meta.env.VITE_SERVER_URL);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let goURL = apiURL;
        if (selectedGenre) {
          goURL += `?genre=${selectedGenre}`;
        }

        const response = await fetch(goURL);

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError("Error when fetching data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedGenre]);

  return (
    <div>
      Books
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="filters">
        <label>Genres</label>
        <select onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">All</option>
          <option value="adventure">Adventure</option>
          <option value="crime">Crime</option>
          <option value="fiction">Fiction</option>
          <option value="food">Food</option>
          <option value="romance">Romance</option>
          <option value="science">Science</option>
          <option value="thriller">Thriller</option>
          <option value="other">Other</option>
        </select>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="books">
          {data.map((book) => (
            <li key={book._id}>
              <Link to={`/books/${book.slug}`}>
                <img src={`${baseURL}/covers/${book.cover}`} alt={book.title} />
                <h4>{book.title}</h4>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Books;
