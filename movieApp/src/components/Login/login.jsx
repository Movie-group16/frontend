import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login({ setToken }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/user/login', {
        username,
        email,
        password,
      })

    const token = response.data.token 
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setToken(token)
    navigate('/')
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed')
  }
}
  return (
    <form onSubmit={handleLogin} className="login-form">
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
      <button
        type="button"
        style={{
          width: '100%',
          marginTop: '0.5em',
          background: '#646cff',
          color: '#fff',
          borderRadius: '4px',
          border: '1px solid #888',
          padding: '0.6em 1.2em',
          fontSize: '1em',
          fontWeight: 500,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/register')}
      >
        Register
      </button>
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

export default Login