// src/components/Footer.js
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './style.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-branding">
                    <h2>PixiHub</h2>
                    <p>Capture and Share the World's Moments</p>
                </div>
                <div className="footer-links">
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact Us</a>
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                    <a href="#faq">FAQ</a>
                </div>
                <div className="footer-social">
                    <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
                    <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
                    <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
                    <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
                    <a href="https://youtube.com" aria-label="YouTube"><FaYoutube /></a>
                </div>
                <div className="footer-newsletter">
                    <p>Subscribe to our newsletter</p>
                    <div>
                        <input type="email" placeholder="Enter your email" aria-label="Email" />
                        <button type="submit">Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 PixiHub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
