

import { useLocation } from 'react-router-dom'
import './movieScreen.css'
import { useEffect } from 'react'
import { useState } from 'react'

function MovieScreen() {
    
    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const location = useLocation()
    const movieId = location.pathname.split("/").pop()

    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`


    const [movieTitle, setMovieTitle] = useState('')
    const [movieOverview, setMovieOverview] = useState('')
    const [movieReleaseDate, setMovieReleaseDate] = useState('')
    const [movieRating, setMovieRating] = useState('')
    const [moviePosterPath, setMoviePosterPath] = useState('')
    //const [movieDetails, setMovieDetails] = useState({})

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
            setMovieOverview(json.overview)
            setMovieTitle(json.title)
            setMovieReleaseDate(json.release_date)
            setMovieRating(json.vote_average)
            setMoviePosterPath(json.poster_path)
          })
          .catch(err => console.log(err))
    }, [])


  return (
    <div className="movie-screen-container">
      <h3>Movie Screen</h3>
      <p>Movie details will be shown here.</p>
      <p>Movie ID: {movieId}</p>
      <div className="movie-details">
        <h2>{movieTitle}</h2>
        <p>{movieOverview}</p>
        <p>Release Date: {movieReleaseDate}</p>
        <p>Rating: {movieRating} / 10</p>
        {moviePosterPath ? <img className="movie-poster" src={`https://image.tmdb.org/t/p/w300${moviePosterPath}`} alt={movieTitle} /> : <div className="no-image-available">No Image Available</div>}
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