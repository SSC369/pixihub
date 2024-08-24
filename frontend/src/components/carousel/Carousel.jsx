import React, { useState, useEffect } from 'react';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import './style.scss';

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
 
    const features = [
        {
            title: "Upload Photos",
            description: "Easily upload and store your photos securely.",
            image: "https://res.cloudinary.com/dcnpafcrg/image/upload/v1722433567/p5_kv7q60.jpg"
        },
        {
            title: "Add Likes and Reviews",
            description: "Like and review photos shared by other users.",
            image: "https://res.cloudinary.com/dcnpafcrg/image/upload/v1722433666/p1_ac4zhy.jpg"
        },
        {
            title: "Comment on Photos",
            description: "Engage with the community by commenting on photos.",
            image: "https://res.cloudinary.com/dcnpafcrg/image/upload/v1722433618/p4_c550qh.jpg"
        },
        {
            title: "Create Collections",
            description: "Organize your photos into beautiful collections.",
            image: "https://res.cloudinary.com/dcnpafcrg/image/upload/v1722433652/p2_dcqgcf.jpg"
        },
        {
            title: "Search Photos",
            description: "Find photos by keywords and tags.",
            image: "https://res.cloudinary.com/dcnpafcrg/image/upload/v1722433625/p3_esjieu.jpg"
        },
       
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="carousel">
            <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {features.map((feature, index) => (
                    <div className="carousel-item" key={index}>
                        <img src={feature.image} alt={feature.title} />
                        <div className="carousel-caption">
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control prev" onClick={prevSlide}>
                <FaAnglesLeft size={20} />
            </button>
            <button className="carousel-control next" onClick={nextSlide}>
                <FaAnglesRight size={20} />
            </button>
            {/* <div className="carousel-dots">
                {features.map((_, index) => (
                    <span
                        key={index}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div> */}
        </div>
    );
};

export default Carousel;
