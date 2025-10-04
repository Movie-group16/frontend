

import { useLocation } from 'react-router-dom'
import './movieScreen.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { FaRegStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import axios from 'axios';
import movieVideos from './movieVideos'
import reviewShowcase from './reviewShowcase';

function MovieScreen( {token} ) {
    
    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const location = useLocation()
    const movieId = location.pathname.split("/").pop()

    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`

    const url = 'http://localhost:3001'
    const userId = localStorage.getItem('userId')

    const [movieDetails, setMovieDetails] = useState({})
    const [reviewText, setReviewText] = useState("")
    //max review score is 5. Shown with stars...
    const [reviewScore, setReviewScore] = useState(0)
    const [isFavourite, setIsFavourite] = useState(false)
    const [hasReview, setHasReview] = useState(false)

    
    
    useEffect(() => {
      
      fetchFavourites()
      //fetchReviews()

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
    
/*
    const fetchReviews = async () => {
      try {
        console.log("user id " + userId + ` ${url}/reviews/${userId}`)
        const res = await axios.get(`${url}/reviews/${userId}/${movieId}`)
        const reviews = res.data

        if( reviews[0] && reviews[0].movie_id === Number(movieId)){

          console.log("has review")
          setHasReview(true)
          setReviewScore(reviews[0].rating)
          setReviewText(reviews[0].review_text)
        }
      } catch (err) {
        console.error("Error checking favourites:", err)
      }
    }*/
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

    const handleReview = async (e) => {
      e.preventDefault()

      //here try to submit review..
      console.log("review should")
      console.log(`${localStorage.getItem('userId')} is user id`)
      try{
        const response = await axios.post(`${url}/reviews/`, {

          review:{
            user_id: localStorage.getItem('userId'),
            movie_id: movieId,
            review_text: reviewText,
            rating: reviewScore
          }
        })

        console.log(response)

        setHasReview(true)
      }
      catch (error){
          alert(error.response?.data?.message || "can't post review")
      }

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

              <div className="production-companies">
                <p>Production Companies:</p>
                <div className="production-companies-list">
                  {movieDetails.production_companies && movieDetails.production_companies.map(company => (
                    <div key={company.id} className="production-company">
                      {company.logo_path ? <img className="company-logo" src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} alt={company.name} /> : <div className="no-logo-available">{company.name}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className='logged-in-features'>
                {token ? (
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
                )}
              </div>

            </div>
            <div className='videos'>
              {movieVideos(movieId)}
            </div>
            <div className='similiarMovies'>

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