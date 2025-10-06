import React, { useEffect, useState } from "react";
import "./reviewPage.css"
import { useLocation } from "react-router-dom";
import axios from 'axios';

const UserReviews = () => {
    const location = useLocation();
    const userId = location.pathname.split("/").pop();
    const backUrl = "http://localhost:3001";
    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const [reviews, setReviews] = useState([])
    const [movieDetails, setMovieDetails] = useState({})

    useEffect(() => {
    axios.get(`${backUrl}/reviews/${userId}`)
      .then(res =>  setReviews(res.data || []))
      .catch(err => console.error("Error loading reviews:", err));
    }, [userId])

  useEffect(() => {
  
    const fetchTitles = async () => {
      const titles = {};

      for (const review of reviews) {
        try {
          const response = await fetch(
          `https://api.themoviedb.org/3/movie/${review.movie_id}?language=en-US`,
          {
            headers : {
              'Authorization': `Bearer ${movieDbApiKey}`,
              'Content-Type': 'application/json;charset=utf-8'
            }
          }
        );
         
        const data = await response.json();
        titles[review.movie_id] = data.title || "Unknown Title";
        } catch (error) {
          console.error("Error fetching title:", review.movie_id, error);
          titles[review.movie_id] = "Unknown Title"
        }
      }
      setMovieDetails(titles);
    };
    fetchTitles();
  }, [reviews, movieDbApiKey]);

    return (
        <div className="reviewsPage">
            <h1>Your reviews</h1>
                        {reviews.length === 0 ? (
                <p>No reviews found</p>
            ) : (
            <div className="reviewsGrid">
                {reviews.map((review) => ( 
                <div className="reviewCard" key={review.id}>
                    <div className="movieTitle">
                        <strong>{movieDetails[review.movie_id] || "Loading..."}</strong>
                    </div>
                        <div className="stars">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                        </div>
                        <div className="reviewText">{review.review_text}</div>
                    </div>
                    ))}
            </div>
          )}
        </div>
    );
};

export default UserReviews;