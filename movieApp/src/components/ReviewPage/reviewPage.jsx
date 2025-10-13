import React, { useEffect, useState } from "react";
import "./reviewPage.css"
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { FaRegStar, FaStar, FaRegStarHalfStroke } from "react-icons/fa6";


const UserReviews = () => {
    const location = useLocation();
    const userId = location.pathname.split("/").pop();
    const backUrl = "http://localhost:3001";
    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY

    const [reviews, setReviews] = useState([])
    const [movieDetails, setMovieDetails] = useState({})
    const [selectedReview, setSelectedReview] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [editedRating, setEditedRating] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    axios.get(`${backUrl}/reviews/${userId}`)
      .then(res =>  setReviews(res.data || []))
      .catch(err => console.error("Error loading reviews:", err));
    }, [userId])


  useEffect(() => {
    const fetchMovieDetails = async () => {
      const details = {};

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
        details[review.movie_id] = {
        title: data.title || "Unknown Title",
        poster_path: data.poster_path || null,
        };
        } catch (error) {
          console.error("Error fetching title:", review.movie_id, error);
          details[review.movie_id] = "Unknown Title"
        }
      }
      setMovieDetails(details);
    };
    if (reviews.length > 0) fetchMovieDetails();
  }, [reviews, movieDbApiKey]);


const openEdit = (review) => {
  setSelectedReview(review);
  setEditedText(review.review_text);
//  setIsPublic(review.isPrivate ?? false);
};

const closeEdit = () => {
  setSelectedReview(null);
  setEditedText("");
};

const saveEdit = async () => {
  console.log("edited text:", editedText);
  // console.log("private: ", isprivate);
  setLoading(true)
  try {
    const updatedReview ={
      review_text: editedText,
//      is_private: isPrivate,
      rating: editedRating,
    };

    await axios.put(`${backUrl}/reviews/${selectedReview.id}`, updatedReview);

    setReviews((prev) => 
    prev.map((r) => 
    r.id === selectedReview.id
      ? {...r, ...updatedReview}
      : r
    )
  );
  closeEdit();
  } catch (err) {
    console.error("Error updating review:", err);
    alert("Failed to update review.");
  } finally {
   setLoading(false) 
  }
};


const renderStars = () => (
  <div className="star-edit-container">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
       key={star}
       className="star-icon"
       onClick={() => setEditedRating(star)}
       >
        {star <= editedRating ? <FaStar color="gold" /> : <FaRegStar color="gray" />}
       </span>
    ))}
  </div>
);

    return (
        <div className="reviewsPage">
            <h1>Your reviews</h1>
                        {reviews.length === 0 ? (
                <p>No reviews found</p>
            ) : (
            <div className="reviewsGrid">
                {reviews.map((review) => {
                  const movie = movieDetails[review.movie_id] || {};
                  return (
                    <div 
                      className="reviewCard" 
                      key={review.id}
                      onClick={() => openEdit(review)}
                    >
                      <div className="movie-poster-container">
                        {movie.poster_path ? (
                          <img
                          className="movie-poster"
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          />
                      
                        ) : (
                          <div className="noImage">No Image Available</div>
                        )}
                      </div>
                      <div className="movieTitle">
                        <strong>{movie.title || "Loading..."}</strong>
                      </div>

                      <div className="reviewText">{review.review_text}</div>

                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) =>
                        star <= review.rating ? (
                          <FaStar key={star} color="gold" />
                        ) : (
                          <FaRegStar key={star} color="gray" />
                        )
                        )}
                      </div>

                    </div>
                    );
                  })}
            </div>
          )}

          {selectedReview && (
            <div className="popup-overlay" onClick={closeEdit}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Review</h2>
                <p>
                  <strong>
                    {movieDetails[selectedReview.movie_id]?.title || "Movie"}
                  </strong>
                </p>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={5}
                />

                <div className="rating-selector">
                  <label>Rating:</label>
                  {renderStars()}
                </div>

                <div className="checkbox-container">
                  <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <label>Private Review</label>
                </div>
                <div className="popup-buttons">
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={closeEdit}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
    );
};

export default UserReviews;