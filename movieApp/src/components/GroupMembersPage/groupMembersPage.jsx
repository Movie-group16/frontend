import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './groupMembersPage.css'

function GroupMembersPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const userId = Number(localStorage.getItem('userId'))
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [invites, setInvites] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [filteredInvites, setFilteredInvites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroupData()
  }, [id])

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase()
    setFilteredMembers((members || []).filter(m => m.username.toLowerCase().includes(lowerSearch)))
    setFilteredRequests((joinRequests || []).filter(r => r.username.toLowerCase().includes(lowerSearch)))
    setFilteredInvites((invites || []).filter(i => i.username.toLowerCase().includes(lowerSearch)))
  }, [searchTerm, activeTab, members, joinRequests, invites])

  const fetchGroupData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/login')

      const [groupRes, membersRes, requestsRes, invitesRes] = await Promise.all([
        axios.get(`http://localhost:3001/groups/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:3001/groups/${id}/members`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:3001/groups/${id}/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:3001/groups/${id}/invites?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      setGroup(groupRes.data || null)
      setMembers(membersRes.data || [])
      setJoinRequests(requestsRes.data || [])
      setInvites(invitesRes.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching group data:', err)
      setLoading(false)
    }
  }

  const isAdmin = group?.owner_id === userId

  const removeMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3001/groups/${id}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchGroupData()
    } catch (err) {
      console.error('Error removing member:', err)
      alert('Failed to remove member.')
    }
  }

  const acceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:3001/groups/${id}/members/${requestId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchGroupData()
    } catch (err) {
      console.error('Error accepting request:', err)
      alert('Failed to accept request.')
    }
  }

  const cancelRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:3001/groups/${id}/members/${requestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchGroupData()
    } catch (err) {
      console.error('Error cancelling request:', err)
      alert('Failed to cancel request.')
    }
  }

  const sendInvite = async (inviteeId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`http://localhost:3001/groups/${id}/invite/${inviteeId}`, { invitedBy: userId }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchGroupData()
    } catch (err) {
      console.error('Error sending invite:', err)
      alert('Failed to send invite.')
    }
  }

  const viewProfile = (memberId) => {
    navigate(`/profile/${memberId}`)
  }

  if (loading) return <div>Loading group members...</div>
  if (!group) return <div>Group not found</div>

  const renderList = () => {
    switch (activeTab) {
      case 'all':
        return filteredMembers.map((m, index) => (
          <div key={index} className="member-item">
            <span>{m.username}</span>
            <button className="view-profile-btn" onClick={() => viewProfile(m.user_id)}>View profile</button>
            {isAdmin && m.user_id !== userId && (
              <button className="remove-btn" onClick={() => removeMember(m.user_id)}>Remove member</button>
            )}
          </div>
        ))

      case 'requests':
        return filteredRequests.map((r, index) => (
          <div key={index} className="member-item">
            <span>{r.username}</span>
            <button className="accept-btn" onClick={() => acceptRequest(r.user_id)}>Accept</button>
            <button className="cancel-btn" onClick={() => cancelRequest(r.user_id)}>Cancel</button>
          </div>
        ))

      case 'invites':
        return filteredInvites.map((i, index) => (
          <div key={index} className="member-item">
            <span>{i.username}</span>
            <div className="member-actions">
              {isAdmin && (
                <button
                  className="send-invite-btn"
                  onClick={() => sendInvite(i.user_id)}
                  disabled={i.invite_status === 'pending'}
                >
                  {i.invite_status === 'pending' ? 'Invitation Sent' : 'Send Invitation'}
                </button>
              )}
              <button className="view-profile-btn" onClick={() => viewProfile(i.user_id)}>View profile</button>
            </div>
          </div>
        ))

      default:
        return null
    }
  }

  return (
    <div className="group-members-page">
      <h2>{group.group_name} Members</h2>

      <div className="tab-navigation">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All members</button>
        {isAdmin && <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Join requests</button>}
        {isAdmin && <button className={activeTab === 'invites' ? 'active' : ''} onClick={() => setActiveTab('invites')}>Invite people</button>}
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for members"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="member-list">
        {renderList().length > 0 ? renderList() : <p>No results found.</p>}
      </div>

      <div className="back-btn-container">
        <button className="back-btn" onClick={() => navigate(`/groups/${id}`)}>
          Go back
        </button>
      </div>    
    </div>
  )
}

export default GroupMembersPage