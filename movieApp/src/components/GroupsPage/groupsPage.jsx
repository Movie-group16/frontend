import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './groupsPage.css'

function GroupsPage() {
  const [activeTab, setActiveTab] = useState('search')
  const [groups, setGroups] = useState([])
  const [myGroups, setMyGroups] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredGroups, setFilteredGroups] = useState([])
  const [joinRequests, setJoinRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate()
  const backendUrl = 'http://localhost:3001'
  const userId = Number(localStorage.getItem('userId'))

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${backendUrl}/groups`)
        setGroups(res.data)
      } catch (err) {
        console.error('Error fetching groups:', err)
      }
    }
    fetchGroups()
  }, [])

  useEffect(() => {
  const fetchMyGroups = async () => {
    try {
      const res = await axios.get(`${backendUrl}/groups/memberships`)
      
      const my = res.data.filter(g => 
        g.owner_id === Number(userId) || 
        (g.user_id === Number(userId) && g.status === 'member')
      );

      setMyGroups(my);
    } catch (err) {
      console.error('Error fetching my groups:', err);
    }
  }
  fetchMyGroups()
}, [userId])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredGroups([])
    } else {
      const filtered = groups.filter(g =>
        g.group_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredGroups(filtered)
    }
  }, [searchTerm, groups])

  const sendJoinRequest = async (groupId) => {
  try {
    await axios.post(`${backendUrl}/groups/${groupId}/members`, {
      userId: Number(userId),
      status: 'pending'
    });

    setPendingRequests(prev => [...prev, groupId])

    alert('Join request sent!');
  } catch (err) {
    console.error('Error sending join request:', err)
    alert('Failed to send join request.');
  }
}

useEffect(() => {
  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get(`${backendUrl}/groups/memberships`);
      const pending = res.data
        .filter(g => g.user_id === Number(userId) && g.status === 'pending')
        .map(g => g.group_id);
      setPendingRequests(pending);
    } catch (err) {
      console.error('Error fetching pending requests:', err)
    }
  }

  fetchPendingRequests()
}, [userId])

  const handleCreateGroup = () => {
    navigate('/groups/create')
  }

  const renderGroupCard = (group, showJoin = false) => {
    const isOwner = group.owner_id === Number(userId)
    const hasRequested = joinRequests.includes(group.id);

    return (
      <div className="group-card" key={group.id}>
      <p><strong>Name:</strong> {group.group_name}</p>
      <p><strong>Description:</strong> {group.group_desc}</p>
      <p><strong>Rules:</strong> {group.group_rules}</p>

      {showJoin && !isOwner && (
        pendingRequests.includes(group.id) ? (
          <button className="request-sent-btn" disabled>Request Sent</button>
        ) : (
          <button className="join-btn" onClick={() => sendJoinRequest(group.id)}>
            Send Join Request
          </button>
        )
      )}

      {isOwner && (
        <div>
          <p className="owner-label">(You are the owner)</p>
          <button 
            className="go-to-group-btn" 
            onClick={() => navigate(`/groups/${group.id}`)}
          >
            Go to Group
          </button>
        </div>
      )}
    </div>
  )
}

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="groups-content">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search groups..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="group-list">
              {!searchTerm ? (
                <p className="no-search-text">Search groups for details.</p>
              ) : filteredGroups.length === 0 ? (
                <p className="no-results">No groups found.</p>
              ) : (
                filteredGroups.map((g) => (
                  <React.Fragment key={g.id}>
                    {renderGroupCard(g, true)}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        )

      case 'mygroups':
  return (
    <div className="groups-content single-column">
      <h3>My Groups</h3>
      {myGroups.length === 0 ? (
        <p>You haven't joined or created any groups yet.</p>
      ) : (
        <div className="group-list">
          {myGroups.map((g) => (
            <React.Fragment key={g.group_id || g.id}>
              {renderGroupCard(g)}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )


      case 'discover':
  const newGroups = groups.filter(g => g.owner_id !== Number(userId));
  return (
    <div className="groups-content single-column">
      <h3>Discover New Groups</h3>
      <div className="group-list">
        {newGroups.length === 0 ? (
          <p className="no-results">No new groups available.</p>
        ) : (
          newGroups.map(g => (
            <React.Fragment key={g.id}>
              {renderGroupCard(g, true)}
            </React.Fragment>
          ))
        )}
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
        <button
          className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`nav-btn ${activeTab === 'mygroups' ? 'active' : ''}`}
          onClick={() => setActiveTab('mygroups')}
        >
          My Groups
        </button>
        <button
          className={`nav-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
      </div>

      <div className="create-group-container">
        <button className="create-group-btn" onClick={handleCreateGroup}>
          Create New Group
        </button>
      </div>

      {renderContent()}
    </div>
  )
}

export default GroupsPage