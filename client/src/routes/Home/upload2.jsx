import React from "react";
import { useState } from "react";
import axios from "axios";
import Compressor from "compressorjs";
import imageCompression from "browser-image-compression";

function Upload2() {
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;
  const preset_name = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;
  const [image, setImage] = useState();
  const [uploadFile, setUploadFile] = useState(null);

  async function handleFile(event) {
    setUploadFile(event.target.files[0]);
    setImage(await compressBookImageAndUpload(event.target.files[0]));
    // const res = await compressBookImageAndUpload(event.target.files[0]);
    // console.log(res.compressedFile);
    // console.log(res.filename);
    // uploadToServer(res.compressedFile, res.filename);
  }

  async function compressBookImageAndUpload(file) {
    console.log("File instanceof Blob", file instanceof Blob); // true
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

      const uploadToServerRespond = await uploadToServer(
        compressedFile,
        file.name
      ); // write your own logic
      console.log("uploadToServerRespond");
      console.log(uploadToServerRespond);
      // setImage(uploadToServerRespond);
      return uploadToServerRespond;
      // return { compressedFile: compressedFile, filename: file.name };
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadToServer(file, filename) {
    if (file) {
      const formData = new FormData();
      formData.append("file", file, filename);
      formData.append("upload_preset", preset_name);
      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload/`,
          formData
        );
        console.log(res);
        const coverImageURL = res.data.secure_url; // Local variable, no global
        console.log("Cloudinary response:", res.data);
        console.log("coverImageURL:", coverImageURL);
        return coverImageURL; // Return the URL to the caller
      } catch (err) {
        console.error(err);
        throw err; // Rethrow or handle the error as needed
      }
    }
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
