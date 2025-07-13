import { useState } from 'react'
import { Play, HelpCircle, Trophy, Settings, LogIn, LogOut, User } from 'lucide-react'
import HowToPlay from './HowToPlay'
import { useAuth } from '../contexts/AuthContext'

const MainMenu = ({ onStartGame, playerStats }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const { isAuthenticated, login, logout, isLoading } = useAuth()

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout()
    } else {
      login()
    }
  }

  return (
    <div className="main-menu">
      <div className="modern-bg"></div>
      
      {/* Header with Player Profile */}
      <div className="menu-header">
        <div className="logo">
          <h1>BLACKJACK</h1>
          <span>Elite Edition</span>
        </div>
        
        <div className="player-profile glass">
          <div className="avatar">
            {isAuthenticated ? (
              <User size={24} />
            ) : (
              <div className="avatar-guest">?</div>
            )}
          </div>
          <div className="player-info">
            <h3>{isAuthenticated ? playerStats.name : 'Guest'}</h3>
            <div className="stats">
              {isAuthenticated ? (
                <>
                  <Trophy size={16} />
                  <span>{playerStats.totalWins} Wins</span>
                </>
              ) : (
                <span className="login-required">Please login to play</span>
              )}
            </div>
          </div>
          <div className="auth-actions">
            {isAuthenticated ? (
              <button 
                className="btn btn-secondary small" 
                onClick={handleAuthAction}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="spinner small"></div>
                ) : (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                )}
              </button>
            ) : (
              <div className="login-status">
                <span>Not logged in</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="menu-content">
        <div className="game-title">
          <div className="title-main">
            <span className="title-number">21</span>
            <div className="title-text">
              <h1>BLACKJACK</h1>
              <p>Duel Mode • HP Battle System</p>
            </div>
          </div>
        </div>

        <div className="menu-buttons">
          {!isAuthenticated ? (
            <>
              <button 
                className="btn btn-primary btn-large pulse glow"
                onClick={handleAuthAction}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner large"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn size={24} />
                    Login with Internet Identity
                  </>
                )}
              </button>
              
              <button 
                className="btn btn-secondary btn-disabled"
                disabled={true}
                title="Please login first to start playing"
              >
                <Play size={20} />
                Start Game (Login Required)
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary btn-large pulse glow"
              onClick={onStartGame}
            >
              <Play size={24} />
              Start Game
            </button>
          )}
          
          <button 
            className="btn btn-secondary"
            onClick={() => setShowHowToPlay(true)}
          >
            <HelpCircle size={20} />
            How to Play
          </button>
        </div>

        {/* Feature Cards */}
        <div className="feature-cards">
          <div className="feature-card glass">
            <div className="feature-icon">⚡</div>
            <h4>HP Battle System</h4>
            <p>Strategic betting with health points</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">🎯</div>
            <h4>Duel Mode</h4>
            <p>Face-to-face with the dealer</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">✨</div>
            <h4>Modern UI</h4>
            <p>Sleek and responsive design</p>
          </div>
        </div>

        {/* Login Required Banner */}
        {!isAuthenticated && (
          <div className="login-banner glass">
            <div className="banner-content">
              <div className="banner-icon">🔐</div>
              <div className="banner-text">
                <h4>Internet Identity Required</h4>
                <p>Login with Internet Identity to save your progress, track statistics, and enjoy the full gaming experience!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showHowToPlay && (
        <HowToPlay onClose={() => setShowHowToPlay(false)} />
      )}

      <style jsx>{`
        .main-menu {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
        }

        .menu-header {
          padding: 30px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo h1 {
          font-size: 32px;
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .logo span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .player-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          border-radius: 16px;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
        }

        .avatar-guest {
          font-size: 20px;
          font-weight: 700;
          color: #666666;
        }

        .login-required {
          color: #ff6b6b;
          font-size: 12px;
          font-weight: 600;
        }

        .login-status {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }

        .player-info h3 {
          color: #ffffff;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .stats {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .auth-actions {
          margin-left: auto;
        }

        .btn.small {
          padding: 8px 16px;
          font-size: 14px;
          min-width: 80px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner.small {
          width: 14px;
          height: 14px;
          border-width: 1px;
        }

        .spinner.large {
          width: 24px;
          height: 24px;
          border-width: 2px;
        }

        .btn-disabled {
          opacity: 0.6;
          cursor: not-allowed !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
        }

        .btn-disabled:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: none !important;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .menu-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          text-align: center;
        }

        .game-title {
          margin-bottom: 80px;
        }

        .title-main {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-bottom: 20px;
        }

        .title-number {
          font-size: 120px;
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .title-text h1 {
          font-size: 64px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -2px;
        }

        .title-text p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 1px;
        }

        .menu-buttons {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 80px;
        }

        .btn-large {
          padding: 24px 48px;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 280px;
          justify-content: center;
          font-weight: 700;
        }

        .feature-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 800px;
          width: 100%;
        }

        .feature-card {
          padding: 32px 24px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .feature-card h4 {
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.5;
        }

        .login-banner {
          margin-top: 40px;
          padding: 24px;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          border: 2px solid rgba(255, 193, 7, 0.3);
          background: rgba(255, 193, 7, 0.1);
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .banner-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .banner-text h4 {
          color: #ffc107;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .banner-text p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
        }

        @media (max-width: 768px) {
          .menu-header {
            padding: 20px;
          }
          
          .title-main {
            flex-direction: column;
            gap: 20px;
          }
          
          .title-number {
            font-size: 80px;
          }
          
          .title-text h1 {
            font-size: 40px;
          }
          
          .btn-large {
            min-width: 240px;
            padding: 20px 40px;
            font-size: 18px;
          }
          
          .feature-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .login-banner {
            margin-top: 30px;
            padding: 20px;
          }

          .banner-content {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .banner-text h4 {
            font-size: 16px;
          }

          .banner-text p {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}

export default MainMenu