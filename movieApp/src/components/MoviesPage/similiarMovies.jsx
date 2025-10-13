import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import './similiarMovies.css'

const similiarMovies = ( id ) => {

    const similiarMoviesUrl = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`

    const [similiarMovies, setSimiliarMovies] = useState([])

    const maxSimiliarMovies = 6

    useEffect(() => {
        fetch(similiarMoviesUrl,
        {
          headers : {
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            'Content-Type': 'application/json;charset=utf-8'
            }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                setSimiliarMovies(json.results)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="similiar-movies">
            {similiarMovies.slice(0, maxSimiliarMovies).map((movie) => (
                <button className="similiar-movie" key={movie.id} onClick={() => window.location = `/movie/${movie.id}`}>
                    <p>{movie.title}</p>
                </button>
            ))}
        </div>
    )

}

export default similiarMovies