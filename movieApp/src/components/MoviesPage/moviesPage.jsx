import React from 'react'
import './moviesPage.css'
import { useEffect } from 'react'
import { useState, useRef } from 'react'
import ReactPaginate from 'react-paginate'

function MoviesPage() {

  const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY

  //const previousSearchTerm = useRef('')
  const [movies, setMovies] = useState([])
  const [currentSearchTerm, setCurrentSearchTerm]= useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pageCount, setPageCount] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${currentSearchTerm}&include_adult=false&language=en-US&page=${currentPage > 0 ? currentPage : 1}`,
      {
        headers : {
          'Authorization': `Bearer ${movieDbApiKey}`,
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        setTotalResults(json.total_results)
        setPageCount(json.total_pages > 500 ? 500 : json.total_pages)
        setMovies(json.results)
      })
      .catch(err => console.log(err))
    }, [currentPage, currentSearchTerm])

    const handleSubmit = (e) => {
      e.preventDefault()
      if(searchTerm !== currentSearchTerm) {
        setCurrentSearchTerm(searchTerm)
        setCurrentPage(1)
      }
    }

    const handelPageClick = (e) => {
      setCurrentPage(e.selected + 1)
    }

    return (
        <form onSubmit={handleSubmit}>
          <div className="movies-page-container">
          <h3>Movies Page</h3>
          <div className="movies-page-search">
            <input
              type="text"
              placeholder="Search"
              className="movies-page-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h2 className="movies-page-title">Movies</h2>
          <div className="movies-page-movie-grid">
            {movies && movies.map(item => (
              <button key = {item.id} type="button">
                <div className="movies-page-movie-box" >
                <p className="movie-title">{item.title}</p>
                <div className="movie-poster-container">
                {item.poster_path ? <img className="movie-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title} /> : <div className="no-image-available">No Image Available</div>}
                </div>
              </div>
              <p className="movie-vote">Rating: {item.vote_average} / 10</p>
              <p className="movie-release-date">Release date: {item.release_date}</p>
              </button>
            ))}
          </div>

         <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handelPageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="active"
          />
        </div>
      </form>
    )

  /*return (
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
  )*/
}

export default MoviesPage