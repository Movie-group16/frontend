import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import './moviePics.css'

const MoviePics = ( {id} ) => {

    //maximum number of pics to show
    const maxPics = 6

    //url to fetch pics
    const moviePicsUrl = `https://api.themoviedb.org/3/movie/${id}/images`

    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    

    const [moviePics, setMoviePics] = useState([])

    useEffect(() => {
        fetch(moviePicsUrl,
        {
          headers : {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json;charset=utf-8'
            }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                setMoviePics(json.backdrops)
            })
            .catch(err => console.log(err))
    }, [])


    return (
        <div className="movie-pics">
            {moviePics.slice(0, maxPics).map((pic, index) => (
                <img 
                className="movie-pic"
                key={index}
                src={`https://image.tmdb.org/t/p/w500${pic.file_path}`} 
                alt={`Movie pic ${index + 1}`} 
                />
            ))}
        </div>
    )
}

export default MoviePics