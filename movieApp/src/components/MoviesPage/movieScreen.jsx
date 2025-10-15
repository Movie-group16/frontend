

import { useLocation } from 'react-router-dom'
import './movieScreen.css'
import { useEffect } from 'react'
import { useState } from 'react'

import axios from 'axios';
import movieVideos from './movieVideos'
import reviewShowcase from './reviewShowcase';
import similiarMovies from './similiarMovies';
import MoviePics from './moviePics';
import ratingToStars from './ratingToStars';
import movieCredits from './movieCredits';

function MovieScreen( {token} ) {
    
    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const location = useLocation()
    const movieId = location.pathname.split("/").pop()

    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`

    const url = 'http://localhost:3001'
    const userId = localStorage.getItem('userId')

    const [movieDetails, setMovieDetails] = useState({})
    const [isFavourite, setIsFavourite] = useState(false)
    
    useEffect(() => {
      fetchFavourites()

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

    const fetchFavourites = async () => {
      try {
        const res = await axios.get(`${url}/favourites/user/${userId}/favourites`)
        const favs = res.data.map(f => f.movie_id)
        setIsFavourite(favs.includes(Number(movieId)))
      } catch (err) {
        console.error("Error checking favourites:", err)
      }
    }
    const getMoneyInReadableFormat = (money) => {

      switch(money){
        case 0:
          return 'N/A'
        case null:
          return 'N/A'
        case undefined:
          return 'N/A'
      }

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


    const handleFavourite = async (e) => {
      e.preventDefault()   
      try {
        await axios.post(`${url}/favourites/users/${userId}/favourites/${movieId}`)
        setIsFavourite(true)
      } catch (error) {
        alert(error.response?.data?.message || "Can't add favourite")
      }
  }

  const additionalInfo = () => {
    return (
    <div className='additional-info'>
      <p className='tagline'>"{movieDetails.tagline}"</p>
      <div className='rating'>{ratingToStars(getApproximatedRating(movieDetails.vote_average))}</div>
      <span id='separator'/>
      <p>Runtime: {movieDetails.runtime} minutes</p>
      <p>Release Date: {movieDetails.release_date}</p>
      <p>Budget: {getMoneyInReadableFormat(movieDetails.budget)}</p>
      <p>Revenue: {getMoneyInReadableFormat(movieDetails.revenue)}</p>
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
      <span id='separator' />
      {movieCredits(movieId)}
      <div className="production-companies">
        <p>Production Companies:</p>
        <div className="production-companies-list">
          {movieDetails.production_companies && movieDetails.production_companies.map(company => (
            <div key={company.id} className="production-company">
              {company.logo_path ? <img className="company-logo" src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} alt={company.name} /> 
              : <div className="no-logo-available">{company.name}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const loggedInFeatures = () => {
    return (
      token ? (
      <div className='favourite-and-review'>
        <form className='favourite' onSubmit={handleFavourite}> 
           <button
           className='add-to-favourites-button'
           type='submit'
           disabled={isFavourite}
           >
            {isFavourite ? 'Added to favourites' : 'Add to favourites'}
            </button>
            </form>
            { reviewShowcase(token) }
            </div>
            ) : (
            <p>Log in to add to favourites</p>
        )
    )
  }

    return (
      <div className="movie-screen-container">
        <h2>{movieDetails.title}</h2>
        <div className='poster-and-info'>
          
          <div className="movie-details">
            <div className='overview'>
              <div className='movie-poster-container'>
              {movieDetails.poster_path ? <img className="movie-poster" src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`} alt={movieDetails.title} /> 
              : <div className="no-image-available">No Image Available</div>}
              {additionalInfo()}
            </div>
            <div className='overview-and-review'>
              <p>{movieDetails.overview}</p>
              <div className="genres-container">
                  <p>Genres: </p>
                  {movieDetails.genres && movieDetails.genres.map(genre => (
                  <span key={genre.id} className="genre-badge">{genre.name} </span>
                  ))}
              </div>
              <div className='logged-in-features'>
                {loggedInFeatures()}
              </div>
              <div className='videos'>
                {movieVideos(movieId)}
              </div>
              <div className='movie-pics-section'>
              <h3>Movie Pictures</h3>
              <MoviePics id={movieId}/>
              </div>
              
              
              
              <div className='similiar-movies'>
                <h3>Similiar Movies</h3>
                {similiarMovies(movieId)}
              </div>
              
          </div>
        </div>
        </div>
        </div>
        <div className="movie-screen-back-button-container">
          <button className="movie-screen-back-button" onClick={() => window.location = `/`}>Go Back</button>
        </div>
      </div>
    )
}

export default MovieScreen