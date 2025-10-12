import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function RegistrationPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/user/register', {
        user: {
          username,
          email,
          password_hash: password,
          user_desc: ''
        }
      })
      navigate('/login')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleRegister} className="login-form">
      <h2>Register</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Type username"
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Type email"
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Type password"
          />
        </label>
      </div>
      <button type="submit">Register</button>
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate('/login')}
      >
        Back
      </button>
      {message && <div className="error-message">{message}</div>}
    </form>
  )
}

export default RegistrationPage