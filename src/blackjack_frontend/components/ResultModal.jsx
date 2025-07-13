import { Trophy, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'

const ResultModal = ({ result, message, hpChange, onNextRound, onBackToMenu }) => {
  const getResultIcon = () => {
    switch (result) {
      case 'win':
      case 'blackjack':
        return <Trophy size={48} className="result-icon win" />
      case 'lose':
      case 'bust':
        return <TrendingDown size={48} className="result-icon lose" />
      case 'push':
        return <Minus size={48} className="result-icon push" />
      case 'surrender':
        return <TrendingDown size={48} className="result-icon surrender" />
      default:
        return null
    }
  }

  const getResultClass = () => {
    switch (result) {
      case 'win':
      case 'blackjack':
        return 'result-win'
      case 'lose':
      case 'bust':
        return 'result-lose'
      case 'push':
        return 'result-push'
      case 'surrender':
        return 'result-surrender'
      default:
        return ''
    }
  }

  const getHPChangeDisplay = () => {
    if (hpChange > 0) {
      return (
        <div className="hp-change positive glass">
          <TrendingUp size={24} />
          <span>+{hpChange} HP</span>
        </div>
      )
    } else if (hpChange < 0) {
      return (
        <div className="hp-change negative glass">
          <TrendingDown size={24} />
          <span>{hpChange} HP</span>
        </div>
      )
    } else {
      return (
        <div className="hp-change neutral glass">
          <Minus size={24} />
          <span>0 HP</span>
        </div>
      )
    }
  }

  return (
    <div className="modal-overlay">
      <div className={`result-modal modal ${getResultClass()}`}>
        <div className="result-header">
          <div className="result-icon-container">
            {getResultIcon()}
          </div>
          <h2>{message}</h2>
        </div>
        
        <div className="result-content">
          {getHPChangeDisplay()}
          
          <div className="result-details">
            {result === 'blackjack' && (
              <div className="bonus-text glass">
                <Zap size={20} />
                <span>Blackjack Bonus: 1.5x bet!</span>
              </div>
            )}
            {result === 'surrender' && (
              <div className="surrender-text glass">
                <span>🏳️ Lost half bet</span>
              </div>
            )}
          </div>
        </div>

        <div className="result-actions">
          <button className="btn btn-primary btn-large" onClick={onNextRound}>
            Next Round
          </button>
          <button className="btn btn-secondary" onClick={onBackToMenu}>
            Back to Menu
          </button>
        </div>
      </div>

      <style jsx>{`
        .result-modal {
          max-width: 500px;
          width: 90%;
          text-align: center;
        }

        .result-modal.result-win {
          border: 2px solid #00ff88;
          box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2);
        }

        .result-modal.result-lose {
          border: 2px solid #ff4444;
          box-shadow: 0 20px 60px rgba(255, 68, 68, 0.2);
        }

        .result-modal.result-push {
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 60px rgba(255, 255, 255, 0.1);
        }

        .result-header {
          margin-bottom: 32px;
        }

        .result-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .result-header h2 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .result-icon.win {
          color: #00ff88;
          animation: bounce 1s infinite;
        }

        .result-icon.lose {
          color: #ff4444;
          animation: shake 0.5s ease-in-out;
        }

        .result-icon.push {
          color: rgba(255, 255, 255, 0.8);
        }

        .result-icon.surrender {
          color: #ffaa00;
        }

        .result-content {
          margin-bottom: 40px;
        }

        .hp-change {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          padding: 20px 32px;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .hp-change.positive {
          color: #00ff88;
          border: 2px solid #00ff88;
        }

        .hp-change.negative {
          color: #ff4444;
          border: 2px solid #ff4444;
        }

        .hp-change.neutral {
          color: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .result-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bonus-text, .surrender-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
        }

        .bonus-text {
          color: #ffaa00;
          border: 1px solid #ffaa00;
        }

        .surrender-text {
          color: #ffaa00;
          border: 1px solid #ffaa00;
        }

        .result-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 700;
          min-width: 140px;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @media (max-width: 768px) {
          .result-modal {
            width: 95%;
            padding: 32px 24px;
          }
          
          .result-header h2 {
            font-size: 24px;
          }
          
          .hp-change {
            font-size: 20px;
            padding: 16px 24px;
          }
          
          .result-actions {
            flex-direction: column;
          }
          
          .btn-large {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default ResultModal