// src/components/Hero.js
import React from "react";

import { useNavigate } from "react-router-dom";

import "./style.scss";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <h1>Welcome to PixiHub</h1>
      <p>
        Discover, share, and get inspired by the world’s most beautiful photos.
      </p>
      <div className="button-container">
        <button onClick={() => navigate("/images")} className="cta-btn">
          Explore PixiHub
        </button>
        <button onClick={() => navigate("/add-image")} className="cta-btn">
          Upload Your Photos
        </button>
      </div>
    </section>
  );
};

export default Hero;
