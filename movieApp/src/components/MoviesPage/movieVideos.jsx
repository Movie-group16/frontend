import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';

const movieVideos = (id) => {

    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const movieVidsUrl = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`

    const [movieVids, setMovieVids] = useState({})

    const getVideo = () => {
      if(movieVids.results){
        if(movieVids.results.length === 0) return ''
        else{
          try{
            return movieVids.results[0].site === 'YouTube' ? `https://www.youtube.com/embed/${movieVids.results[0].key}` : ''
          }
          catch(err){
            return ''
          }
        }
        
      }

      return ''
    }

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
          })
          .catch(err => console.log(err))
    }, [])


    return (
        <div className='movie-vids'>
          {
            getVideo() === '' ? <p>No videos available</p> 
            : 
            (
              <iframe 
              width="560" 
              height="315"
              src={getVideo()}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
              </iframe>
            )
          }
        </div>
    )
}

export default movieVideos