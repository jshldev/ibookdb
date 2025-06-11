import React from "react";

function About() {
  return (
    <div>
      <h3>Introduction:</h3>
      <pre>{`A internet book database for accessing information of books.
Once you sign-up to be a user,
you can add books to your favourite book list,
you can leave reviews for books.`}</pre>
      <h4>MERN Stack:</h4>
      <pre>
        {`MongoDB stores data in a scalable, flexible JSON format.
Express.js handles the server-side logic and API endpoints.
React.js renders front-end UI.
Node.js provides a runtime environment for JavaScript to run on the server.`}
      </pre>
      <h4>MERN Stack:</h4>
      <pre>{`Hosting:
Vercel for hosting front-end and back-end
Cloudinary for hosting book cover images.`}</pre>
    </div>
  );
}

export default About;
