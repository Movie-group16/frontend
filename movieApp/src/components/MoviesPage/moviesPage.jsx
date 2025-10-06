import React from 'react'
import './moviesPage.css'
import { useEffect } from 'react'
import { useState, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'


function MoviesPage() {

  const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY

  //const previousSearchTerm = useRef('')
  const [movies, setMovies] = useState([])
  const [currentSearchTerm, setCurrentSearchTerm]= useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pageCount, setPageCount] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  //is the filtering applied....
  const [filtering, setFiltering] = useState(false)

  //set start and end datesin filtering
  const primaryReleaseYear = useRef('')

  
  const sort_by = ["",""]

  const [searchType, setSearchType] = useState('')

  const getCurrentPage = () => {return currentPage > 0 ? currentPage : 1}

  const movieSearchUrl = `https://api.themoviedb.org/3/search/movie?query=${currentSearchTerm}&include_adult=false&language=en-US&primary_release_year=${primaryReleaseYear}&page=${getCurrentPage()}`
  const movieDiscoverUrl = `https://api.themoviedb.org/3/discover/movie?&include_adult=false&include_video=false&language=en-USpage=${getCurrentPage()}&sort_by=popularity.desc`
  const popularUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${getCurrentPage()}`
  const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${getCurrentPage()}`
  const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${getCurrentPage()}`
  const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${getCurrentPage()}`


  const searchTypes = ["popular", "top rated", "now playing", "upcoming"]

  const getSearchUrl = (searchTerm, type) => {
    if(searchTerm !== '') return movieSearchUrl

    switch(type){
      case searchTypes[0]:
        return popularUrl
      case searchTypes[1]:
        return topRatedUrl
      case searchTypes[2]:
        return nowPlayingUrl
      case searchTypes[3]:
        return upcomingUrl

      default:
        return popularUrl
    }
  }
  
  const getApproximatedRating = (rating) => {
      return (rating * 1).toFixed(1)
    }
  
  useEffect(() => {
    
    fetch(getSearchUrl(currentSearchTerm, searchType),
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
    }, [currentPage, currentSearchTerm, searchType])

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
          <div className='filtering'>

            <label>Filter search? </label>
            <input type='checkbox' id='filtering' name='filter' value={filtering} onClick={() => setFiltering(!filtering)}/>

            {
              filtering && (
                <div className='dateFilter'>
                  <div className='primaryRelease'>
                    <label>Release year: </label>
                    <input type='number' min='1900' max='2099' id='primaryRelease' onChange={(e) => primaryReleaseYear.current = e.target.value}/>
                  </div>
                </div>
              )
            }

            <div className='emptySearchShowcase'>
              {
                currentSearchTerm === '' && searchTypes.map(item => (
                  <button type='button' key={item} className='emptySearchFilterButton' onClick={() => setSearchType(item)}>{item}</button>
                ))
              }
            </div>

          </div>
          <h2 className="movies-page-title">{(currentSearchTerm === '' ? `${searchType} Movies` : 'Movies')}</h2>
          <div className="movies-page-movie-grid">
            {movies && movies.map(item => (

              <button key = {item.id} type="button" className="movie-button" onClick={() => window.location.href=`/movie/${item.id}`}>
                <div className="movies-page-movie-box" >
                <p className="movie-title">{item.title}</p>
                <div className="movie-poster-container">
                  {
                  item.poster_path ? 
                    <img className="movie-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title} /> 
                    : <div className="no-image-available">No Image Available</div>
                  }
                </div>
              </div>
              <p className="movie-vote">Rating: {getApproximatedRating(item.vote_average)} / 10</p>
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
}

export default MoviesPage