import { useEffect, useState } from 'react'

const Card = ({ card, hidden = false, dealIndex = 0 }) => {
  const [isDealing, setIsDealing] = useState(true)
  const [shouldFlip, setShouldFlip] = useState(false)

  useEffect(() => {
    // Stagger the dealing animation based on card index
    const dealDelay = dealIndex * 200
    
    setTimeout(() => {
      setIsDealing(false)
    }, dealDelay + 100)

    // Handle flip animation for hidden cards being revealed
    if (hidden === false && card) {
      setTimeout(() => {
        setShouldFlip(true)
      }, dealDelay + 200)
    }
  }, [dealIndex, hidden, card])

  if (hidden) {
    return (
      <div className={`card card-back ${isDealing ? 'card-deal' : ''}`}>
        <div className="card-pattern">
          <div className="pattern-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="pattern-dot"></div>
            ))}
          </div>
        </div>
        
        <style jsx>{`
          .card-pattern {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .pattern-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(4, 1fr);
            gap: 8px;
            width: 60%;
            height: 70%;
          }
          
          .pattern-dot {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 100%;
            height: 100%;
            animation: patternPulse 2s infinite;
          }
          
          .pattern-dot:nth-child(odd) {
            animation-delay: 0.5s;
          }
          
          @keyframes patternPulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
      </div>
    )
  }

  const getSuitColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'card-red' : 'card-black'
  }

  const getDisplayValue = (value) => {
    switch (value) {
      case 1: return 'A'
      case 11: return 'J'
      case 12: return 'Q'
      case 13: return 'K'
      default: return value.toString()
    }
  }

  const getSuitSymbol = (suit) => {
    const symbols = {
      '♠': '♠',
      '♥': '♥', 
      '♦': '♦',
      '♣': '♣'
    }
    return symbols[suit] || suit
  }

  return (
    <div className={`card ${isDealing ? 'card-deal' : ''} ${shouldFlip ? 'card-flip' : ''}`}>
      <div className={`card-content ${getSuitColor(card.suit)}`}>
        <div className="card-corner top-left">
          <div className="card-value-small">{getDisplayValue(card.value)}</div>
          <div className="card-suit-small">{getSuitSymbol(card.suit)}</div>
        </div>
        
        <div className="card-center">
          <div className={`card-suit ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
        </div>
        
        <div className="card-corner bottom-right">
          <div className="card-value-small rotated">{getDisplayValue(card.value)}</div>
          <div className="card-suit-small rotated">{getSuitSymbol(card.suit)}</div>
        </div>
      </div>

      <style jsx>{`
        .card-content {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-corner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .top-left {
          align-self: flex-start;
        }

        .bottom-right {
          align-self: flex-end;
        }

        .rotated {
          transform: rotate(180deg);
        }

        .card-value-small {
          font-size: 16px;
          font-weight: 900;
          line-height: 1;
        }

        .card-suit-small {
          font-size: 14px;
          line-height: 1;
        }

        .card-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .card-suit {
          font-size: 48px;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .card-suit {
            font-size: 36px;
          }
          
          .card-value-small {
            font-size: 14px;
          }
          
          .card-suit-small {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .card-suit {
            font-size: 28px;
          }
          
          .card-value-small {
            font-size: 12px;
          }
          
          .card-suit-small {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}

export default Card