import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './groupsPage.css'

function GroupsPage() {
  const [activeTab, setActiveTab] = useState('search')
  const [groups, setGroups] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const userId = localStorage.getItem('userId')
  const navigate = useNavigate()
  const backendUrl = 'http://localhost:3001'

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${backendUrl}/groups`)
        setGroups(res.data)
      } catch (err) {
        console.error("Error fetching groups:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGroups()
  }, [])

  const filteredGroups = searchTerm
    ? groups.filter(group =>
        group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const myGroups = groups.filter(g => g.owner_id === Number(userId))
  const discoverGroups = groups.filter(g => g.owner_id !== Number(userId))

  const joinGroup = async (groupId) => {
    try {
      await axios.post(`${backendUrl}/groups/${groupId}/members`, { userId })
      alert("You joined the group!")
    } catch (err) {
      console.error("Error joining group:", err)
      alert(err.response?.data?.message || "Failed to join group")
    }
  }

  const sendJoinRequest = async (groupId) => {
  try {
    await axios.post(`${backendUrl}/groups/${groupId}/join-request`, {
      userId
    })
    alert('Join request sent!')
    setGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, requests: [...(g.requests || []), Number(userId)] } : g
    ))
  } catch (err) {
    console.error("Error sending join request:", err)
    alert("Failed to send join request")
  }
}

  const renderGroupCard = (group, showJoin = false) => {
  const isMember = group.members?.includes(Number(userId)) || group.owner_id === Number(userId)

  return (
    <div className="group-card" key={group.id}>
      <p><strong>Name:</strong> {group.group_name}</p>
      <p><strong>Description:</strong> {group.group_desc}</p>
      <p><strong>Rules:</strong> {group.group_rules}</p>

      {showJoin && (
        isMember ? (
          <button className="member-btn" disabled>Member</button>
        ) : hasRequested ? (
          <button className="requested-btn" disabled>Request Sent</button>
        ) : (
          <button className="join-btn" onClick={() => sendJoinRequest(group.id)}>
            Send Join Request
          </button>
        )
      )}
    </div>
  )
}

  const renderContent = () => {
    switch(activeTab) {
      case 'search':
        return (
          <div className="groups-content">
            <div className="groups-search-section">
              <input
                type="text"
                placeholder="Search groups..."
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button
                className="create-group-btn"
                onClick={() => navigate('/groups/create')}
              >
                Create a new group
              </button>
            </div>
            <div className="groups-list">
              {searchTerm
                ? filteredGroups.length > 0
                  ? filteredGroups.map(group => renderGroupCard(group, true))
                  : <p>No groups found.</p>
                : <p>Type something to search for groups</p>
              }
            </div>
          </div>
        )
      case 'myGroups':
        return (
          <div className="groups-content">
            <div className="groups-list">
              {myGroups.length === 0 ? <p>You haven't created any groups yet.</p> : myGroups.map(group => renderGroupCard(group))}
            </div>
          </div>
        )
      case 'discover':
        return (
          <div className="groups-content">
            <div className="groups-list">
              {discoverGroups.length === 0 ? <p>No new groups available.</p> : discoverGroups.map(group => renderGroupCard(group, true))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="groups-page">
      <div className="groups-nav">
        <button className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>Search</button>
        <button className={`nav-btn ${activeTab === 'myGroups' ? 'active' : ''}`} onClick={() => setActiveTab('myGroups')}>My Groups</button>
        <button className={`nav-btn ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => setActiveTab('discover')}>Discover</button>
      </div>
      {loading ? <p>Loading groups...</p> : renderContent()}
    </div>
  )
}

export default GroupsPage