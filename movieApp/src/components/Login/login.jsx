import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './login.css'

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
        user: {
          username,
          email, 
          password_hash: password, 
        }
      })

      const token = response.data.token
      console.log(response)
      localStorage.setItem('userId', response.data.id)
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
      <button type="submit">Login</button>
      <button
        type="button"
        className="register-btn"
        onClick={() => navigate('/register')}
      >
        Register
      </button>
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate('/')}
      >
        Back
      </button>
      {message && <div className="error-message">{message}</div>}
    </form>
  )
}

export default Login