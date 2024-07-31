// src/components/Features.js
import React from 'react';
import { FaCameraRetro, FaThumbsUp, FaComments, FaShareAlt, FaSearch, FaUsers } from 'react-icons/fa';
import './style.scss';

const Features = () => {
    return (
        <section className="features">
            <h2 className="features-title">Why Choose PixiHub?</h2>
            <div className="features-grid">
                <div className="feature-item">
                    <FaCameraRetro className="feature-icon" />
                    <h3>Upload Photos</h3>
                    <p>Easily upload your photos and share them with the world. Our platform supports high-quality images.</p>
                </div>
                <div className="feature-item">
                    <FaThumbsUp className="feature-icon" />
                    <h3>Like & Review</h3>
                    <p>Like and review photos to show your appreciation and give feedback to the photographers.</p>
                </div>
                <div className="feature-item">
                    <FaComments className="feature-icon" />
                    <h3>Comments</h3>
                    <p>Engage with other users by leaving comments and discussing the photos.</p>
                </div>
                <div className="feature-item">
                    <FaShareAlt className="feature-icon" />
                    <h3>Share Photos</h3>
                    <p>Share your favorite photos with your friends and family on social media.</p>
                </div>
                <div className="feature-item">
                    <FaSearch className="feature-icon" />
                    <h3>Search</h3>
                    <p>Find photos that match your interests using our advanced search functionality.</p>
                </div>
                <div className="feature-item">
                    <FaUsers className="feature-icon" />
                    <h3>Follow Users</h3>
                    <p>Follow other photographers to stay updated with their latest uploads and activities.</p>
                </div>
            </div>
        </section>
    );
};

export default Features;
