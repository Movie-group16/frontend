import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './friendsPage.css'

function FriendsPage() {
  const [activeTab, setActiveTab] = useState('search')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [sentRequests, setSentRequests] = useState([])
  const [friendshipStatus, setFriendshipStatus] = useState({})

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (activeTab === 'friends') {
      fetchFriends()
    } else if (activeTab === 'requests') {
      fetchFriendRequests()
    }
  }, [activeTab])

  const fetchFriends = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:3001/friends?userId=${userId}`)
      setFriends(response.data.friends || [])
    } catch (error) {
      console.error('Error fetching friends:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFriendRequests = async () => {
    setLoading(true)
    try {
      console.log('Fetching requests for userId:', userId)
      const response = await axios.get(`http://localhost:3001/friends/requests?userId=${userId}`)
      setFriendRequests(response.data.requests || [])
    } catch (error) {
      console.error('Error fetching friend requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      setSearchResult(null)
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    try {
      const response = await axios.get(`http://localhost:3001/user/${searchTerm}`)
      const users = response.data || []
      const foundUser = users.length > 0 ? users[0] : null
      setSearchResult(foundUser)
      if (users.length > 0) {
        await checkFriendshipStatus(foundUser.id)
      }
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  // const checkSentRequests = async (userId) => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/friends/sent-requests`)
  //     setSentRequests(response.data.requests?.map(req => req.friend_id) || [])
  //   } catch (error) {
  //     console.error('Error fetching sent requests:', error)
  //   }
  // }

  const checkFriendshipStatus = async (friendId) => {
    try {
      const response = await axios.get(`http://localhost:3001/friends/status/${friendId}?userId=${userId}`)
      
      setFriendshipStatus(prev => ({
        ...prev,
        [friendId]: response.data.status
      }))
      
      return response.data.status
    } catch (error) {
      console.error('Error checking friendship status:', error)
      return 'none'
    }
  }

  const addFriend = async (friendId) => {
    try {
      await axios.post('http://localhost:3001/friends/request', {userId, friendId})
      setSentRequests([...sentRequests, friendId])
    } catch (error) {
      console.error('Error sending friend request:', error)
      alert(error.response?.data?.error || 'Failed to send friend request')
    }
  }

  const acceptFriendRequest = async (friendId) => {
    try {
      await axios.put(`http://localhost:3001/friends/accept/${friendId}`, { userId })
      fetchFriendRequests() 
    } catch (error) {
      console.error('Error accepting friend request:', error)
      alert('Failed to accept friend request')
    }
  }

  const rejectFriendRequest = async (friendId) => {
    try {
      await axios.put(`http://localhost:3001/friends/reject/${friendId}`, { userId })
      fetchFriendRequests() 
    } catch (error) {
      console.error('Error rejecting friend request:', error)
      alert('Failed to reject friend request')
    }
  }

  const removeFriend = async (friendId) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      try {
        await axios.delete(`http://localhost:3001/friends/remove/${friendId}`, { data: { userId } })
        fetchFriends() 
      } catch (error) {
        console.error('Error removing friend:', error)
        alert('Failed to remove friend')
      }
    }
  }

  const renderFriendshipButton = (user) => {
    const status = friendshipStatus[user.id]
    
    if (parseInt(userId) === user.id) {
      return <p className="own-profile">This is your own profile</p>
    }
    
    switch (status) {
      case 'friends':
        return (
          <button className="friends-already-btn" disabled>
            You are friends
          </button>
        )
      case 'awaiting':
        return (
          <button 
            className="accept-request-btn"
            onClick={() => acceptFriendRequest(user.id)}
          >
            Accept Request
          </button>
        )
      case 'pending':
        return (
          <button className="request-sent-btn" disabled>
            Request Sent
          </button>
        )
      default:
        return (
          <button 
            className="add-friend-btn"
            onClick={() => addFriend(user.id)}
          >
            Send Friend Request
          </button>
        )
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="friends-content">
            <div className="friends-search-section">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search for users..."
                  className="search-input"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn" disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>
            
            <div className="friends-detail-section">
              {isSearching ? (
                <p>Searching...</p>
              ) : hasSearched ? (
                searchResult ? (
                  <div className="user-profile">
                    <h3>{searchResult.username}</h3>
                    <p>Email: {searchResult.email}</p>
                    {searchResult.user_desc && <p>Bio: {searchResult.user_desc}</p>}
                    <div className="profile-actions">
                      {renderFriendshipButton(searchResult)}
                    </div>
                  </div>
                ) : (
                  <p className="no-results">No users found!</p>
                )
              ) : (
                <p>Search for users to see their profiles</p>
              )}
            </div>
          </div>
        )

      case 'friends':
        return (
          <div className="friends-content single-column">
            <h3>Your Friends</h3>
            {loading ? (
              <p>Loading friends...</p>
            ) : friends.length === 0 ? (
              <p>You don't have any friends yet.</p>
            ) : (
              <div className="friends-list">
                {friends.map(friend => (
                  <div key={friend.id} className="friend-card">
                    <div className="friend-info">
                      <h4>{friend.username}</h4>
                      <p>Email: {friend.email}</p>
                      {friend.user_desc && <p>Bio: {friend.user_desc}</p>}
                      <p className="friends-since">Friends since: {new Date(friend.friends_since).toLocaleDateString()}</p>
                    </div>
                    <div className="friend-actions">
                      <button 
                        className="remove-friend-btn"
                        onClick={() => removeFriend(friend.id)}
                      >
                        Remove Friend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'requests':
        return (
          <div className="friends-content single-column">
            <h3>Friend Requests</h3>
            {loading ? (
              <p>Loading friend requests...</p>
            ) : friendRequests.length === 0 ? (
              <p>No pending friend requests.</p>
            ) : (
              <div className="requests-list">
                {friendRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-info">
                      <h4>{request.username}</h4>
                      <p>Email: {request.email}</p>
                      <p className="requested-at">Requested: {new Date(request.requested_at).toLocaleDateString()}</p>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => acceptFriendRequest(request.id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => rejectFriendRequest(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="friends-page">
      <div className="friends-nav">
        <button 
          className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button 
          className={`nav-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Your Friends
        </button>
        <button 
          className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </button>
      </div>
      
      {renderContent()}
    </div>
  )
}

export default FriendsPage