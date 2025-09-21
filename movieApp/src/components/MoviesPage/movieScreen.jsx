

import { useLocation } from 'react-router-dom'
import './movieScreen.css'
import { useEffect } from 'react'
import { useState } from 'react'

function MovieScreen() {
    
    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const location = useLocation()
    const movieId = location.pathname.split("/").pop()

    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`


    const [movieDetails, setMovieDetails] = useState({})

    useEffect(() => {
      fetch(movieDetailsUrl,
        {
          headers : {
            'Authorization': `Bearer ${movieDbApiKey}`,
            'Content-Type': 'application/json;charset=utf-8'
            }
          })
          .then(response => response.json())
          .then(json => {
            console.log(json)

            setMovieDetails(json)
          })
          .catch(err => console.log(err))
    }, [])

    const getMoneyInReadableFormat = (money) => {
      if (money >= 1000000000) {
        return (money / 1000000000).toFixed() + 'B $';
      } else if (money >= 1000000) {
        return (money / 1000000).toFixed() + 'M $';
      } else if (money >= 1000) {
        return (money / 1000).toFixed() + 'K $';
      } else {
        return money + ' $';
      }
    }

    const getApproximatedRating = (rating) => {
      return (rating * 1).toFixed(1)
    }

    return (
      <div className="movie-screen-container">
        <h2>{movieDetails.title}</h2>
        <div className='poster-and-info'>
          <div className='movie-poster-container'>
          {movieDetails.poster_path ? <img className="movie-poster" src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`} alt={movieDetails.title} /> : <div className="no-image-available">No Image Available</div>}
          </div>
          <div className="movie-details">
            <p>{movieDetails.overview}</p>
            <div className="genres-container">
              <p>Genres: </p>
              {movieDetails.genres && movieDetails.genres.map(genre => (
                <span key={genre.id} className="genre-badge">{genre.name} </span>
              ))}
            </div>
            <div className='additional-info'>
              <p>Release Date: {movieDetails.release_date}</p>
              <p>Rating: {getApproximatedRating(movieDetails.vote_average)} / 10</p>
              <p>Runtime: {movieDetails.runtime} minutes</p>
              <p>Budget: {getMoneyInReadableFormat(movieDetails.budget)}</p>
              <p>Revenue: {getMoneyInReadableFormat(movieDetails.revenue)}</p>
              <p>Tagline: {movieDetails.tagline}</p>
              <span>Status: {movieDetails.status}</span>
              <span id='status separator'> | </span>
              <span>Adult: {movieDetails.adult ? 'Yes' : 'No'}</span>
              <div className="homepage-link">
                {movieDetails.homepage && (
                  <a href={movieDetails.homepage} target="_blank" rel="noopener noreferrer">
                    Official Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      
        <div className="movie-screen-back-button-container">
          <button className="movie-screen-back-button" onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    )
}

export default MovieScreen

/*
{movieDetails != null ? (
          <div>
            <h2>{movieDetails.title}</h2>
            <p>{movieDetails.overview}</p>
            <p>Release Date: {movieDetails.release_date}</p>
            <p>Rating: {movieDetails.vote_average} / 10</p>
            </div>
        ) : (
          <p>Loading movie details...</p>
        )}*/