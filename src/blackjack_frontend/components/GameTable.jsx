import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, VolumeX, Zap } from 'lucide-react'
import Card from './Card'
import BetModal from './BetModal'
import ResultModal from './ResultModal'
import { useAuth } from '../contexts/AuthContext'
import { parseBackendResponse, logBackendResponse, safeGet, safeGetArray } from '../utils/backendUtils'

const GameTable = ({ playerHP, setPlayerHP, onGameOver, onBackToMenu, playerStats, setPlayerStats }) => {
  const { actor } = useAuth()
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBetModal, setShowBetModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [dealingCards, setDealingCards] = useState(false)
  const [lastHPChange, setLastHPChange] = useState(0)
  const [gameOverDelay, setGameOverDelay] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (playerHP <= 0 && !gameOverDelay) {
      // Add delay before showing game over to let player see final cards
      setGameOverDelay(true)
      const timer = setTimeout(() => {
        onGameOver()
      }, 3000) // 3 second delay
      
      return () => clearTimeout(timer)
    }
  }, [playerHP, onGameOver, gameOverDelay])

  const initializeGame = async () => {
    try {
      setLoading(true)
      // Always start with 100 HP
      setPlayerHP(100)
      const response = await actor.createGame(100)
      const newGameState = parseBackendResponse(response)
      logBackendResponse('createGame', response, newGameState)
      
      if (newGameState) {
        setGameState(newGameState)
        setShowBetModal(true)
      }
    } catch (error) {
      console.error('Failed to initialize game:', error)
    } finally {
      setLoading(false)
    }
  }

  const performGameAction = async (action) => {
    if (!gameState || !actor) return
    
    try {
      setLoading(true)
      const response = await actor.performGameAction(action)
      const result = parseBackendResponse(response)
      logBackendResponse('performGameAction', response, result)
      
      if (result && result.success) {
        console.log('Action succeeded, updating game state')
        setGameState(result.gameState)
        
        // HP change is already converted to Number by parseBackendResponse
        const hpChange = result.hpChange || 0
        setLastHPChange(hpChange)
        
        // Update player HP
        if (hpChange !== 0) {
          const newHP = Math.max(0, playerHP + hpChange)
          setPlayerHP(newHP)
          
          // Update stats based on result
          if (result.gameState.roundResult) {
            const roundResult = result.gameState.roundResult[0]
            if (roundResult === 'win' || roundResult === 'blackjack') {
              setPlayerStats(prev => ({ ...prev, totalWins: prev.totalWins + 1 }))
            }
          }
          
          // Update HP in backend
          try {
            await actor.updatePlayerHP(newHP, hpChange)
          } catch (updateError) {
            console.error('Failed to update HP:', updateError)
          }
          
          // Check if HP is 0 after update
          if (newHP <= 0) {
            console.log('Player HP reached 0, triggering game over')
            // Game over will be triggered by useEffect that monitors playerHP
          }
        }
        
        // Show result modal if game phase is result
        if (result.gameState.gamePhase === 'result') {
          setTimeout(() => {
            setShowResultModal(true)
          }, 1500)
        }
      } else {
        console.error('Action failed:', result)
        console.error('Result object:', JSON.stringify(result, null, 2))
      }
    } catch (error) {
      console.error('Failed to perform game action:', error)
    } finally {
      setLoading(false)
    }
  }

  const startRound = async (betAmount) => {
    setShowBetModal(false)
    setDealingCards(true)
    
    // Check if player has enough HP to bet
    if (betAmount > playerHP) {
      console.error('Not enough HP to place bet')
      setShowBetModal(true)
      setDealingCards(false)
      return
    }
    
    // Check if player has 0 HP
    if (playerHP <= 0) {
      console.log('Player has 0 HP, triggering game over')
      setDealingCards(false)
      onGameOver()
      return
    }
    
    try {
      await performGameAction({ PlaceBet: betAmount })
    } catch (error) {
      console.error('Failed to start round:', error)
    } finally {
      setDealingCards(false)
    }
  }

  const hit = async () => {
    await performGameAction({ Hit: null })
  }

  const stand = async () => {
    await performGameAction({ Stand: null })
  }

  const doubleDown = async () => {
    await performGameAction({ DoubleDown: null })
  }

  const surrender = async () => {
    await performGameAction({ Surrender: null })
  }

  const nextRound = async () => {
    setShowResultModal(false)
    await performGameAction({ NextRound: null })
    setShowBetModal(true)
  }

  // Helper function to calculate hand value for display only
  const calculateHandValue = (hand) => {
    if (!hand || !Array.isArray(hand)) return 0
    
    let value = 0
    let aces = 0
    
    for (const card of hand) {
      if (card.value === 1) {
        aces++
        value += 11
      } else if (card.value > 10) {
        value += 10
      } else {
        value += card.value
      }
    }
    
    while (value > 21 && aces > 0) {
      value -= 10
      aces--
    }
    
    return value
  }

  if (loading && !gameState) {
    return (
      <div className="game-table">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Initializing game...</p>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="game-table">
        <div className="error-screen">
          <p>Failed to load game. Please try again.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    )
  }

  const playerValue = calculateHandValue(safeGetArray(gameState, 'playerHand'))
  const dealerValue = calculateHandValue(safeGetArray(gameState, 'dealerHand'))

  return (
    <div className="game-table">
      <div className="modern-bg"></div>
      
      {/* Header */}
      <div className="game-header glass">
        <button className="btn btn-secondary" onClick={onBackToMenu}>
          <ArrowLeft size={20} />
          Menu
        </button>
        
        <div className="game-info">
          <div className="round-info">
            <span>Round {safeGet(gameState, 'round', 1)}</span>
          </div>
          <div className="hp-display">
            <Zap size={20} />
            <span>HP: {playerHP}</span>
            <div className="hp-bar">
              <div 
                className="hp-fill" 
                style={{ width: `${playerHP}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <button 
          className="btn btn-secondary"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Game Area */}
      <div className="game-area">
        {/* Dealer Section */}
        <div className="dealer-section">
          <div className="player-info">
            <h3>🎩 Dealer</h3>
            <div className="hand-value glass">
              {gameState.gamePhase === 'playing' && gameState?.dealerHand && gameState.dealerHand.length > 1 ? 
                `${calculateHandValue([gameState.dealerHand[0]])} + ?` : 
                `Total: ${dealerValue}`
              }
            </div>
          </div>
          <div className="card-area">
            {safeGetArray(gameState, 'dealerHand').map((card, index) => (
              <Card 
                key={`dealer-${index}`}
                card={card} 
                hidden={gameState.gamePhase === 'playing' && index === 1}
                dealIndex={index}
              />
            ))}
          </div>
        </div>

        {/* Center Message */}
        <div className="center-message">
          <div className="message-card glass">
            <p>{safeGet(gameState, 'message', 'Waiting...')}</p>
            {gameOverDelay && (
              <div className="game-over-delay">
                <div className="spinner"></div>
                <p>Game ending in a moment...</p>
              </div>
            )}
            {safeGet(gameState, 'currentBet', 0) > 0 && (
              <div className="current-bet">
                <Zap size={16} />
                Bet: {gameState.currentBet} HP
              </div>
            )}
          </div>
        </div>

        {/* Player Section */}
        <div className="player-section">
          <div className="card-area">
            {safeGetArray(gameState, 'playerHand').map((card, index) => (
              <Card 
                key={`player-${index}`}
                card={card}
                dealIndex={index}
              />
            ))}
          </div>
          <div className="player-info">
            <h3>🎯 You</h3>
            <div className="hand-value glass">
              Total: {playerValue}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {gameState?.gamePhase === 'playing' && !dealingCards && !gameOverDelay && (
          <div className="action-buttons slide-in-up">
            <button 
              className="btn btn-success" 
              onClick={hit}
              disabled={loading || gameOverDelay}
            >
              Hit
            </button>
            <button 
              className="btn btn-danger" 
              onClick={stand}
              disabled={loading || gameOverDelay}
            >
              Stand
            </button>
            {gameState?.canDouble && (
              <button 
                className="btn btn-secondary" 
                onClick={doubleDown}
                disabled={loading || gameOverDelay || playerHP < (gameState?.currentBet || 0)}
              >
                Double
              </button>
            )}
            <button 
              className="btn btn-secondary" 
              onClick={surrender}
              disabled={loading || gameOverDelay}
            >
              Surrender
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showBetModal && (
        <BetModal 
          maxBet={playerHP}
          onBet={startRound}
        />
      )}

      {showResultModal && gameState?.roundResult && (
        <ResultModal 
          result={gameState.roundResult[0]}
          message={gameState?.message || ''}
          hpChange={lastHPChange}
          onNextRound={nextRound}
          onBackToMenu={onBackToMenu}
        />
      )}

      <style jsx>{`
        .game-table {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
          position: relative;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          margin: 20px;
          border-radius: 20px;
        }

        .game-info {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .round-info {
          color: #ffffff;
          font-size: 18px;
          font-weight: 700;
        }

        .hp-display {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
        }

        .game-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          min-height: calc(100vh - 140px);
          justify-content: space-between;
        }

        .dealer-section, .player-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
          max-width: 800px;
        }

        .player-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .player-info h3 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
        }

        .hand-value {
          padding: 12px 24px;
          border-radius: 12px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 700;
          min-width: 120px;
          text-align: center;
        }

        .card-area {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          min-height: 180px;
          align-items: center;
        }

        .center-message {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }

        .message-card {
          padding: 32px 48px;
          border-radius: 20px;
          text-align: center;
          min-width: 300px;
        }

        .message-card p {
          color: #ffffff;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .current-bet {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          font-weight: 600;
        }

        .game-over-delay {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .action-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 40px;
        }

        .action-buttons .btn {
          min-width: 120px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .game-header {
            padding: 20px;
            margin: 10px;
          }
          
          .game-info {
            gap: 20px;
          }
          
          .game-area {
            padding: 20px;
          }
          
          .card-area {
            gap: 12px;
          }
          
          .action-buttons {
            gap: 12px;
          }
          
          .action-buttons .btn {
            min-width: 100px;
            padding: 12px 20px;
            font-size: 14px;
          }
          
          .message-card {
            padding: 24px 32px;
            min-width: 250px;
          }
        }
      `}</style>
    </div>
  )
}

export default GameTable