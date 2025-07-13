import { useState, useEffect } from 'react'
import MainMenu from './components/MainMenu'
import GameTable from './components/GameTable'
import GameOver from './components/GameOver'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'gameOver'
  const [playerHP, setPlayerHP] = useState(100)
  const [playerStats, setPlayerStats] = useState({
    name: 'Player',
    avatar: '🎯',
    totalWins: 0,
    totalLoses: 0
  })
  
  const { isAuthenticated, actor } = useAuth()

  // Load player stats from backend
  const loadPlayerStats = async () => {
    if (isAuthenticated && actor) {
      try {
        const stats = await actor.getPlayerStats()
        setPlayerStats(prev => ({
          ...prev,
          totalWins: Number(stats.totalWins),
          totalLoses: Number(stats.totalLoses)
        }))
      } catch (error) {
        console.error('Failed to load player stats:', error)
      }
    }
  }

  // Load stats when user authenticates
  useEffect(() => {
    loadPlayerStats()
  }, [isAuthenticated, actor])

  const updateGameStats = async (won) => {
    if (isAuthenticated && actor) {
      try {
        // Stats will be automatically updated by backend
        // Just reload the stats from backend
        await loadPlayerStats()
      } catch (error) {
        console.error('Failed to update game stats:', error)
      }
    } else {
      // Update local stats for non-authenticated users
      setPlayerStats(prev => ({
        ...prev,
        totalWins: won ? prev.totalWins + 1 : prev.totalWins,
        totalLoses: won ? prev.totalLoses : prev.totalLoses + 1
      }))
    }
  }

  const startGame = () => {
    if (!isAuthenticated) {
      alert('Please login with Internet Identity first to start playing!');
      return;
    }
    setGameState('playing');
  }

  const endGame = () => {
    setGameState('gameOver')
  }

  const resetGame = () => {
    setPlayerHP(100)
    setGameState('menu')
  }

  const backToMenu = () => {
    setGameState('menu')
  }

  const handleGameEnd = async (won) => {
    await updateGameStats(won)
    endGame()
  }

  return (
    <div className="app">
      {gameState === 'menu' && (
        <MainMenu 
          onStartGame={startGame}
          playerStats={playerStats}
        />
      )}
      
      {gameState === 'playing' && (
        <GameTable 
          playerHP={playerHP}
          setPlayerHP={setPlayerHP}
          onGameOver={endGame}
          onBackToMenu={backToMenu}
          playerStats={playerStats}
          setPlayerStats={setPlayerStats}
        />
      )}
      
      {gameState === 'gameOver' && (
        <GameOver 
          onRestart={resetGame}
          onBackToMenu={backToMenu}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App