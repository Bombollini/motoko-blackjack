import { useState } from 'react'
import { Zap, TrendingUp } from 'lucide-react'

const BetModal = ({ maxBet, onBet }) => {
  const [betAmount, setBetAmount] = useState(Math.min(10, maxBet))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (betAmount >= 1 && betAmount <= maxBet) {
      onBet(betAmount)
    }
  }

  const quickBet = (amount) => {
    setBetAmount(Math.min(amount, maxBet))
  }

  // Check if player has no HP left
  if (maxBet <= 0) {
    return (
      <div className="modal-overlay">
        <div className="bet-modal modal scrollable-modal">
          <div className="modal-header">
            <div className="bet-icon">
              <Zap size={32} />
            </div>
            <h3>Game Over</h3>
            <p>You have no HP left to place a bet!</p>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Start New Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="bet-modal modal scrollable-modal">
        <div className="modal-header">
          <div className="bet-icon">
            <Zap size={32} />
          </div>
          <h3>Place Your Bet</h3>
          <p>Enter the amount of HP you want to wager:</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="bet-input-container">
            <input
              type="number"
              min="1"
              max={maxBet}
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value) || 1)}
              autoFocus
            />
            <span className="input-suffix">HP</span>
          </div>
          
          <div className="quick-bet-section">
            <p className="quick-bet-label">Quick Bet:</p>
            <div className="quick-bet-buttons">
              <button 
                type="button" 
                className="btn btn-secondary quick-bet"
                onClick={() => quickBet(5)}
                disabled={maxBet < 5}
              >
                5 HP
              </button>
              <button 
                type="button" 
                className="btn btn-secondary quick-bet"
                onClick={() => quickBet(10)}
                disabled={maxBet < 10}
              >
                10 HP
              </button>
              <button 
                type="button" 
                className="btn btn-secondary quick-bet"
                onClick={() => quickBet(25)}
                disabled={maxBet < 25}
              >
                25 HP
              </button>
              <button 
                type="button" 
                className="btn btn-secondary quick-bet"
                onClick={() => quickBet(maxBet)}
              >
                All In
              </button>
            </div>
          </div>
          
          <div className="bet-info glass">
            <div className="info-row">
              <span>Available HP:</span>
              <span className="info-value">{maxBet}</span>
            </div>
            <div className="info-row">
              <span>Min Bet:</span>
              <span className="info-value">1 HP</span>
            </div>
            <div className="info-row">
              <span>Max Bet:</span>
              <span className="info-value">{maxBet} HP</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={betAmount < 1 || betAmount > maxBet}
          >
            <TrendingUp size={20} />
            Start Round
          </button>
        </form>
      </div>

      <style jsx>{`
        .bet-modal {
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .scrollable-modal {
          display: flex;
          flex-direction: column;
        }

        .scrollable-modal::-webkit-scrollbar {
          width: 8px;
        }

        .scrollable-modal::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .scrollable-modal::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .scrollable-modal::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .bet-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #000000;
        }

        .modal-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          margin-top: 8px;
        }

        .bet-input-container {
          position: relative;
          margin-bottom: 32px;
        }

        .bet-input-container input {
          padding-right: 60px;
          font-size: 24px;
          font-weight: 700;
          height: 64px;
        }

        .input-suffix {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          font-size: 18px;
        }

        .quick-bet-section {
          margin-bottom: 32px;
        }

        .quick-bet-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
        }

        .quick-bet-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .quick-bet {
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          min-width: auto;
        }

        .quick-bet:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .bet-info {
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 32px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-value {
          font-weight: 700;
          color: #ffffff;
        }

        .btn-large {
          width: 100%;
          justify-content: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .bet-modal {
            width: 95%;
            padding: 32px 24px;
          }
          
          .bet-input-container input {
            font-size: 20px;
            height: 56px;
          }
          
          .input-suffix {
            font-size: 16px;
          }
          
          .quick-bet-buttons {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
      `}</style>
    </div>
  )
}

export default BetModal