import { X, Zap, Target, Gamepad2, Trophy } from 'lucide-react'

const HowToPlay = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="how-to-play-modal">
        <div className="modal-header">
          <h2>How to Play Blackjack Duel Mode</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="rules-section">
            <div className="section-header">
              <Gamepad2 size={24} />
              <h3>Basic Rules</h3>
            </div>
            <ul>
              <li>Goal: Get cards with total value close to 21 without going over</li>
              <li>Ace = 1 or 11, Face cards (J, Q, K) = 10</li>
              <li>Blackjack = Ace + 10-value card (automatic win)</li>
              <li>Bust = Total cards over 21 (automatic loss)</li>
            </ul>
          </div>

          <div className="rules-section">
            <div className="section-header">
              <Zap size={24} />
              <h3>HP Duel System</h3>
            </div>
            <ul>
              <li>Each player starts with 100 HP</li>
              <li>Before each round, bet HP (1-100)</li>
              <li>Win = Gain HP equal to bet</li>
              <li>Lose = Lose HP equal to bet</li>
              <li>Push = HP unchanged</li>
              <li>Game Over when HP reaches 0</li>
            </ul>
          </div>

          <div className="rules-section">
            <div className="section-header">
              <Target size={24} />
              <h3>Game Actions</h3>
            </div>
            <ul>
              <li><strong>Hit:</strong> Take another card</li>
              <li><strong>Stand:</strong> Stop taking cards</li>
              <li><strong>Double Down:</strong> Double bet, take exactly 1 card</li>
              <li><strong>Split:</strong> Split matching cards into 2 hands</li>
              <li><strong>Surrender:</strong> Give up, lose half bet</li>
            </ul>
          </div>

          <div className="rules-section">
            <div className="section-header">
              <Trophy size={24} />
              <h3>Winning Tips</h3>
            </div>
            <ul>
              <li>Stand on 17 or higher</li>
              <li>Hit on 11 or lower</li>
              <li>Watch the dealer's face-up card</li>
              <li>Manage HP wisely - don't bet too much at once</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary btn-large" onClick={onClose}>
            Ready to Play!
          </button>
        </div>
      </div>

      <style jsx>{`
        .how-to-play-modal {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          max-width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header h2 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .modal-content {
          padding: 40px;
        }

        .rules-section {
          margin-bottom: 40px;
        }

        .rules-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-header h3 {
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .rules-section ul {
          list-style: none;
          padding: 0;
        }

        .rules-section li {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px 20px;
          margin-bottom: 12px;
          border-radius: 12px;
          border-left: 4px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          transition: all 0.3s ease;
        }

        .rules-section li:hover {
          background: rgba(255, 255, 255, 0.08);
          border-left-color: #ffffff;
          transform: translateX(4px);
        }

        .rules-section li strong {
          color: #ffffff;
          font-weight: 700;
        }

        .modal-footer {
          padding: 24px 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .btn-large {
          padding: 16px 40px;
          font-size: 18px;
          font-weight: 700;
          min-width: 200px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (max-width: 768px) {
          .how-to-play-modal {
            max-width: 95vw;
            margin: 20px;
            max-height: 90vh;
          }
          
          .modal-header {
            padding: 24px 20px;
          }
          
          .modal-header h2 {
            font-size: 24px;
          }
          
          .modal-content {
            padding: 30px 20px;
          }
          
          .modal-footer {
            padding: 20px;
          }
          
          .rules-section li {
            padding: 14px 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default HowToPlay