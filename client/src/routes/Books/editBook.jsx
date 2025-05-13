import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NoImage from "../../assets/no-image.png";

function EditBook() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  //   const baseURL = "http://localhost:8000/api/books/";
  //   console.log(import.meta.env.VITE_SERVER_URL);
  const urlSLUG = useParams();
  const goURL = `${apiURL}${urlSLUG.slug}`;

  const [bookID, setBookID] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]);
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState(0);
  const [language, setLanguage] = useState("");
  const [cover, setCover] = useState(null);
  const [submitted, setSubmitted] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(goURL);

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        setBookID(data._id);
        setTitle(data.title);
        setSlug(data.slug);
        setStars(data.stars);
        setDescription(data.description);
        setGenres(data.genres);
        setAuthor(data.author);
        setPublishYear(data.publishYear);
        setLanguage(data.language);
        setCover(data.cover);
        setData(data);
        setIsLoading(false);
        console.log(data.stars);
        setStars(data.stars);
      } catch (error) {
        console.log(error);
        setError("Error when fetching data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateBook = async (e) => {
    e.preventDefault();
    console.table([title, slug, author, publishYear, language, cover, image]);

    const formData = new FormData();
    formData.append("bookID", bookID);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    formData.append("genres", genres);
    formData.append("author", author);
    formData.append("publishYear", publishYear);
    formData.append("language", language);

    if (cover) {
      formData.append("cover", cover);
    }

    try {
      const response = await fetch(apiURL, {
        method: "PUT",
        body: formData,
      });

      // const response = await fetch(apiURL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     title: title,
      //     slug: slug,
      //     stars: stars,
      //     description: description,
      //     category: categories,
      //   }),
      // });

      if (response.ok) {
        setBookID("");
        setTitle("");
        setSlug("");
        setStars(0);
        setDescription("");
        setGenres([]);
        setAuthor("");
        setPublishYear(0);
        setLanguage("");
        setCover(null);
        setImage(NoImage);
        setSubmitted(true);
      } else {
        console.log("Failed to submit data.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenresChange = (e) => {
    setGenres(
      e.target.value.split(",").map((splitedText) => splitedText.trim())
    );
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setCover(e.target.files[0]);
      console.log(cover);
      console.log(image);
    }
  };

  return (
    <div>
      <h1>Edit a Book</h1>
      <Link to={"/books"} className="linkButton">
        ↩ Back
      </Link>
      {submitted ? (
        <p>Update Book Successfully!</p>
      ) : (
        <form className="bookdetails" onSubmit={updateBook}>
          <div className="col-1">
            <label>Upload a Book Cover:</label>
            <br></br>
            {image ? (
              <img src={image} alt="cover image" />
            ) : (
              // <img src={`${baseURL}/covers/${cover}`} alt="cover image" />
              <img src={cover} alt="cover image" />
            )}

            <input
              onChange={onImageChange}
              type="file"
              accept="image/gif, image/jpeg, image/png"
            />
          </div>
          <div className="col-2">
            <div>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label>URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div>
              <label>Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                rows="4"
                cols="50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label>Stars</label>
              <input
                type="text"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
              />
            </div>
            <div>
              <label>Publish Year</label>
              <input
                type="text"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
              />
            </div>
            <div>
              <label>Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <div>
              <label>Genres (seperate with , )</label>
              <input type="text" value={genres} onChange={handleGenresChange} />
            </div>

            <button type="submit" className="button-19">
              Update the Book
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
export default EditBook;
