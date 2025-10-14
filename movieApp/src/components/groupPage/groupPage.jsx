import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './groupPage.css'

function GroupPage({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [discussions, setDiscussions] = useState([])
  const [activeTab, setActiveTab] = useState('discussions')
    const [newPost, setNewPost] = useState({
    title: '',
    text: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchGroupDetails()
  }, [id])

  useEffect(() => {
    if (group) {
      if (activeTab === 'discussions') {
        fetchDiscussions()
      }
    }
  }, [group, activeTab])

  const fetchGroupDetails = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }

        const response = await axios.get(`http://localhost:3001/groups/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const groupData = response.data

        if (groupData.owner_id) {
            const ownerResponse = await axios.get(`http://localhost:3001/user/${groupData.owner_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            groupData.owner_name = ownerResponse.data.username || 'Unknown'
        }

        setGroup(groupData)
    } catch (error) {
        console.error('Error fetching group details:', error)
        setError('Failed to load group details')
    } finally {
        setLoading(false)
    }
  }

  const fetchDiscussions = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }

        const response = await axios.get(`http://localhost:3001/discussions/${group.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const discussionData = response.data

        for (const discussion of discussionData) {
          const userResponse = await axios.get(`http://localhost:3001/user/${discussion.user_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
          })
          discussion.username = userResponse.data.username || 'Unknown'

          try {
            const commentsResponse = await axios.get(`http://localhost:3001/discussions/discussion/${discussion.id}/comments`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            discussion.comment_count = commentsResponse.data.length
          } catch (error) {
            console.error('Error fetching comments for discussion:', discussion.id, error)
            discussion.comment_count = 0
          }
        }
        
        setDiscussions(discussionData)
    } catch (error) {
        console.error('Error fetching discussions:', error)
        setError('Failed to load discussions')
    }
  }

  const joinGroup = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`http://localhost:3001/groups/${id}/join`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      alert('Successfully joined the group!')
      fetchGroupDetails() 
    } catch (error) {
      console.error('Error joining group:', error)
      alert('Failed to join group')
    }
  }

  const handleLikeDiscussion = async (discussionId) => {
    try {
      const response = await fetch(`http://localhost:3001/discussions/discussion/${discussionId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: parseInt(userId) })
      })
      const data = await response.json()

      fetchDiscussions()
    } catch (error) {
      console.error('Error liking discussion:', error)
    }
  }

  const handleDislikeDiscussion = async (discussionId) => {
    try {
      const response = await fetch(`http://localhost:3001/discussions/discussion/${discussionId}/dislike`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: parseInt(userId) })
      })   
      const data = await response.json()

      fetchDiscussions()
    } catch (error) {
      console.error('Error disliking discussion:', error)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    
    if (!newPost.title.trim() || !newPost.text.trim()) {
      alert('Please fill in both title and text')
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:3001/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      await axios.post(`http://localhost:3001/discussions/discussion/create`, {
        group_id: group.id,
        user_id: userId,
        discussion_title: newPost.title,
        discussion_text: newPost.text
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setNewPost({ title: '', text: '' })
      
      fetchDiscussions()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteGroup = async () => {
    setConfirmMessage('Are you sure you want to delete this group? This action cannot be undone and will remove all discussions and members.')
    setConfirmAction(() => async () => {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:3001/groups/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            userId: parseInt(userId)
          }
        })
        
        navigate('/groups')
      } catch (error) {
        console.error('Error deleting group:', error)
        alert('Failed to delete group')
      }
    })
    setShowConfirmModal(true)
  }

  const leaveGroup = async () => {
      setConfirmMessage('Are you sure you want to leave this group?')
      setConfirmAction(() => async () => {
          try {         
              await axios.delete(`http://localhost:3001/groups/${id}/leave`, {
                  data: { userId }, 
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              })
              navigate('/groups')
          } catch (error) {
              console.error('Error leaving group:', error)
              alert('Failed to leave group')
          }
      })
      setShowConfirmModal(true)
  }

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction()
    }
    setShowConfirmModal(false)
    setConfirmAction(null)
    setConfirmMessage('')
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
    setConfirmMessage('')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussions':
        return (
          <div className="discussions-list">
            <div className="create-post-container">
              <form onSubmit={handleCreatePost} className="create-post-form">
                <input
                  type="text"
                  placeholder="Write a title for your post..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="post-title-input"
                  disabled={isSubmitting}
                />
                <textarea
                  placeholder="Write a post..."
                  value={newPost.text}
                  onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                  className="post-text-input"
                  rows="4"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="post-submit-btn"
                  disabled={isSubmitting || !newPost.title.trim() || !newPost.text.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </form>
            </div>
            {discussions.length === 0 ? (
              <div className="no-discussions">
                <p>No discussions yet. Be the first to start one!</p>
              </div>
            ) : (
              discussions.map(discussion => (
                <div key={discussion.id} className="discussion-box">
                  <div className="discussion-header">
                    <h4 className="discussion-title">{discussion.discussion_title}</h4>
                    <div className="discussion-meta">
                      <span className="discussion-author">By: {discussion.username || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="discussion-content">
                    <p className="discussion-text">{discussion.discussion_text}</p>
                  </div>
                  <div className="discussion-stats">
                    <div className="likes-dislikes">
                      <button 
                        className="like-btn"
                        onClick={() => handleLikeDiscussion(discussion.id)}
                      >
                        👍 {discussion.likes || 0}
                      </button>
                      <button 
                        className="dislike-btn"
                        onClick={() => handleDislikeDiscussion(discussion.id)}
                      >
                        👎 {discussion.dislikes || 0}
                      </button>
                    </div>
                    <button 
                      className="join-discussion-btn"
                      onClick={() => navigate(`/discussions/discussion/${discussion.id}`)}
                    >
                      Go to Discussion
                    </button>
                  </div>
                  <span className="comment-count">{discussion.comment_count || 0} comments</span>
                </div>
              ))
            )}
          </div>
        )

      case 'movies':
        return (
          <div>
            <div>
              <p>Group movies feature is not implemented yet.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) return <div className="group-page">Loading group details...</div>
  if (error) return <div className="group-page error">{error}</div>
  if (!group) return <div className="group-page">Group not found</div>

  const isOwner = parseInt(userId) === group.owner_id
  const isMember = group.members && group.members.some(member => parseInt(member.id) === parseInt(userId))

  return (
    <div className="group-page">
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Action</h3>
            <p>{confirmMessage}</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="group-layout">
        <div className="page-information">
          <div className="group-avatar">
            <img 
              src="/src/assets/Profiili kuva.webp" 
              alt="Group Avatar" 
              className="group-avatar-image"
            />
          </div>
          <div>
            <p className="group-name">{group.group_name}</p>
            <p className="smaller-text">Owner: {group.owner_name || 'Unknown'}</p>
            <p className="smaller-text">
              Members: {group.member_count || 0}
            </p>
          </div>
          <div className="group-content">
            {group.group_desc && (
              <div className="group-section">
                <h3>Description</h3>
                <p className="group-description">{group.group_desc}</p>
              </div>
            )}

            {group.group_rules && (
              <div className="group-section">
                <h3>Group Rules</h3>
                <div className="group-rules">
                  {group.group_rules.split('\n').map((rule, index) => (
                    <p key={index} className="rule-item">
                      {rule.startsWith('•') ? rule : `• ${rule}`}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="buttons">
            <button className="back-btn" onClick={() => navigate(`/groups/${id}/members`)}>
              View members
            </button>
            
            {isOwner ? (
              <button className="back-btn" onClick={deleteGroup}>
                Delete Group
              </button>
            ) : (
              <button className="back-btn" onClick={leaveGroup}>
                Leave Group
              </button>
            )}
            <button className="back-btn" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>

        <div className="discussions-container">
          <div>
            <button 
              className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussions')}
            >
              Discussions
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}
            >
              Movies
            </button>
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupPage