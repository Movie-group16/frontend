import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  setToken: (token: string) => void
}

function Login({ setToken }: LoginProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/login', { // Lisää tähän oikea osoite
        user: { email, password }
    })

    const token = response.data.token 
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setToken(token)
    navigate('/')
  } catch (error: any) {
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
      <button type="submit">Login</button>
      {message && <div style={{ color: '#ff8888', marginTop: '1em' }}>{message}</div>}
    </form>
  )
}

export default Login