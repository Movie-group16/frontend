import React from "react";
import "./reviewPage.css"
import { useLocation } from "react-router-dom";


const UserReviews = () => {
    const location = useLocation();
    const { user, reviews } = location.state || { user: "Unknown", reviews: [] };



    return (
        <div className="reviewsPage">
            <h1>Your reviews</h1>
                        {reviews.length === 0 ? (
                <p>No reviews found</p>
            ) : (
            <div className="reviewsGrid">

            {reviews.map((review, index) => (
                
                <div className="reviewCard" key={index}>
                    
                    <div className="movieTitle">{review.title}</div>
                        <img src={review.image} className="movieImage" />
                        
                        <div className="stars">
                            {"☆".repeat(5 - review.rating)}
                            {"★".repeat(review.rating)}
                        </div>
                        <div className="reviewText">{review.text}</div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default UserReviews;