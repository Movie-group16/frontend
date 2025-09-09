import { useState } from 'react'
import './App.css'
import Login from './assets/login.tsx'

function App() {
  const [page, setPage] = useState('main')
  const [user, setUser] = useState(null)

  if (page === 'login') {
    return (
      <Login onLogin={(username) => {
        setUser(username)
        setPage('main')
      }} />
    )
  }

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20, 
        zIndex: 10
      }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#fff', 
            fontWeight: 'bold',
            fontSize: '1.1em',
            cursor: 'pointer'
          }}
          onClick={() => setPage('login')}
        >
          Log in
        </button>
      </div>
      <h1>Welcome{user ? `, ${user}` : ''}! This is the main page. Unfinished for now.</h1>
    </>
  )
}

export default App