import { useState } from 'react'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Login not available yet. Backend coming soon!')
    // Add login backend integration here
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
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
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Login</button>
      {message && <div style={{ color: '#ff8888', marginTop: '1em' }}>{message}</div>}
    </form>
  )
}

export default Login