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
  const [pendingRequests, setPendingRequests] = useState([])
  const [receivedInvites, setReceivedInvites] = useState([])
  const [invitedGroupIds, setInvitedGroupIds] = useState([])
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

  const fetchMyGroups = async () => {
    try {
      const res = await axios.get(`${backendUrl}/groups/memberships`)
      const my = res.data
        .map(g => ({
          id: g.group_id || g.id,
          group_name: g.group_name,
          group_desc: g.group_desc,
          group_rules: g.group_rules,
          owner_id: g.owner_id,
          user_id: g.user_id,
          status: g.status
        }))
        .filter(g =>
          g.owner_id === userId || (g.user_id === userId && g.status === 'member')
        )

      setMyGroups(my)
    } catch (err) {
      console.error('Error fetching my groups:', err)
    }
  }

  useEffect(() => {
    fetchMyGroups()
  }, [userId])

    const fetchReceivedInvites = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${backendUrl}/groups/user/${userId}/invitations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setReceivedInvites(res.data)
        setInvitedGroupIds(res.data.map(invite => invite.group_id))
      } catch (err) {
        console.error('Error fetching invitations:', err)
      }
    }

    useEffect(() => {
    fetchReceivedInvites()
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

    const fetchPendingRequests = async () => {
      try {
        const res = await axios.get(`${backendUrl}/groups/memberships`)
        const pending = res.data
          .filter(g => g.user_id === Number(userId) && g.status === 'pending')
          .map(g => g.group_id)
        setPendingRequests(pending)
      } catch (err) {
        console.error('Error fetching pending requests:', err)
      }
    }

    useEffect(() => {
    fetchPendingRequests()
  }, [userId])

  const sendJoinRequest = async (groupId) => {
    try {
      await axios.post(`${backendUrl}/groups/${groupId}/members`, {
        userId: Number(userId),
        status: 'pending'
      })
      setPendingRequests(prev => [...prev, groupId])

      alert('Join request sent!')

      fetchPendingRequests()
      fetchMyGroups()
      fetchReceivedInvites()
    } catch (err) {
      console.error('Error sending join request:', err)
      alert('Failed to send join request.')
    }
  }

  const acceptInvite = async (inviteId, groupId, invite) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${backendUrl}/groups/${groupId}/invite/${inviteId}/accept`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('You joined the group successfully!')

      setReceivedInvites(prev => prev.filter(i => i.invite_id !== inviteId))
      setInvitedGroupIds(prev => prev.filter(id => id !== groupId))

      setMyGroups(prev => [
        ...prev,
        {
          id: groupId,
          group_id: groupId,
          group_name: invite.group_name,
          group_desc: invite.group_desc,
          group_rules: invite.group_rules,
          owner_id: invite.owner_id,
          user_id: userId,
          status: 'member'
        }
      ])

      fetchMyGroups()
      fetchPendingRequests()
      fetchReceivedInvites()
    } catch (err) {
      console.error('Error accepting invite:', err)
      alert('Failed to join the group.')
    }
  }

  const declineInvite = async (inviteId, groupId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${backendUrl}/groups/${groupId}/invite/${inviteId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Invitation declined.')

      setReceivedInvites(prev => prev.filter(i => i.invite_id !== inviteId))
      setInvitedGroupIds(prev => prev.filter(id => id !== groupId))
    } catch (err) {
      console.error('Error declining invite:', err)
      alert('Failed to decline invite.')
    }
  }

  const handleCreateGroup = () => {
    navigate('/groups/create')
  }

  const renderGroupCard = (group, showJoin = false) => {
    const groupId = group.id || group.group_id
    const isOwner = group.owner_id === Number(userId)
    const isMember = myGroups.some(g => (g.id || g.group_id) === groupId && g.status === 'member')

    return (
      <div className="group-card" key={groupId}>
        <p><strong>Name:</strong> {group.group_name}</p>
        <p><strong>Description:</strong> {group.group_desc}</p>
        <p><strong>Rules:</strong> {group.group_rules}</p>

        <div className="group-actions">
          {showJoin && !isOwner && !isMember && (
            invitedGroupIds.includes(groupId) ? (
              <p className="invited-label">You have been invited to this group</p>
            ) : pendingRequests.includes(groupId) ? (
              <button className="join-request-sent-btn" disabled>
                Request Sent
              </button>
            ) : (
              <button className="send-join-btn" onClick={() => sendJoinRequest(groupId)}>
                Send Join Request
              </button>
            )
          )}

          {isOwner && (
            <>
              <p className="owner-label">(You are the owner)</p>
              <button 
                className="go-to-group-btn" 
                onClick={() => navigate(`/groups/${groupId}`)}
              >
                Go to Group
              </button>
            </>
          )}

          {!isOwner && isMember && (
            <>
              <p className="member-label">(You are a member)</p>
              <button 
                className="go-to-group-btn" 
                onClick={() => navigate(`/groups/${groupId}`)}
              >
                Go to Group
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        const uniqueFilteredGroups = Array.from(
          new Map(filteredGroups.map(g => [g.id, g])).values()
        )
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
                uniqueFilteredGroups.map((g, index) => (
                  <React.Fragment key={`${g.id}-${index}`}>
                    {renderGroupCard(g, true)}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        )

      case 'mygroups':
        const uniqueMyGroups = Array.from(new Map(myGroups.map(g => [g.id, g])).values())
        return (
          <div className="groups-content single-column">
            <h3>My Groups</h3>
            {uniqueMyGroups.length === 0 ? (
              <p>You haven't joined or created any groups yet.</p>
            ) : (
              <div className="group-list">
                {uniqueMyGroups.map(g => renderGroupCard(g))}
              </div>
            )}
          </div>
        )

      case 'discover':
        const discoverGroups = groups.filter(g => {
          const isOwner = g.owner_id === userId
          const isMember = myGroups.some(mg => mg.group_id === g.id || mg.id === g.id)
          const isPending = pendingRequests.includes(g.id)
          const isInvited = invitedGroupIds.includes(g.id)

          return !isOwner && !isMember && !isPending && !isInvited
        })

        return (
          <div className="groups-content single-column">
            <h3>Discover New Groups</h3>
            <div className="group-list">
              {discoverGroups.length === 0 ? (
                <p className="no-results">No new groups available.</p>
              ) : (
                discoverGroups.map(g => renderGroupCard(g, true))
              )}
            </div>
          </div>
        )

      case 'invitations':
        return (
          <div className="groups-content single-column">
            <h3>Invitations</h3>
            {receivedInvites.length === 0 ? (
              <p className="no-results">You have no pending invitations.</p>
            ) : (
              <div className="group-list">
                {receivedInvites.map(invite => (
                  <div key={invite.invite_id} className="group-card">
                    <p><strong>Name:</strong> {invite.group_name}</p>
                    <p><strong>Description:</strong> {invite.group_desc}</p>
                    <p><strong>Invited by:</strong> {invite.invited_by_name || 'Unknown'}</p>
                    <div className="invite-actions">
                      <button
                        className="invite-accept-btn"
                        onClick={() => acceptInvite(invite.invite_id, invite.group_id, invite)}
                      >
                        Accept
                      </button>
                      <button
                        className="invite-decline-btn"
                        onClick={() => declineInvite(invite.invite_id, invite.group_id)}
                      >
                        Decline
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

   useEffect(() => {
    fetchMyGroups()
    fetchPendingRequests()
    fetchReceivedInvites()
  }, [activeTab])

  return (
    <div className="groups-page">
      <div className="groups-nav">
        {[
          { key: 'search', label: 'Search' },
          { key: 'mygroups', label: 'My Groups' },
          { key: 'discover', label: 'Discover' },
          { key: 'invitations', label: 'Invitations' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
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