import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="button-container">
        <Link to="/register">
          <button className="button-register">Register</button>
        </Link>
        <Link to="/login">
          <button className="button-login">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
