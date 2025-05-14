import React from "react";
import Books from "../Books/books";
import { useState } from "react";
import axios from "axios";

function Home() {
  const preset_key = "ibookdb-covers-preset";
  const cloud_name = "dxmcu2wdw";
  const [image, setImage] = useState();

  function handleFile(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_key);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <h2>home page</h2>
      {/* <Books /> */}
      <input type="file" onChange={handleFile}></input>
    </div>
  );
}

export default Home;
