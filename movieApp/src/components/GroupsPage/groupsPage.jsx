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
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="groups-page">
      <h2>Groups</h2>
      <div className="groups-header">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchBar"
        />
        <button
          className="create-group-btn"
          onClick={() => navigate('/create-group')}
        >
          Create group
        </button>
      </div>

      <ul className="groups-list">
        {filteredGroups.map(group => (
          <li key={group.id} className="group-card">
            <h3>{group.name}</h3>
            <p>{group.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GroupsPage