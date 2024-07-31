// src/components/Hero.js
import React from 'react';

import './style.scss';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate()
    return (
        <section className="hero">
            <h1>Welcome to PixiHub</h1>
            <p>Discover, share, and get inspired by the world’s most beautiful photos.</p>
            <div className="button-container">
            <button className="cta-btn">Explore PixiHub</button>
            <button onClick={() => navigate("/add-image")} className="cta-btn">Upload Your Photos</button>
            </div>
        </section>
       
    );
};

export default Hero;
