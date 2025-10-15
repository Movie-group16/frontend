import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import "./profilePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import profilePic from '../../assets/Profiili kuva.webp';


function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split("/").pop();
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const backUrl = "http://localhost:3001";
  const token = localStorage.getItem('token');
  const movieDbApiKey = import.meta.env.VITE_TMDB_API_KEY
  const [movieTitles, setMovieTitles] = useState({});
  const [favouriteTitles, setFavouriteTitles] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')
  const currentUserId = localStorage.getItem('userId')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState('');

  useEffect(() => {
    if (!userId) return;
    setBio("");
    setUsername("");
    setUserEmail("");
    setFavourites([]);
    setReviews([]);

    //profiilin tiejot
    axios.get(`${backUrl}/profile/${userId}`)
      .then(res => {
        setUsername(res.data.username || "");
        setBio(res.data.user_desc || "");
        setUserEmail(res.data.email || "");
      })
      .catch(err => {
        console.error("Error loading user:", err);
      })


      axios.get(`${backUrl}/reviews/${userId}`)
      .then(res =>  setReviews(res.data || []))
      .catch(err => console.error("Error loading reviews:", err));

      axios.get(`${backUrl}/favourites/user/${userId}/favourites`)
      .then(res => setFavourites(res.data || []))
      .catch(err => console.error("Error loading favourites:", err));

      axios.get(`${backUrl}/profile/groups/${userId}`)
      .then(res => setGroups(res.data || []))
      .catch(err => console.error("Error loading groups:", err));

  }, [userId]);


  // tarkistaa että onko profiilin omistaja kaverina
  useEffect(() => {
    if (currentUserId && userId && currentUserId !== userId) {
      axios.get(`${backUrl}/friends/status/${userId}?userId=${currentUserId}`)

        .then(res => {
          setFriendshipStatus(res.data.status);
          setIsFriend(res.data.status === 'friends');
          setRequestSent(res.data.status === 'pending');
        })
        .catch(() => {
          setFriendshipStatus('');
          setIsFriend(false);
          setRequestSent(false);
        });
    }
  }, [currentUserId, userId]);


  // Titlet arvosteltuille elokuville
  useEffect(() => {
  
    const fetchTitles = async () => {
      const titles = {};

      for (const review of reviews.slice(0,5)) {
        try {
          const response = await fetch(
          `https://api.themoviedb.org/3/movie/${review.movie_id}?language=en-US`,
          {
            headers : {
              'Authorization': `Bearer ${movieDbApiKey}`,
              'Content-Type': 'application/json;charset=utf-8'
            }
          }
        );
         
        const data = await response.json();
        titles[review.movie_id] = data.title || "Unknown Title";
        } catch (error) {
          console.error("Error fetching title:", review.movie_id, error);
          titles[review.movie_id] = "Unknown Title"
        }
      }
      setMovieTitles(titles);
    };

    fetchTitles();
  }, [reviews, movieDbApiKey]);


  // Titlet favouriteille
  useEffect(() => {
  
    const fetchFavouriteTitles = async () => {
      const titles = {};

      for (const favourite of favourites.slice(0,5)) {
        try {
          const response = await fetch(
          `https://api.themoviedb.org/3/movie/${favourite.movie_id}?language=en-US`,
          {
            headers: {
              'Authorization': `Bearer ${movieDbApiKey}`,
              'Content-Type': 'application/json;charset=utf-8'
            }
          }
        );
        
        const data = await response.json();
        titles[favourite.movie_id] = data.title || "Unknown Title";
        } catch (error) {
          console.error("Error fetching title:", favourite.movie_id, error);
          titles[favourite.movie_id] = "Unknown Title"
        }
      }

      setFavouriteTitles(titles);
    };

    fetchFavouriteTitles();
  }, [favourites, movieDbApiKey]);


  const sendFriendRequest = async () => {
    try {
      await axios.post(`${backUrl}/friends/request`, {
        userId: currentUserId,
        friendId: userId
      });
      setRequestSent(true);
      setFriendshipStatus('pending'); 
    } catch (err) {
      alert("Failed to send friend request.");
    }
  };

  const acceptFriendRequest = async () => {
    try {
      await axios.put(`${backUrl}/friends/accept/${userId}`, { userId: currentUserId});
      setFriendshipStatus('friends');
      setIsFriend(true);
      } catch (err) {
      alert("Failed to accept friend request.");
    }
  };

  const rejectFriendRequest = async () => {
    try {
      await axios.put(`${backUrl}/friends/reject/${userId}`, { userId: currentUserId });
      setFriendshipStatus('not_friends');
      setIsFriend(false);
      setRequestSent(false);
    } catch (err) {
      alert("Failed to reject friend request.");
    }
  };

  const removeFriend = async () => {
    try {
      await axios.delete(`${backUrl}/friends/remove/${userId}`, {
        data: { userId: currentUserId }
      });
      setIsFriend(false);
      setFriendshipStatus('not_friends');
      alert("Friend removed.");
    } catch (err) {
      alert("Failed to remove friend.");
    }
  };

  const cancelFriendRequest = async () => {
    try {
      await axios.put(`${backUrl}/friends/cancel/${userId}`, { userId: currentUserId });
      setRequestSent(false);
      setFriendshipStatus('not_friends');
    } catch (err) {
      alert("Failed to cancel friend request.");
    }
  };

  const saveSettings = async () => {
    try {
      await axios.put(`${backUrl}/profile/${userId}`, {
        email: userEmail,
        description: bio,
      });
      alert("Profile updated succesfully!");
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };


  const goToReviews = () => {
    navigate(`/reviews/${userId}`, {state: { user: username, reviews}});
  };
  

  const goToFavourites = () => {
    navigate(`/favourites/${userId}`, {state: { user: username, favourites}})
  };


  const deleteProfile = async () => {
    setConfirmMessage('Are you sure you want to delete your profile? This action cannot be undone and will permanently remove all your data including reviews, favourites, and account information.')
    setConfirmAction(() => async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3001/user/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        navigate('/')
        window.location.reload()
      } catch (error) {
        console.error('Error deleting profile:', error)
        alert('Failed to delete profile')
      }
    })
    setShowConfirmModal(true)
  }


  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction()
    }
    setShowConfirmModal(false)
    setConfirmAction(null)
    setConfirmMessage('')
  }


  const handleCancel = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
    setConfirmMessage('')
  }


  const isOwnProfile = parseInt(currentUserId) === parseInt(userId)


  return (
  <div className='profile'>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Action</h3>
            <p>{confirmMessage}</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <h1>Profile Page</h1> 
      <div className='header'>
        <img
        src={profilePic}
        alt='profile'
        className='profilepic'
        />
        <h2 className="name">{username}</h2>
      {isOwnProfile && token && (<button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
      ⚙️ Settings
      </button>
      )}
      
      {!isOwnProfile && token && (
        <>
        {isFriend && (
          <button className="remove-request-button" onClick={removeFriend}>
          Remove Friend
          </button>
        )}
        {!isFriend && !requestSent && friendshipStatus !== 'awaiting' && (
          <button className="friend-request-button" onClick={sendFriendRequest}>
          Send Friend Request
          </button>
        )}
        {!isFriend && requestSent && friendshipStatus === 'pending' && (
          <button className="remove-request-button" onClick={cancelFriendRequest}>
           Cancel Friend Request
          </button>
        )}
      </>
      )}
      </div>
      {!isFriend && !isOwnProfile && !requestSent && token && friendshipStatus !== 'awaiting' &&  (
        <p className="friendText">You are not friends with this person.</p>
      )}
      {!isFriend && requestSent && token && (
        <p className="friendText">Friend request pending.</p>
      )}
      {token && !isOwnProfile && friendshipStatus === 'awaiting' && (
        <p className="friendText">This person has sent you a friend request.</p>
      )}
      {token && !isOwnProfile && friendshipStatus === 'awaiting' && (
      <div className="friend-invite-actions">
      <button className="accept-btn" onClick={acceptFriendRequest}>Accept</button>
      <button className="reject-btn" onClick={rejectFriendRequest}>Reject</button>
      </div>
      )}
      {!token && !isOwnProfile && (
        <p className="friendText">Log in to send a friend request.</p>
      )}
      <h3>Bio</h3>
      <textarea 
      className='bio'
      value={bio}
      readOnly
      placeholder="This user has no bio yet..."
      rows={4}
      />
    <div className='sections'>
      <div className='left-column'>
        <div className='reviewBox'>
          <h3>Latest reviews</h3>
          {reviews.length === 0 && <p>No reviews added yet.</p>}
          <ul>
            {reviews.slice(0, 5).map((review) => (
              <li key={review.id}>
                <strong> Movie Title: </strong>{movieTitles[review.movie_id] || "Loading..."} {" "} <br />
                - Rating: {review.rating}/5 <br />
                {review.review_title}
                </li>
            ))}
          </ul>
            { token &&(<button onClick={goToReviews}>All Reviews</button>)}
        </div>
        <div className='movieBox'>
          <h3>Favourite Movies</h3>
          {favourites.length === 0 && <p>No favourite movies added yet.</p>}
          <ul>
            {favourites.slice(0,5).map((favourite) => (
              <li key={favourite.id || favourite.movie_id}>
                <strong>Movie Title: </strong>
                {favouriteTitles[favourite.movie_id] || "Loading..."}
                </li>
            ))}
          </ul>
          { token &&(<button onClick={goToFavourites}>All Favourites</button>)}
        </div>
      </div>
      <div className='groupBox'>
        <h3>Joined Groups</h3>
        {groups.length === 0 ? (
          <p>You haven't joined any groups yet.</p>
        ) : (
          <ul>
            {groups.map((group) => (
              <li key={group.id}>
                <strong>Group Name: </strong>{group.group_name}
                <p><strong> Group Description: </strong>{group.group_desc}</p>
                { token &&(<button className="groupbutton" onClick={() => navigate(`/groups/${group.id}`)}>Group Page</button>)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

      {isSettingsOpen && (
        <div className="modal-overlay">
          <div className="settings-modal">
            <h3>Profile Settings</h3>

            <label>Bio:</label>
            <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            />

            <label>Email:</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              />
              <div className="settings-buttons">
                <button onClick={saveSettings} className="saveBtn">Save</button>
                <button onClick={deleteProfile} className="deleteBtn">Delete account</button>
                <button onClick ={() => setIsSettingsOpen(false)} className="cancelBtn">
                  Close 
                </button>
              </div>
          </div>
        </div>
      )}
  </div>
  );
}

export default ProfilePage