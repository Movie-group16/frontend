import { useNavigate, useLocation } from 'react-router-dom'
import './bottomPanel.css'



function BottomPanel({ token }) {
  const navigate = useNavigate()
  const location = useLocation()

  const panelRoutes = [
  { label: 'Movies', path: '/' },
  { label: 'Showtimes', path: '/showtimes' },
  { label: 'Profile', path: '/profile/' + localStorage.getItem('userId') },
  { label: 'Groups', path: '/groups' },
  { label: 'Friends', path: '/friends' },
  { label: 'Favourites', path: '/favourites/' + localStorage.getItem('userId') },
]

  const visibleRoutes = token
    ? panelRoutes
    : panelRoutes.filter(route =>
        route.label === 'Movies' || route.label === 'Showtimes'
      )

  return (
    <div className="main-screen-panel">
      {visibleRoutes.map(route => (
        <button
          key={route.path}
          className={`panel-btn${location.pathname === route.path ? ' active' : ''}`}
          onClick={() => navigate(route.path)}
        >
          {route.label}
        </button>
      ))}
    </div>
  )
}

export default BottomPanel