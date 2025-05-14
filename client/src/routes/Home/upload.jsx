import React from "react";
import { useState } from "react";
import axios from "axios";

function Upload() {
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;
  const preset_name = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;
  const [image, setImage] = useState();

  function handleFile(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_name);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      )
      .then((res) => {
        console.log(res);
        setImage(res.data.secure_url);
      })
      .catch((err) => console.log(err));
  }
  return (
    <div>
      <h2>upload image</h2>
      {/* <Books /> */}
      <input type="file" onChange={handleFile}></input>
      <img src={image} alt="uploaded image"></img>
    </div>
  );
}

export default Upload;
