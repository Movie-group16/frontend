import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import "./ProfilePage.css";
import { useNavigate, useLocation } from "react-router-dom";


// Add friend nappi jos ei ole oma profiili. Settings nappi jossa pystyy muokkaamaan bion, nimen, profiilikuvan ja sähköpostin.
// Groupit joissa on näkymä ja jos on favourite laita tähti vieree.
// julkinen ja private profiili settingseihin.

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split("/").pop();
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const backUrl = "http://localhost:3001";
  const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
  const [movieTitles, setMovieTitles] = useState({});
  const [favouriteTitles, setFavouriteTitles] = useState({});

  useEffect(() => {
    if (!userId) return;
    //profiilin tiejot
    axios.get(`${backUrl}/profile/${userId}`)
      .then(res => {
        setUsername(res.data.username || "");
        setBio(res.data.user_desc || "");
        setUserEmail(res.data.email || "");
      })
      .catch(err => {
        console.error("Error loading user:", err);
      })


      axios.get(`${backUrl}/reviews/${userId}`)
      .then(res =>  setReviews(res.data || []))
      .catch(err => console.error("Error loading reviews:", err));


      axios.get(`${backUrl}/favourites/user/${userId}/favourites`)
      .then(res => setFavourites(res.data || []))
      .catch(err => console.error("Error loading favourites:", err));

  }, [userId]);

  // Titlet arvosteltuille elokuville
  useEffect(() => {
  
    const fetchTitles = async () => {
      const titles = {};

      for (const review of reviews.slice(0,5)) {
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
      setMovieTitles(titles);
    };

    fetchTitles();
  }, [reviews, movieDbApiKey]);

  // Titlet favouriteille
useEffect(() => {
  
    const fetchFavouriteTitles = async () => {
      const titles = {};

      for (const favourite of favourites.slice(0,5)) {
        try {
          const response = await fetch(
          `https://api.themoviedb.org/3/movie/${favourite.movie_id}?language=en-US`,
          {
            headers: {
              'Authorization': `Bearer ${movieDbApiKey}`,
              'Content-Type': 'application/json;charset=utf-8'
            }
          }
        );
        
        const data = await response.json();
        titles[favourite.movie_id] = data.title || "Unknown Title";
        } catch (error) {
          console.error("Error fetching title:", favourite.movie_id, error);
          titles[favourite.movie_id] = "Unknown Title"
        }
      }

      setFavouriteTitles(titles);
    };

    fetchFavouriteTitles();
  }, [favourites, movieDbApiKey]);

  const saveBio = () => {
    if (!userId) return;
  try{
  axios.put(`${backUrl}/profile/${userId}/description`, { description: bio });
    console.log("Bio saved successfully");
  } catch (err) { console.error("Error saving description:", err); }
  };

  const goToReviews = () => {
    navigate(`/reviews/${userId}`, {state: { user: username, reviews}});
  };

  return (
  <div className='profile'>
      <h1>Profile Page</h1>
      <div className='header'>
        <img
        src='src\assets\Profiili kuva.webp'
        alt='profile'
        className='profilepic'
        />
      </div>
      <h2 className="name">{username}</h2>
      <h3 className="email">{userEmail}</h3>
      <textarea className='bio'
        value={bio}
        onChange= {(e) => setBio(e.target.value)}
        placeholder="Write something about yourself..."
        rows={4}
      />
      <button onClick={saveBio} className='"saveBtn'>Save Bio</button>
    <div className='sections'>
      <div className='reviewBox'>
        <h3>Latest reviews</h3>
      <ul>
            {reviews.slice(0, 5).map((review) => (
              <li key={review.id}>
                <strong> Movie Title: {movieTitles[review.movie_id] || "Loading..."} </strong>{" "} <br />
                - Rating: {review.rating}/5 <br />
                {review.review_text}
                </li>
            ))}
          </ul>
          <button onClick={goToReviews}>All Reviews</button>
      </div>
      <div className='movieBox'>
        <h3>Favourite Movies</h3>
        <ul>
          {favourites.slice(0,5).map((favourite) => (
            <li key={favourite.id || favourite.movie_id}>
              <strong>
              Movie Title: {favouriteTitles[favourite.movie_id] || "Loading..."}
              </strong>
              </li>
          ))}
        </ul>
        
      </div>
    </div>
  </div>
  );
}

export default ProfilePage