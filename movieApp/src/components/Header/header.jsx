import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Header({ token, setToken }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setToken("")
    navigate('/')
  }

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 10
    }}>
      {token ? (
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1em',
            cursor: 'pointer'
          }}
          onClick={handleLogout}
        >
          Log out
        </button>
      ) : (
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1em',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
      )}
    </div>
  )
}

export default Header