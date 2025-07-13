import { useState, useEffect } from 'react';
import { ArrowLeft, User, Camera, Trophy, Target, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ onBack }) => {
  const { actor, principal, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (isAuthenticated && actor) {
      loadProfile();
    }
  }, [isAuthenticated, actor]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const userProfile = await actor.getProfile();
      
      if (userProfile && userProfile.length > 0) {
        setProfile(userProfile[0]);
        setEditForm({
          username: userProfile[0].username,
          photoUrl: userProfile[0].photoUrl && userProfile[0].photoUrl.length > 0 ? userProfile[0].photoUrl[0] : ''
        });
      } else {
        // Profile doesn't exist, set editing mode
        setIsEditing(true);
        setEditForm({
          username: '',
          photoUrl: ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.username.trim()) {
      alert('Username is required');
      return;
    }

    try {
      setIsSaving(true);
      const photoUrl = editForm.photoUrl.trim() ? [editForm.photoUrl.trim()] : [];
      
      let success;
      if (profile) {
        success = await actor.updateProfile(editForm.username.trim(), photoUrl);
      } else {
        success = await actor.createProfile(editForm.username.trim(), photoUrl);
      }

      if (success) {
        setIsEditing(false);
        await loadProfile();
      } else {
        alert('Failed to save profile');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        username: profile.username,
        photoUrl: profile.photoUrl && profile.photoUrl.length > 0 ? profile.photoUrl[0] : ''
      });
      setIsEditing(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  const getWinRate = () => {
    if (!profile || profile.totalGames === 0) return 0;
    return Math.round((profile.totalWins / profile.totalGames) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        <div className="auth-required">
          <User size={64} />
          <h2>Authentication Required</h2>
          <p>Please login with Internet Identity to view your profile</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="modern-bg"></div>
      
      <div className="profile-header glass">
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Profile</h1>
        {profile && !isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <Edit2 size={20} />
            Edit
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card glass">
          <div className="profile-avatar">
            {isEditing ? (
              <div className="avatar-edit">
                <div className="avatar-preview">
                  {editForm.photoUrl ? (
                    <img src={editForm.photoUrl} alt="Profile" />
                  ) : (
                    <User size={64} />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Photo URL (optional)"
                  value={editForm.photoUrl}
                  onChange={(e) => setEditForm({...editForm, photoUrl: e.target.value})}
                  className="input-field"
                />
              </div>
            ) : (
              <div className="avatar">
                {profile?.photoUrl && profile.photoUrl.length > 0 ? (
                  <img src={profile.photoUrl[0]} alt="Profile" />
                ) : (
                  <User size={64} />
                )}
              </div>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="input-field username-input"
                />
                <div className="edit-actions">
                  <button 
                    className="btn btn-success" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="spinner small"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save
                      </>
                    )}
                  </button>
                  {profile && (
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      <X size={20} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h2>{profile?.username || 'Unknown Player'}</h2>
                <p className="principal-id">
                  {principal?.toString().slice(0, 12)}...
                </p>
              </>
            )}
          </div>
        </div>

        {profile && !isEditing && (
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-icon">
                <Trophy size={32} />
              </div>
              <div className="stat-info">
                <h3>{profile.totalWins}</h3>
                <p>Wins</p>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">
                <Target size={32} />
              </div>
              <div className="stat-info">
                <h3>{profile.totalLoses}</h3>
                <p>Losses</p>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">
                <Calendar size={32} />
              </div>
              <div className="stat-info">
                <h3>{profile.totalGames}</h3>
                <p>Games</p>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">
                <div className="win-rate">{getWinRate()}%</div>
              </div>
              <div className="stat-info">
                <h3>Win Rate</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        )}

        {profile && !isEditing && (
          <div className="additional-info glass">
            <h3>Account Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Registered:</strong>
                <span>{formatDate(profile.registeredAt)}</span>
              </div>
              <div className="info-item">
                <strong>Last Active:</strong>
                <span>{formatDate(profile.lastActive)}</span>
              </div>
              <div className="info-item">
                <strong>Principal ID:</strong>
                <span className="principal-full">{principal?.toString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
          padding: 20px;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          margin-bottom: 30px;
          border-radius: 20px;
        }

        .profile-header h1 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .profile-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .profile-card {
          padding: 40px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 30px;
        }

        .profile-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .avatar, .avatar-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar img, .avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-edit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .profile-info h2 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 700;
          margin: 0;
        }

        .principal-id {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin: 10px 0 0 0;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .username-input {
          font-size: 24px;
          text-align: center;
          min-width: 300px;
        }

        .edit-actions {
          display: flex;
          gap: 15px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          padding: 30px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-icon {
          color: #4CAF50;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .win-rate {
          color: #4CAF50;
          font-size: 24px;
          font-weight: 700;
        }

        .stat-info h3 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .stat-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin: 5px 0 0 0;
        }

        .additional-info {
          padding: 30px;
          border-radius: 15px;
        }

        .additional-info h3 {
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 20px 0;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-item strong {
          color: #ffffff;
        }

        .info-item span {
          color: rgba(255, 255, 255, 0.8);
        }

        .principal-full {
          font-family: monospace;
          font-size: 12px;
          word-break: break-all;
        }

        .auth-required, .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          color: #ffffff;
        }

        .auth-required h2, .loading h2 {
          font-size: 24px;
          margin: 20px 0 10px 0;
        }

        .auth-required p, .loading p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner.small {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .input-field {
          padding: 15px 20px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-size: 16px;
          width: 100%;
          max-width: 400px;
        }

        .input-field:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .profile-header {
            padding: 20px;
          }
          
          .profile-card {
            padding: 30px 20px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-card {
            padding: 20px;
          }
          
          .username-input {
            min-width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
