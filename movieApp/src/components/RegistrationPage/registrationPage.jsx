import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegistrationPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('Registration not implemented yet.')
    // Add backend registration logic here later
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
          />
        </label>
      </div>
      <button type="submit">Register</button>
      <button
        type="button"
        style={{
          width: '100%',
          marginTop: '0.5em',
          background: '#333',
          color: '#fff',
          borderRadius: '4px',
          border: '1px solid #888',
          padding: '0.6em 1.2em',
          fontSize: '1em',
          fontWeight: 500,
          cursor: 'pointer'
        }}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      {message && <div style={{ color: '#ff8888', marginTop: '1em' }}>{message}</div>}
    </form>
  )
}

export default RegistrationPage