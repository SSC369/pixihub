import React from "react";
import notFoundImage from "../../assets/not-found.jpg";

const NotFound = () => {
  return (
    <div className="not-found-container ">
      <img src={notFoundImage} />
      <h2>Something Went Wrong!</h2>
    </div>
  );
};

export default NotFound;
