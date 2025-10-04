import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './createGroupPage.css'

function CreateGroupPage() {
  const [group_name, setName] = useState("")
  const [group_desc, setDescription] = useState("")
  const [group_rules, setRules] = useState("")
  const navigate = useNavigate()
  const backendUrl = 'http://localhost:3001'

  const handleSubmit = async (e) => {
    e.preventDefault()

    const owner_id = localStorage.getItem('userId')

    try {
      await axios.post(`${backendUrl}/groups`, {
        group: {
          group_name,
          owner_id,
          group_desc,
          group_rules
        }
      })
      alert("Group created successfully!")
      navigate('/groups')
    } catch (err) {
      console.error("Error creating group:", err.response?.data || err.message)
      alert(err.response?.data?.message || "Failed to create group")
    }
  }

  return (
    <div className="create-group-page">
      <h2>Create a New Group</h2>
      <form className="create-group-form" onSubmit={handleSubmit}>
        <label>Group Name</label>
        <input 
          type="text"
          value={group_name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <label>Description</label>
        <textarea 
          value={group_desc}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Rules</label>
        <textarea 
          value={group_rules}
          onChange={(e) => setRules(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Create</button>
      </form>
    </div>
  )
}

export default CreateGroupPage