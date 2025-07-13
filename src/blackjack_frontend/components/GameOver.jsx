import { RotateCcw, Home, Skull } from 'lucide-react'

const GameOver = ({ onRestart, onBackToMenu }) => {
  return (
    <div className="game-over">
      <div className="modern-bg"></div>
      
      <div className="game-over-content">
        <div className="game-over-animation">
          <div className="skull-container">
            <Skull size={80} className="skull-icon" />
          </div>
          <div className="glitch-effect">
            <span>GAME OVER</span>
            <span>GAME OVER</span>
            <span>GAME OVER</span>
          </div>
        </div>
        
        <div className="game-over-message">
          <h2>Your HP has been depleted!</h2>
          <p>Don't give up! Try again and prove your skills at the blackjack table!</p>
        </div>

        <div className="game-over-stats glass">
          <div className="stat-item">
            <span className="stat-icon">💀</span>
            <div className="stat-info">
              <span className="stat-label">Remaining HP</span>
              <span className="stat-value">0</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <div className="stat-info">
              <span className="stat-label">Status</span>
              <span className="stat-value">Defeated</span>
            </div>
          </div>
        </div>

        <div className="game-over-actions">
          <button 
            className="btn btn-primary btn-large pulse glow"
            onClick={onRestart}
          >
            <RotateCcw size={24} />
            Start Over
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={onBackToMenu}
          >
            <Home size={20} />
            Back to Menu
          </button>
        </div>

        <div className="motivational-quote glass">
          <p>"Defeat is the best teacher for the next victory"</p>
        </div>
      </div>

      <style jsx>{`
        .game-over {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #000000 0%, #1a0000 50%, #330000 100%);
          position: relative;
          overflow: hidden;
        }

        .game-over-content {
          text-align: center;
          z-index: 2;
          max-width: 600px;
          padding: 40px;
        }

        .game-over-animation {
          position: relative;
          margin-bottom: 60px;
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .skull-container {
          margin-bottom: 30px;
        }

        .skull-icon {
          color: #ff4444;
          animation: float 2s ease-in-out infinite;
        }

        .glitch-effect {
          position: relative;
          font-size: 48px;
          font-weight: 900;
          color: #ff4444;
          text-shadow: 
            0 0 10px #ff4444,
            0 0 20px #ff4444,
            0 0 30px #ff4444;
        }

        .glitch-effect span {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          animation: glitch 2s infinite;
        }

        .glitch-effect span:nth-child(2) {
          color: #ffffff;
          animation: glitch 2s infinite 0.1s;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }

        .glitch-effect span:nth-child(3) {
          color: #ff8888;
          animation: glitch 2s infinite 0.2s;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }

        .game-over-message {
          margin-bottom: 50px;
        }

        .game-over-message h2 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .game-over-message p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
          line-height: 1.6;
        }

        .game-over-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 50px;
          padding: 24px;
          border-radius: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 500;
        }

        .stat-value {
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
        }

        .game-over-actions {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          margin-bottom: 50px;
        }

        .btn-large {
          padding: 20px 40px;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 280px;
          justify-content: center;
        }

        .motivational-quote {
          padding: 20px 32px;
          border-radius: 16px;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          font-size: 16px;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes glitch {
          0%, 100% {
            transform: translateX(-50%) skew(0deg);
          }
          20% {
            transform: translateX(-50%) skew(2deg);
          }
          40% {
            transform: translateX(-50%) skew(-2deg);
          }
          60% {
            transform: translateX(-50%) skew(1deg);
          }
          80% {
            transform: translateX(-50%) skew(-1deg);
          }
        }

        @media (max-width: 768px) {
          .game-over-content {
            padding: 30px 20px;
          }
          
          .glitch-effect {
            font-size: 36px;
          }
          
          .game-over-message h2 {
            font-size: 28px;
          }
          
          .game-over-message p {
            font-size: 16px;
          }
          
          .game-over-stats {
            flex-direction: column;
            gap: 20px;
            align-items: center;
          }
          
          .btn-large {
            min-width: 240px;
            padding: 16px 32px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  )
}

export default GameOver