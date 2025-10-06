import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './discussionPage.css'

function DiscussionPage({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [discussion, setDiscussion] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchDiscussion()
    fetchComments()
  }, [id])

  const fetchDiscussion = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/discussions/discussion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const userResponse = await axios.get(`http://localhost:3001/user/${response.data.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setDiscussion({
        ...response.data,
        username: userResponse.data.username
      })
    } catch (error) {
      console.error('Error fetching discussion:', error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/discussions/discussion/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const commentsWithUsernames = await Promise.all(
        response.data.map(async (comment) => {
          try {
            const userResponse = await axios.get(`http://localhost:3001/user/${comment.user_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            return {
              ...comment,
              username: userResponse.data.username
            }
          } catch (err) {
            return {
              ...comment,
              username: 'Unknown User'
            }
          }
        })
      )
      
      setComments(commentsWithUsernames)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      await axios.put(`http://localhost:3001/comment/${commentId}/like`, {
        userId: userId,
        action: 'like'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchComments() 
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleDislikeComment = async (commentId) => {
    try {
      await axios.put(`http://localhost:3001/comment/${commentId}/dislike`, {
        userId: userId,
        action: 'dislike'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchComments() 
    } catch (error) {
      console.error('Error disliking comment:', error)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      await axios.post(`http://localhost:3001/discussions/comment/create`, {
        discussion_id: id,
        userId: userId,
        comment_text: newComment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="discussion-page">Loading discussion...</div>
  if (!discussion) return <div className="discussion-page">Discussion not found</div>

  return (
    <div className="discussion-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Group
      </button>

      <div className="main-discussion-post">
        <div className="post-header">
          <h1 className="discussion-title">{discussion.discussion_title}</h1>
        </div>
        
        <div className="post-content">
          <p className="discussion-text">{discussion.discussion_text}</p>
        </div>
        
        <div className="post-actions">
          <div className="vote-buttons">
            <button 
              className="vote-btn upvote"
              onClick={() => handleLikeComment(discussion.id)}
            >
              👍 {discussion.likes || 0}
            </button>
            <button 
              className="vote-btn downvote"
              onClick={() => handleDislikeComment(discussion.id)}
            >
              👎 {discussion.dislikes || 0}
            </button>
          </div>
          <span className="comment-count">{comments.length} comments</span>
        </div>
      </div>
      <div className="create-post-container">
        <form onSubmit={submitComment} className="create-post-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="post-text-input"
            rows="4"
            disabled={submitting}
          />
          <button 
            type="submit" 
            className="post-submit-btn"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
      <div className="comments-section">
        <h3 className="comments-header">Comments ({comments.length})</h3>
        
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.username}</span>
                </div>
                
                <div className="comment-content">
                  <p className="comment-text">{comment.comment_text}</p>
                </div>
                
                <div className="comment-actions">
                  <div className="comment-votes">
                    <button 
                      className="vote-btn upvote small"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      👍 {comment.likes || 0}
                    </button>
                    <button 
                      className="vote-btn downvote small"
                      onClick={() => handleDislikeComment(comment.id)}
                    >
                      👎 {comment.dislikes || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionPage