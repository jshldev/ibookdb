import React from "react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Upload() {
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;
  const preset_name = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;
  const [image, setImage] = useState();

  function handleFile(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_name);
    // formData.append("eager", "w_160,h_100,c_crop");
    // formData.append("eager", "c_pad,h_300,w_400");
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload/w_500,h_300,c_fit/`,
        formData
      )
      .then((res) => {
        console.log(res);
        setImage(res.data.secure_url);
      })
      .catch((err) => console.log(err));
  }

  function handleClick() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  }
  return (
    <div>
      <h2>upload image</h2>
      {/* <Books /> */}
      <input type="file" onChange={handleFile}></input>
      <img src={image} alt="uploaded image"></img>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default Upload;
