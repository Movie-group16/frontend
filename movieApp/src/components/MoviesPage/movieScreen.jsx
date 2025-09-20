


import React from 'react'
import './movieScreen.css'
import { useEffect } from 'react'

function MovieScreen() {
    
    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY

  useEffect(() => {
    
    fetch('https://api.themoviedb.org/3/search/movie?query=Lord%20of%20the%20rings&include_adult=false&language=en-US&page=1',
      {
      headers : {
        'Authorization': `Bearer ${movieDbApiKey}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))

  }, [])

  return (
    <div className="main-screen-container">
      <div className="main-screen-content">
        <div className="main-screen-search">
          <input
            type="text"
            placeholder="Search"
            className="main-screen-search-input"
          />
        </div>
        <h2 className="main-screen-title">Movies in shit</h2>

        <div className="main-screen-movie-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="main-screen-movie-box" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieScreen