import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { FaRegStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaPencil } from "react-icons/fa6"
import { FaStar } from "react-icons/fa6";
import axios from 'axios';

const reviewShowcase = ( {token} ) => {

    const [reviewText, setReviewText] = useState("")
    const [reviewTitle, setReviewTitle] = useState('')
    //max review score is 5. Shown with stars...
    const [reviewScore, setReviewScore] = useState(0)
    const [hasReview, setHasReview] = useState(false)

    const [editMode, setEditMode] = useState(false)

    const reviewId = useRef(null)

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
          setReviewTitle(reviews[0].review_title)
          setReviewText(reviews[0].review_text)

          reviewId.current = reviews[0].id
        }
      } catch (err) {
        console.error("Error checking favourites:", err)
      }
    }

    const handleReview = async (e) => {
      console.log(`${userId} user id, ${movieId} movie id, ${reviewTitle} review title, ${reviewText} review text, ${reviewScore} review score`)
      e.preventDefault()
      if( hasReview ){
        updateReview(e)
      }
      else{
        postReview(e)
      }
    }

    const postReview = async (e) => {
      e.preventDefault()

      //here try to submit review..
      console.log("review should")
      console.log(`${localStorage.getItem('userId')} is user id`)
      try{
        const response = await axios.post(`${url}/reviews/`, {

          review:{
            user_id: userId,
            movie_id: movieId,
            review_title: reviewTitle,
            review_text: reviewText,
            rating: reviewScore
          }
        })

        console.log(response)
        setHasReview(true)
        reviewId.current = response.data.id
      }
      catch (error){
          alert(error.response?.data?.message || "can't post review")
      }
    }

    const updateReview = async (e) => {
      e.preventDefault()
      console.log("updating review " + reviewId.current)
      console.log(`${url}/reviews/${reviewId.current}`)

      try{
        const response = await axios.put(`${url}/reviews/${reviewId.current}`, {
          review:{
            review_title: reviewTitle,
            review_text: reviewText,
            rating: reviewScore
          }
        })
      }
      catch (error){
          alert(error.response?.data?.message || "can't update review")
      }

    }
    const typeReview = (doesEdit) => {
      return (

        <form className='review' onSubmit={handleReview}>
          <div className='starRating'>
            <p>Your review</p>
            {
            [...Array(5)].map((star, index) => 
              {
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
                }
              )
              }
          </div>
            <input type="text" className='review-title-input' placeholder='Title' value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} />
            <input type="text" className='review-input' placeholder='Write a review...' value={reviewText} onChange={e => setReviewText(e.target.value)}/>
            {
              doesEdit ? (
                <button className='cancel-edit-button' type='button' onClick={(e) => { e.preventDefault(); setEditMode(false)}}>Cancel</button>
              ) : (null)
            }
            <button className='submit-review-button' type='submit'>Submit Review</button>
        </form>
      )
    }

    const showReview = () => {
      return (
        <div className='submitted-review'>
              <h3>Your review:</h3>
              <button className='edit-review-button' type='button' onClick={(e) => { e.preventDefault(); setEditMode(true)}}><FaPencil /></button>
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
              <h4 className='review-title-showcase'>{reviewTitle}</h4>
              <p className='review-showcase'>{reviewText}</p>
          </div>
      )
    }
    
    return (
        !hasReview ? ( typeReview(false) ) : ( editMode ? (typeReview(true)) : (showReview()))
    )
}

export default reviewShowcase