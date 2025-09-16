import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login/login.tsx'
import MainScreen from './components/MainScreen/mainScreen.tsx'
import MovieScreen from './components/MainScreen/movieScreen.jsx'
import Header from './components/Header/header.tsx'
import { useState } from 'react'
import { useEffect } from 'react'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "")

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        
        <Route path="/" element={<MovieScreen />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App