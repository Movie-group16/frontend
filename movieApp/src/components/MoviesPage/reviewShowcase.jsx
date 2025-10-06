import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { FaRegStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import axios from 'axios';

const reviewShowcase = ( {token} ) => {

    const [reviewText, setReviewText] = useState("")
    //max review score is 5. Shown with stars...
    const [reviewScore, setReviewScore] = useState(0)
    const [hasReview, setHasReview] = useState(false)

    const location = useLocation()
    const movieId = location.pathname.split("/").pop()

    const url = 'http://localhost:3001'
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
      try {
        console.log("user id " + userId + ` ${url}/reviews/${userId}`)
        const res = await axios.get(`${url}/reviews/${userId}/${movieId}`)
        const reviews = res.data

        if( reviews[0] && reviews[0].movie_id === Number(movieId)){

          console.log("has review")
          setHasReview(true)
          setReviewScore(reviews[0].rating)
          setReviewText(reviews[0].review_text)
        }
      } catch (err) {
        console.error("Error checking favourites:", err)
      }
    }

    const handleReview = async (e) => {
      e.preventDefault()

      //here try to submit review..
      console.log("review should")
      console.log(`${localStorage.getItem('userId')} is user id`)
      try{
        const response = await axios.post(`${url}/reviews/`, {

          review:{
            user_id: localStorage.getItem('userId'),
            movie_id: movieId,
            review_text: reviewText,
            rating: reviewScore
          }
        })

        console.log(response)

        setHasReview(true)
      }
      catch (error){
          alert(error.response?.data?.message || "can't post review")
      }

    }

    
    return (
        !hasReview ?
            (
                <form className='review' onSubmit={handleReview}>
                <div className='starRating'>
                <p>Your review</p>
                {
                    [...Array(5)].map((star, index) => {
                        index++
                        return(
                            <button
                            type="button"
                            key={index}
                            className={index <= reviewScore ? "star-on" : "star-off"}
                            onClick={() => setReviewScore(index)}>
                            {index <= reviewScore ? (<FaStar />) : <FaRegStar />}
                            </button>
                        )
                    })
                }
                </div>
                 <input type="text" className='review-input' placeholder='Write a review...' value={reviewText} onChange={e => setReviewText(e.target.value)}/>
                  <button className='submit-review-button' type='submit'>Submit Review</button>
                  </form>
                ) :
                (
                <div className='submitted-review'>
                <h3>Your review:</h3>
                {
                     [...Array(5)].map((star, index) => {
                        index++
                        return(
                            <button
                             key={index}
                             className={index <= reviewScore ? "star-on" : "star-off"}>
                             {index <= reviewScore ? (<FaStar />) : <FaRegStar />}
                             </button>
                            )
                        })
                    
                }
                <p className='review-showcase'>{reviewText}</p>
                </div>
            )
    )
}

export default reviewShowcase