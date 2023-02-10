import React from "react";
import { STATE404 } from "../assets/image/index";

const Error = () => {
  return (
    <div className="error">
      <img
        src={STATE404}
        style={{ height: "100vh", width: "100vw", objectFit: "cover" }}
        alt="404"
      />
    </div>
  );
};

export default Error;
