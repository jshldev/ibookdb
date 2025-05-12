import React, { useState } from "react";
import NoImage from "../../assets/no-image.png";

function CreateBook() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  //   const baseURL = "http://localhost:8000/api/books/";
  //   console.log(import.meta.env.VITE_SERVER_URL);
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
  const [image, setImage] = useState(NoImage);

  const createBook = async (e) => {
    e.preventDefault();
    console.table([title, slug, author, publishYear, language, cover, image]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    formData.append("genres", genres);
    formData.append("cover", cover);
    formData.append("author", author);
    formData.append("publishYear", publishYear);
    formData.append("language", language);

    try {
      const response = await fetch(apiURL, {
        method: "POST",
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
      <h1>Create New Book</h1>

      {submitted ? (
        <p>Create New Book Successfully!</p>
      ) : (
        <form className="bookdetails" onSubmit={createBook}>
          <div className="col-1">
            <label>Upload Cover</label>
            <img src={image} alt="cover image" />
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
              <label>Genres (seperate with ,)</label>
              <input type="text" value={genres} onChange={handleGenresChange} />
            </div>

            <button type="submit">Add New Book</button>
          </div>
        </form>
      )}
    </div>
  );
}
export default CreateBook;
