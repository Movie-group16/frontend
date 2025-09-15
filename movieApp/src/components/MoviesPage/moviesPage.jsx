import React from 'react'
import './moviesPage.css'

function MoviesPage() {
  return (
    <div className="movies-page-container">
      <div className="movies-page-content">
        <div className="movies-page-search">
          <input
            type="text"
            placeholder="Search"
            className="movies-page-search-input"
          />
        </div>
        <h2 className="movies-page-title">Movies</h2>
        <div className="movies-page-movie-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="movies-page-movie-box" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MoviesPage