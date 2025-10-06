import React, { useState } from "react";
import "./reviewPage.css"
import { useLocation } from "react-router-dom";


const UserReviews = () => {
    const location = useLocation();

    const [reviews, setReviews] = useState({})



    return (
        <div className="reviewsPage">
            <h1>Your reviews</h1>
                        {reviews.length === 0 ? (
                <p>No reviews found</p>
            ) : (
            <div className="reviewsGrid">
                <div className="reviewCard" >
                    
                    <div className="movieTitle">hetki pieni</div>
                        <div className="stars">
                            {"☆".repeat(5 - 2)}
                            {"★".repeat(1)}
                        </div>
                        <div className="reviewText">work in progress </div>
                    </div>
            </div>
            )}
        </div>
    );
};

export default UserReviews;