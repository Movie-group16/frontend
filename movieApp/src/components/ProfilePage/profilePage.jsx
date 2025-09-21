import React from 'react'
import { useState } from 'react'
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const goToReviews = () => {
    navigate("/reviews", {state: { user: "Jaska era", reviews}});
  };

  const [reviews] = useState([
    {
      title: "Porkkana 1",
      image: "src\assets\Profiili kuva.webp",
      rating: 3,
      text: "cool and gdafdood movie..."
    },
    {
      title: "Porkkana 2",
      image: "src\assets\react.svg",
      rating: 1,
      text: "cool and good movie.."
    },
    {
      title: "Porkkana 3",
      image: "src\assets\react.svg",
      rating: 4,
      text: "cool and good movie."
    },
    {
      title: "Porkkana 4",
      image: "src\assets\react.svg",
      rating: 2,
      text: "good movie..."
    },
    {
      title: "Porkkana 5",
      image: "src\assets\react.svg",
      rating: 3,
      text: "cool movie..."
    }
  ]);

  const [favourites] = useState([
    'Movie 1',
    'Movie 2',
    'Movie 3',
    'Movie 4',
    'Movie 5'
  ]);

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
      <h2 className='name'>Jaska era</h2>
      <p className='bio'>
        Something important and other stuff, basically bio.
      </p>
     
    
    <div className='sections'>
      <div className='reviewBox'>
        <h3>Reviews</h3>
      <ul>
            {reviews.map((review, index) => (
              <li key={index}>{review.title}</li>
            ))}
          </ul>
          <button onClick={goToReviews}>All Reviews</button>
      </div>
      <div className='movieBox'>
        <h3>Favourite Movies</h3>
        <ul>
          {favourites.map((movie, index) => (
            <li key={index}>{movie}</li>
          ))}
        </ul>
        
      </div>
    </div>
  </div>
  );
}

export default ProfilePage