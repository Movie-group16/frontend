import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';


const similiarMovies = ( id ) => {

    const similiarMoviesUrl = `https://api.themoviedb.org/3/movie/id/similar?language=en-US&page=1`

    useEffect(() => {

    }, [])

    return (
        <></>
    )

}

export default similiarMovies