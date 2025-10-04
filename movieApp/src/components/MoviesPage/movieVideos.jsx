import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';

const movieVideos = (id) => {

    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const movieVidsUrl = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`

    const [movieVids, setMovieVids] = useState({})
    const [movieVid, setMovieVid] = useState('')

    useEffect(() => {
        fetch(movieVidsUrl,
        {
          headers : {
            'Authorization': `Bearer ${movieDbApiKey}`,
            'Content-Type': 'application/json;charset=utf-8'
            }
          })
          .then(response => response.json())
          .then(json => {
            console.log(json)

            setMovieVids(json)
            setMovieVid(json.results[0].site)
          })
          .catch(err => console.log(err))
    }, [])


    return (
        <div className='movie-vids'>
            <p>{movieVid}</p>
        </div>
    )
}

export default movieVideos