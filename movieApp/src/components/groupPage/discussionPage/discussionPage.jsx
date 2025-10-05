import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function DiscussionPage({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [discussion, setDiscussion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiscussion()
  }, [id])

  const fetchDiscussion = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/discussions/discussion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setDiscussion(response.data)
    } catch (error) {
      console.error('Error fetching discussion:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading discussion...</div>
  if (!discussion) return <div>Discussion not found</div>

  return (
    <div style={{ padding: '2em', color: '#fff' }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{discussion.discussion_title}</h1>
      <p>{discussion.discussion_text}</p>
      {/* Add more discussion content here */}
    </div>
  )
}

export default DiscussionPage