import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Book() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const urlSLUG = useParams();
  const goURL = `${apiURL}${urlSLUG.slug}`;
  console.log(goURL);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, []);

  return (
    <div>
      Book
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Link to={"/books"}>↩ Back</Link>
      <div className="bookdetails">
        <div className="col-1">
          <img src={`${baseURL}/covers/${data?.cover}`} alt={data?.title} />
        </div>

        <div className="col-2">
          <h1>{data?.title}</h1>
          <p>{data?.description}</p>
          <p>Stars: {data?.stars}</p>

          <p>Genre</p>
          <ul>
            {data?.genres?.map((genre, index) => (
              <li key={index}>{genre}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Book;
