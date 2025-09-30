import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Login from './components/Login/login.jsx'
import MoviesPage from './components/MoviesPage/moviesPage.jsx'
import MovieScreen from './components/MoviesPage/movieScreen.jsx'
import Header from './components/Header/header.jsx'
import BottomPanel from './components/BottomPanel/bottomPanel.jsx'
import { useState } from 'react'
import ShowtimesPage from './components/ShowtimesPage/showtimesPage.jsx'
import ProfilePage from './components/ProfilePage/profilePage.jsx'
import GroupsPage from './components/GroupsPage/groupsPage.jsx'
import FriendsPage from './components/FriendsPage/friendsPage.jsx'
import FavouritesPage from './components/FavouritesPage/favouritesPage.jsx'
import RegistrationPage from './components/RegistrationPage/registrationPage.jsx'
import ReviewPage from './components/ReviewPage/reviewPage.jsx'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const location = useLocation()

  return (
    <>
      <Header token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/showtimes" element={<ShowtimesPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/favourites/:id" element={<FavouritesPage />} />
        <Route path="/movie/:id" element={<MovieScreen token={token}/>} />
      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <BottomPanel token={token} />
      )}
    </>
  )
}

export default App