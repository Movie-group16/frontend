import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login/login.tsx'
import MainScreen from './components/MainScreen/mainScreen.tsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
      </Routes>
    </BrowserRouter>
  )
}

function Header() {
  const navigate = useNavigate()
  return (
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
        onClick={() => navigate('/login')}
      >
        Log in
      </button>
    </div>
  )
}

export default App