import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './groupsPage.css'

function GroupsPage() {
  const [groups, setGroups] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const backendUrl = 'http://localhost:3001'

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${backendUrl}/groups`)
        setGroups(res.data)
      } catch (err) {
        console.error("Error fetching groups:", err)
      }
    }
    fetchGroups()
  }, [])

  const filteredGroups = groups.filter(group =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="groups-page">
      <h2>Groups</h2>

      <div className="group-controls">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="group-search"
        />
        <button 
          className="create-group-btn"
          onClick={() => navigate('/groups/create')}
        >
        Create Group
        </button>
      </div>

      <div className="groups-list">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div key={group.id} className="group-card">
              <h3>{group.group_name}</h3>
              <p className="group-desc">{group.group_desc}</p>
              <p className="group-rules"><strong>Rules:</strong> {group.group_rules}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No groups found.</p>
        )}
      </div>
    </div>
  )
}

export default GroupsPage