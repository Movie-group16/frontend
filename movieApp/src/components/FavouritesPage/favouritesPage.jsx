import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './favouritesPage.css'
import axios from 'axios'

function FavouritesPage() {
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)
  const userId = location.pathname.split("/").pop();
  const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY
  const backendUrl = 'http://localhost:3001'
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem("userId");
  const isOwnProfile = parseInt(currentUserId) === parseInt(userId)

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get(`${backendUrl}/favourites/user/${userId}/favourites`)
        const favIds = res.data.map(f => f.movie_id)

        const movieDetails = await Promise.all(
          favIds.map(async (movieId) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
              headers: {
                'Authorization': `Bearer ${tmdbApiKey}`,
                'Content-Type': 'application/json;charset=utf-8',
              }
            })
            return await res.json()
          })
        )

        setFavourites(movieDetails)
      } catch (err) {
        console.error('Error fetching favourites:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFavourites()
  }, [userId, tmdbApiKey])

  const removeFavourite = async (movieId) => {
    try {
      await axios.delete(`${backendUrl}/favourites/users/${userId}/favourites/${movieId}`)
      setFavourites(favourites.filter((movie) => movie.id !== movieId))
    } catch (err) {
      console.error(err)
      alert('Failed to remove favourite from the list')
    }
  }

  if (loading) return <p>Loading favourite movies...</p>

  return (
    <div className='favourites-page'>
      <h2>Favourite movies</h2>
      {favourites.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <ul className='favourites-list'>
          {favourites.map((movie) => (
            <li key={movie.id} className='favourite-movie'>
              <div className='movie-image-wrapper'>
                {movie.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className='movie-image'
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ) : (
                  <div
                    className='no-image'
                    onClick={() => (`/movie/${movie.id}`)}
                  >
                    No image available
                  </div>
                )}
                <div className='movie-overlay'>
                  <span
                    className='movie-title'
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    {movie.title}
                  </span>
                  { isOwnProfile && (
                  <button 
                    className='remove-btn' 
                    onClick={() => removeFavourite(movie.id)}
                  >
                    Remove
                  </button>
                )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FavouritesPage
