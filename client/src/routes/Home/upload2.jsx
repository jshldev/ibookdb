import React from "react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Compressor from "compressorjs";
import imageCompression from "browser-image-compression";

function Upload2() {
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;
  const preset_name = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;
  const [image, setImage] = useState();

  async function handleFile(event) {
    const file = event.target.files[0];

    const options = {
      // maxSizeMB: 0.8,
      maxWidthOrHeight: 500,
      initialQuality: 0.8,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      uploadToServer(compressedFile, file.name); // write your own logic
    } catch (error) {
      console.log(error);
    }
  }

async function compressBookImageAndUpload(file) {
    const options = {
      // maxSizeMB: 0.8,
      maxWidthOrHeight: 500,
      initialQuality: 0.8,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      uploadToServer(compressedFile, file.name); // write your own logic
    } catch (error) {
      console.log(error);
    }
  }

  function uploadToServer(file, filename) {
    if (uploadFile) {
    const formData = new FormData();
    formData.append("file", file, filename);
    formData.append("upload_preset", preset_name);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload/`,
        formData
      )
      .then((res) => {
        console.log(res);
        coverImageURL = res.data.secure_url; // 直接使用回應中的 URL
      setCoverURL(coverImageURL); // 可選：更新狀態以用於 UI 顯示
      console.log("Cloudinary response:", res.data);
      console.log("coverImageURL:", coverImageURL);

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

export default Upload2;
