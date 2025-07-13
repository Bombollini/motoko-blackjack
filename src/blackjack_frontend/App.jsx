import { useState, useEffect } from 'react'
import MainMenu from './components/MainMenu'
import GameTable from './components/GameTable'
import GameOver from './components/GameOver'
import ProfileNew from './components/ProfileNew'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'gameOver', 'profile'
  const [playerHP, setPlayerHP] = useState(100)
  const [playerStats, setPlayerStats] = useState({
    name: 'Player',
    avatar: '🎯',
    totalWins: 0,
    totalLoses: 0
  })
  
  const { isAuthenticated, actor } = useAuth()

  useEffect(() => {
    if (isAuthenticated && actor) {
      loadPlayerProfile()
    }
  }, [isAuthenticated, actor])

  const loadPlayerProfile = async () => {
    try {
      const profile = await actor.getProfile()
      if (profile && profile.length > 0) {
        setPlayerStats({
          name: profile[0].username,
          avatar: profile[0].photoUrl && profile[0].photoUrl.length > 0 ? profile[0].photoUrl[0] : '🎯',
          totalWins: Number(profile[0].totalWins),
          totalLoses: Number(profile[0].totalLoses)
        })
      }
    } catch (error) {
      console.error('Failed to load player profile:', error)
    }
  }

  const updateGameStats = async (won) => {
    if (isAuthenticated && actor) {
      try {
        await actor.updateGameStats(won)
        await loadPlayerProfile() // Refresh profile after update
      } catch (error) {
        console.error('Failed to update game stats:', error)
      }
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

  const showProfile = () => {
    setGameState('profile')
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
          onShowProfile={showProfile}
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
      
      {gameState === 'profile' && (
        <ProfileNew 
          onBack={backToMenu}
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