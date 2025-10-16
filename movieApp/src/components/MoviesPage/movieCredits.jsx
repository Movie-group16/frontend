import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const movieCredits = (id) => {

    const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
    const creditUrl = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`

    const [cast, setCast] = useState([])
    const [crew, setCrew] = useState([])

    const directors = crew.filter(c => c.job === "Director")
    const actors = cast.filter(c => c.known_for_department === "Acting")

    useEffect(() => {
        fetch(creditUrl,
            {
                headers : {
                    'Authorization': `Bearer ${movieDbApiKey}`,
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                setCast(json.cast)
                setCrew(json.crew)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className='credits'>
            <div className='directors'>
                <h3>Directing</h3>
                {directors.map(d => (
                    <p key={d.id}>{d.name}</p>
                ))}
            </div>
            <div className='Actors'>
                <h3>Cast</h3>
                {actors.slice(0,5).map(a => (
                    <p key={a.id}>{a.name}</p>
                ))}
            </div>
        </div>
    )
}

export default movieCredits