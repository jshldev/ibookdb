import React, { useState } from "react";
import NoImage from "../../assets/no-image.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function CreateBook() {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const apiURL = `${baseURL}/api/books/`;
  //   const baseURL = "http://localhost:8000/api/books/";
  //   console.log(import.meta.env.VITE_SERVER_URL);
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;
  const preset_name = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;

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
  const [coverURL, setCoverURL] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [titleLabel, setTitleLabel] = useState("");
  const [slugLabel, setSlugLabel] = useState("");

  const createBook = async (e) => {
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
    // if (title.trim() === "" || slug.trim() === "") {
    //   setTitleLabel("Title (This field is required)");
    //   setSlugLabel("URL Slug (This field is required)");
    //   console.log("need slug");
    //   return;
    // }

    // my version
    // let coverImageURL = "";
    // const upload_image_formData = new FormData();
    // upload_image_formData.append("file", uploadFile);
    // upload_image_formData.append("upload_preset", preset_name);
    // axios
    //   .post(
    //     `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    //     upload_image_formData
    //   )
    //   .then((res) => {
    //     console.log(res);
    //     setCoverURL(res.data.secure_url);
    //     console.log(res.data.secure_url);
    //     console.log(coverURL);
    //     console.log("coverURL");
    //     coverImageURL = res.data.secure_url; // 直接使用回應中的 URL
    //     setCoverURL(coverImageURL); // 更新狀態（可選，僅用於顯示或其他用途）
    //   })
    //   .catch((err) => console.log(err));
    //   my version

    let coverImageURL = "";

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

    console.table([
      title,
      slug,
      author,
      publishYear,
      language,
      cover,
      image,
      coverURL,
    ]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    // formData.append("genres", genres);
    //formData不能直接傳送array
    genres.forEach((genre) => {
      formData.append("genres[]", genre.toLowerCase());
    });
    // formData.append("cover", cover);
    formData.append("author", author);
    formData.append("publishYear", publishYear);
    formData.append("language", language);
    // formData.append("coverURL", coverURL);
    formData.append("coverURL", coverImageURL); // 使用從 Cloudinary 獲取的 URL //Thank you Grok!

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
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
        // setCoverURL("");
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
      //old version for multer
      // setImage(URL.createObjectURL(e.target.files[0]));
      // setCover(e.target.files[0]);
      // console.log(cover);
      // console.log(image);

      // const file = e.target.files[0];
      // const upload_image_formData = new FormData();
      // upload_image_formData.append("file", file);
      // upload_image_formData.append("upload_preset", preset_name);
      // axios
      //   .post(
      //     `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      //     upload_image_formData
      //   )
      //   .then((res) => {
      //     console.log(res);
      //     setCoverURL(res.data.secure_url);
      //     console.log(coverURL);
      //   })
      //   .catch((err) => console.log(err));

      setImage(URL.createObjectURL(e.target.files[0]));
      setUploadFile(e.target.files[0]);
    }
  };

  //for checking
  // useEffect(() => {
  //   console.log("coverURL updated:", coverURL);
  // }, [coverURL]);

  return (
    <div>
      <h1>Create New Book</h1>
      <Link to={"/books"} className="linkButton">
        ↩ Back
      </Link>
      {submitted ? (
        <p>Create New Book Successfully!</p>
      ) : (
        <form className="bookdetails" onSubmit={createBook}>
          <div className="col-1">
            <label>Upload a Book Cover:</label>
            <br></br>
            {/* <img src={image} alt="cover image" /> //multer version */}
            <img src={image ? image : NoImage} alt="cover image" />
            <input
              onChange={onImageChange}
              type="file"
              accept="image/gif, image/jpeg, image/png"
            />
          </div>
          <div className="col-2">
            <div>
              <label>Title</label>{" "}
              <label className="redLabel">{titleLabel}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label>URL Slug</label>{" "}
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
              Add New Book
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
export default CreateBook;
