import { useNavigate, useLocation } from 'react-router-dom'
import './bottomPanel.css'

const panelRoutes = [
  { label: 'Movies', path: '/' },
  { label: 'Showtimes', path: '/showtimes' },
  { label: 'Profile', path: '/profile' },
  { label: 'Groups', path: '/groups' },
  { label: 'Friends', path: '/friends' },
  { label: 'Favourites', path: '/favourites' },
]

function BottomPanel() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="main-screen-panel">
      {panelRoutes.map(route => (
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