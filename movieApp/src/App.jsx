import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Login from './components/Login/login.tsx'
import MainScreen from './components/MainScreen/mainScreen.tsx'
import Header from './components/Header/header.tsx'
import { useState } from 'react'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const location = useLocation()

  return (
    <>
      <Header token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/register' && <BottomPanel />}
    </>
  )
}

export default App