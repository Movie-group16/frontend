import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './createGroupPage.css'

function CreateGroupPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rules, setRules] = useState("")
  const navigate = useNavigate()
  const backendUrl = 'http://localhost:3001'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${backendUrl}/groups`, {
        name,
        description,
        rules
      })
      alert("Group created successfully!")
      navigate('/groups')
    } catch (err) {
      console.error(err)
      alert("Failed to create group")
    }
  }

  return (
    <div className="create-group-page">
      <h2>Create a New Group</h2>
      <form className="create-group-form" onSubmit={handleSubmit}>
        <label>Group Name</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Rules</label>
        <textarea 
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Create</button>
      </form>
    </div>
  )
}

export default CreateGroupPage