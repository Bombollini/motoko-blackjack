import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Edit3, Save, X, User, Trophy, Target, Calendar } from 'lucide-react'

export default function Profile({ onBack }) {
  const { isAuthenticated, actor, principal } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    photoUrl: ''
  })
  const [availableAvatars] = useState([
    '🎯', '🎮', '🎲', '🃏', '🎪', '🎭', '🎨', '🎸', '🎤', '🎧',
    '🚀', '⚡', '🔥', '💎', '🌟', '🎊', '🎉', '🏆', '👑', '🎖️',
    '🦄', '🐉', '🦅', '🦊', '🐺', '🦁', '🐯', '🐼', '🐨', '🦘'
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && actor) {
      loadProfile()
    }
  }, [isAuthenticated, actor])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const result = await actor.getProfile()
      if (result && result.length > 0) {
        const profileData = result[0]
        setProfile(profileData)
        setEditForm({
          username: profileData.username,
          photoUrl: profileData.photoUrl && profileData.photoUrl.length > 0 ? profileData.photoUrl[0] : '🎯'
        })
      } else {
        // No profile found, create default
        setProfile({
          username: 'Player',
          photoUrl: ['🎯'],
          totalWins: 0,
          totalLoses: 0,
          totalGames: 0,
          registeredAt: Date.now(),
          lastActive: Date.now()
        })
        setEditForm({
          username: 'Player',
          photoUrl: '🎯'
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // This will be connected to backend later
      console.log('Saving profile:', editForm)
      
      // For now, update local state
      setProfile(prev => ({
        ...prev,
        username: editForm.username,
        photoUrl: [editForm.photoUrl]
      }))
      
      setIsEditing(false)
      alert('Profile updated successfully! (Frontend only - backend integration coming next)')
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        username: profile.username,
        photoUrl: profile.photoUrl && profile.photoUrl.length > 0 ? profile.photoUrl[0] : '🎯'
      })
    }
    setIsEditing(false)
  }

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString()
  }

  const calculateWinRate = () => {
    if (!profile || profile.totalGames === 0) return 0
    return Math.round((profile.totalWins / profile.totalGames) * 100)
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={24} />
            Back to Menu
          </button>
        </div>
        <div className="profile-content">
          <div className="profile-message">
            <User size={48} />
            <h2>Please login to view your profile</h2>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={24} />
            Back to Menu
          </button>
        </div>
        <div className="profile-content">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={24} />
          Back to Menu
        </button>
        <h1>Player Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            <Edit3 size={20} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            {isEditing ? (
              <div className="avatar-edit-section">
                <div className="current-avatar">
                  <span className="avatar-display">{editForm.photoUrl}</span>
                </div>
                <div className="avatar-selector">
                  <h3>Choose Avatar:</h3>
                  <div className="avatar-grid">
                    {availableAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        className={`avatar-option ${editForm.photoUrl === avatar ? 'selected' : ''}`}
                        onClick={() => setEditForm(prev => ({ ...prev, photoUrl: avatar }))}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-avatar">
                <span className="avatar-display">{profile?.photoUrl?.[0] || '🎯'}</span>
              </div>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    maxLength={20}
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleSave} className="save-button">
                    <Save size={20} />
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="cancel-button">
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <h2>{profile?.username || 'Player'}</h2>
                <p className="profile-id">ID: {principal?.toString().slice(0, 8)}...</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stats-grid">
            <div className="stat-card wins">
              <Trophy size={32} />
              <div className="stat-info">
                <h3>{profile?.totalWins || 0}</h3>
                <p>Total Wins</p>
              </div>
            </div>
            <div className="stat-card losses">
              <Target size={32} />
              <div className="stat-info">
                <h3>{profile?.totalLoses || 0}</h3>
                <p>Total Losses</p>
              </div>
            </div>
            <div className="stat-card games">
              <Calendar size={32} />
              <div className="stat-info">
                <h3>{profile?.totalGames || 0}</h3>
                <p>Total Games</p>
              </div>
            </div>
            <div className="stat-card winrate">
              <div className="winrate-circle">
                <span>{calculateWinRate()}%</span>
              </div>
              <div className="stat-info">
                <h3>Win Rate</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span>Member since:</span>
            <span>{profile?.registeredAt ? formatDate(profile.registeredAt) : 'Unknown'}</span>
          </div>
          <div className="detail-row">
            <span>Last active:</span>
            <span>{profile?.lastActive ? formatDate(profile.lastActive) : 'Unknown'}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 20px;
          color: white;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .back-button, .edit-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover, .edit-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .profile-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
        }

        .profile-avatar-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .profile-avatar {
          display: inline-block;
          margin-bottom: 20px;
        }

        .avatar-display {
          font-size: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.05);
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .avatar-edit-section {
          text-align: center;
        }

        .current-avatar {
          margin-bottom: 20px;
        }

        .avatar-selector h3 {
          margin-bottom: 15px;
          color: #fff;
        }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
          gap: 10px;
          max-width: 500px;
          margin: 0 auto;
        }

        .avatar-option {
          width: 50px;
          height: 50px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .avatar-option:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.1);
        }

        .avatar-option.selected {
          border-color: #fff;
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }

        .profile-edit-form {
          max-width: 400px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #fff;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .save-button, .cancel-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 2px solid;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: bold;
        }

        .save-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .save-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .cancel-button {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-2px);
        }

        .profile-display {
          text-align: center;
        }

        .profile-display h2 {
          margin: 0 0 10px 0;
          font-size: 2em;
          color: #fff;
        }

        .profile-id {
          color: rgba(255, 255, 255, 0.7);
          font-family: monospace;
        }

        .profile-stats {
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .stat-card.wins {
          border-color: rgba(76, 175, 80, 0.3);
        }

        .stat-card.wins:hover {
          border-color: rgba(76, 175, 80, 0.5);
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.2);
        }

        .stat-card.losses {
          border-color: rgba(244, 67, 54, 0.3);
        }

        .stat-card.losses:hover {
          border-color: rgba(244, 67, 54, 0.5);
          box-shadow: 0 0 20px rgba(244, 67, 54, 0.2);
        }

        .stat-card.games {
          border-color: rgba(33, 150, 243, 0.3);
        }

        .stat-card.games:hover {
          border-color: rgba(33, 150, 243, 0.5);
          box-shadow: 0 0 20px rgba(33, 150, 243, 0.2);
        }

        .stat-card.winrate {
          border-color: rgba(156, 39, 176, 0.3);
        }

        .stat-card.winrate:hover {
          border-color: rgba(156, 39, 176, 0.5);
          box-shadow: 0 0 20px rgba(156, 39, 176, 0.2);
        }

        .stat-info h3 {
          margin: 0;
          font-size: 2em;
          font-weight: bold;
          color: #fff;
        }

        .stat-info p {
          margin: 5px 0 0 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .winrate-circle {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          color: #fff;
        }

        .profile-details {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row span:first-child {
          color: rgba(255, 255, 255, 0.7);
        }

        .detail-row span:last-child {
          color: #fff;
          font-weight: bold;
        }

        .profile-message {
          text-align: center;
          padding: 50px;
        }

        .profile-message h2 {
          margin-top: 20px;
          color: #fff;
        }

        .profile-loading {
          text-align: center;
          padding: 50px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            gap: 15px;
          }

          .profile-header h1 {
            order: -1;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .avatar-grid {
            grid-template-columns: repeat(5, 1fr);
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
