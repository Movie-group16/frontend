import React from 'react'
import './mainScreen.css'

function MainScreen() {
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
        <h2 className="main-screen-title">Movies in finnkino</h2>
        <div className="main-screen-movie-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="main-screen-movie-box" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainScreen