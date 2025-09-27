import React from 'react'
import { useEffect, useState } from 'react'
import './favouritesPage.css'

function FavouritesPage() {
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)
  
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`http://localhost:3001/favourites/user/${userId}/favourites`)
        if (!res.ok) throw new Error("Failed to fetch favourite movies")
        const data = await res.json()
        setFavourites(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFavourites()
  }, [userId])

  const removeFavourite = async (movieId) => {
    try {
      const res = await fetch(`http://localhost:3001/favourites/users/${userId}/favourites/${movieId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete the favourite")

      setFavourites(favourites.filter((movie) => movie.movie_id !== movieId))
    } catch (err) {
      console.error(err);
      alert("Failed to remove the favourite")
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
            <li key={movie.movie_id} className='favourite-movie'>
              <span className='movie-id'>
                {`Movie #${movie.movie_id}`}
              </span>
              <button className='remove-btn' 
              onClick={() => removeFavourite(movie.movie_id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
    
export default FavouritesPage
