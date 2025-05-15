import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NoImage from "../../assets/no-image.png";
import axios from "axios";

function EditBook() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  //   const baseURL = "http://localhost:8000/api/books/";
  //   console.log(import.meta.env.VITE_SERVER_URL);
  const urlSLUG = useParams();
  const goURL = `${apiURL}${urlSLUG.slug}`;
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;
  const preset_name = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;

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
  const [coverURL, setCoverURL] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [titleLabel, setTitleLabel] = useState("");
  const [slugLabel, setSlugLabel] = useState("");

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
        setStars(data.stars) || "";
        setDescription(data.description || ""); //為所有欄位提供預設值，避免 undefined //Thank you Grok!
        setGenres(data.genres || []); //formData + multer + express 傳undefined 會500 Internal Server Error //Thank you Grok!
        setAuthor(data.author || "");
        setPublishYear(data.publishYear || "");
        setLanguage(data.language || "");
        setCover(data.cover || "");
        // setData(data);
        // setIsLoading(false);
        console.log(data.stars);
        console.log("data:");
        console.log(data);
        setStars(data.stars);
      } catch (error) {
        console.log(error);
        // setError("Error when fetching data.");
        // setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateBook = async (e) => {
    e.preventDefault();
    title.trim() === ""
      ? setTitleLabel("*(This field is required)")
      : setTitleLabel("");
    slug.trim() === ""
      ? setSlugLabel("*(This field is required)")
      : setSlugLabel("");
    if (title.trim() === "" || slug.trim() === "") {
      return;
    }

    console.table([title, slug, author, publishYear, language, cover, image]);

    let coverImageURL = cover;
    // if (cover) {
    //   coverImageURL = cover;
    // }

    // 如果有上傳圖片，則上傳到 Cloudinary
    if (uploadFile) {
      const upload_image_formData = new FormData();
      upload_image_formData.append("file", uploadFile);
      upload_image_formData.append("upload_preset", preset_name);

      // 等待 Cloudinary 上傳完成
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        upload_image_formData
      );

      coverImageURL = res.data.secure_url; // 直接使用回應中的 URL
      setCoverURL(coverImageURL); // 可選：更新狀態以用於 UI 顯示
      console.log("Cloudinary response:", res.data);
      console.log("coverImageURL:", coverImageURL);
    }

    const formData = new FormData();
    formData.append("bookID", bookID);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    // formData.append("genres", genres);
    //formData不能直接傳送array
    genres.forEach((genre) => {
      formData.append("genres[]", genre.toLowerCase());
    });
    formData.append("author", author);
    formData.append("publishYear", publishYear);
    formData.append("language", language);
    if (cover !== "") {
      formData.append("coverURL", cover);
    } else {
      formData.append("coverURL", coverImageURL); // 使用從 Cloudinary 獲取的 URL //Thank you Grok!
    }
    // if (cover) {
    //   formData.append("cover", cover);
    // }
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
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
      // setImage(URL.createObjectURL(e.target.files[0]));
      // setCover(e.target.files[0]);
      // console.log(cover);
      // console.log(image);
      setImage(URL.createObjectURL(e.target.files[0]));
      setUploadFile(e.target.files[0]);
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
              <img src={cover ? cover : NoImage} alt="cover image" />
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
              <label className="redLabel">{titleLabel}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label>URL Slug</label>
              <label className="redLabel">{slugLabel}</label>
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
