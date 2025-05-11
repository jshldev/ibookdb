import React from "react";

function Stars({ stars }) {
  let starsEmoji = "";
  for (let i = 0; i < 5; i++) {
    if (i < stars) {
      starsEmoji += "⭐";
    } else {
      starsEmoji += "☆";
    }
  }

  return <span>{starsEmoji}</span>;
}

export default Stars;
