# 🃏 Motoko Blackjack

> Full-stack decentralized Blackjack game built with **Motoko** (Internet Computer) for backend logic and **React + Vite** for the frontend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Motoko](https://img.shields.io/badge/backend-Motoko-orange.svg)
![React](https://img.shields.io/badge/frontend-React-blue.svg)
![Internet Computer](https://img.shields.io/badge/platform-Internet%20Computer-purple.svg)

---

## 🎮 Main Features

### 🎯 **Full Backend Game Logic (Motoko)**
- **Modular architecture** with separate modules for types, deck, game logic
- **Deck shuffling** with Fisher-Yates algorithm and time-based randomness
- **Dealer AI** following standard blackjack rules (hit until 17+)
- **Automatic card calculation** with Ace handling (1 or 11)
- **Blackjack detection** and 1.5x payout
- **Safe and immutable game state validation**

### 🎨 **Modern Frontend (React + Vite)**
- **Responsive UI** with smooth card animations
- **Real-time updates** from backend canister
- **Modern glassmorphism design** with dark theme
- **Mobile-friendly** interface
- **Sound effects** and visual feedback

### ⚡ **HP System**
- Each player starts with **100 HP**
- **Betting system** with HP as currency
- **Dynamic bet amounts** (5, 10, 25, 50, All-in)
- **Automatic HP reset** for each new game
- **Game over validation** when HP reaches 0

### 📊 **Simple Statistics Tracking**
- **Win/Loss tracking** via Internet Identity authentication
- **Persistent stats** stored on Internet Computer
- **Backend-managed statistics** with automatic updates
- **Clean and minimal UI** focused on gameplay

### 🎪 **Advanced Game Features**
- **Double Down** with bet doubling
- **Surrender** with half-bet loss
- **Split** (placeholder for future implementation)
- **Game Over delay** to view final dealer cards

---

## 🚀 How to Run Locally

### Prerequisites
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install) (v0.15.0+)
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

### 1. **Clone Repository**
```bash
git clone https://github.com/Bombollini/motoko-blackjack.git
cd motoko-blackjack
```

### 2. **Start Local Internet Computer Replica**
```bash
dfx start --background
```

### 3. **Deploy Backend Canister**
```bash
dfx deploy blackjack_backend
```

### 4. **Install Frontend Dependencies**
```bash
npm install
```

### 5. **Start Development Server**
```bash
npm run dev
```

### 6. **Access Application**
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend Candid UI**: [http://localhost:4943/?canisterId=...](http://localhost:4943) (see deploy output)

---

## 🏗️ Technical Architecture

### Backend (Motoko)
```motoko
// Modular architecture
lib/
├── types.mo      // Shared type definitions
├── deck.mo       // Card deck operations  
├── game.mo       // Core game logic
└── profile.mo    // [Removed - simplified stats only]

// Core data structures
type Card = { suit: Text; value: Nat };
type GameState = {
  playerHand: [Card];
  dealerHand: [Card];
  playerHP: Nat;
  currentBet: Nat;
  gamePhase: Text;
  // ... more fields
};
type PlayerStats = {
  totalWins: Nat;
  totalLoses: Nat;
  totalGames: Nat;
};

// Main game functions
public func createGame(initialHP: Nat) : async ?GameState
public func performGameAction(action: GameAction) : async ?GameResult
public func getGameState() : async ?GameState
public func getPlayerStats() : async PlayerStats
```

### Frontend (React + Vite)
```javascript
// Simplified component structure
App.jsx
├── MainMenu.jsx        // Main menu with stats display
├── GameTable.jsx       // Main game interface
│   ├── Card.jsx        // Card component
│   ├── BetModal.jsx    // Betting modal
│   └── ResultModal.jsx // Result display
├── GameOver.jsx        // Game over screen
└── HowToPlay.jsx       // Game instructions

// State management
- AuthContext (Internet Identity)
- Game state via backend calls
- Simple stats tracking (wins/losses)
- Local UI state (React hooks)
```

---

## 📂 Project Structure

```
📁 motoko-blackjack/
├── 📁 src/
│   ├── 📁 blackjack_backend/
│   │   ├── 📄 main.mo              # Main actor and coordinator
│   │   └── 📁 lib/                 # Modular backend architecture
│   │       ├── 📄 types.mo         # Shared type definitions
│   │       ├── 📄 deck.mo          # Card deck operations
│   │       └── 📄 game.mo          # Core game logic
│   ├── 📁 blackjack_frontend/
│   │   ├── 📄 App.jsx              # Main React app
│   │   ├── 📄 App.css              # Global styles
│   │   ├── 📄 index.html           # HTML template
│   │   ├── 📄 main.jsx             # React entry point
│   │   ├── 📁 components/          # React components
│   │   │   ├── 📄 GameTable.jsx    # Main game interface
│   │   │   ├── 📄 Card.jsx         # Card component
│   │   │   ├── 📄 BetModal.jsx     # Betting modal
│   │   │   ├── 📄 ResultModal.jsx  # Result display
│   │   │   ├── 📄 MainMenu.jsx     # Main menu with stats
│   │   │   ├── 📄 HowToPlay.jsx    # Game instructions
│   │   │   └── 📄 GameOver.jsx     # Game over screen
│   │   ├── 📁 contexts/
│   │   │   └── 📄 AuthContext.jsx  # Auth state management
│   │   └── 📁 utils/
│   │       ├── 📄 actor.js         # Canister interaction
│   │       └── 📄 gameLogic.js     # Frontend game utilities
│   └── 📁 declarations/            # Auto-generated canister bindings
├── 📄 dfx.json                     # DFX configuration
├── 📄 package.json                 # NPM dependencies
├── 📄 vite.config.js               # Vite configuration
├── 📄 tsconfig.json                # TypeScript config
└── 📄 README.md                    # This file
```

---

## 🎯 Game Flow

1. **User Authentication** via Internet Identity (optional for stats)
2. **Game Creation** with HP = 100
3. **Bet Placement** (5-50 HP, or All-in)
4. **Card Dealing** (2 cards each)
5. **Player Actions** (Hit, Stand, Double Down, Surrender)
6. **Dealer Play** (automatic until 17+)
7. **Result Calculation** & HP update
8. **Stats Update** (wins/losses) - if authenticated
9. **Next Round** or **Game Over**

---

## 🛠️ Development

### Backend Development
```bash
# Deploy backend only
dfx deploy blackjack_backend

# Check backend logs
dfx canister logs blackjack_backend

# Reset backend state
dfx canister uninstall-code blackjack_backend
dfx deploy blackjack_backend
```

### Frontend Development
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run frontend tests
npm test

# Backend testing via Candid UI
# Navigate to: http://localhost:4943/?canisterId=...
```

---

## 🌐 Deployment

### Local Deployment
```bash
dfx start --background
dfx deploy
```

### IC Mainnet Deployment
```bash
dfx deploy --network ic
```

---

## 🎮 Game Features

### ✅ **Implemented**
- Full blackjack game logic with Motoko backend
- HP-based betting system
- Internet Identity authentication
- Win/Loss statistics tracking
- Responsive React frontend
- Double Down and Surrender actions
- Automatic dealer play
- Game over detection

### 🚧 **Future Enhancements**
- Split functionality (currently placeholder)
- Insurance bets
- Multiple deck support
- Tournament mode
- Sound effects and animations
- Leaderboard system

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Munra / Bombollini**
- GitHub: [@Bombollini](https://github.com/Bombollini)
- Project: [motoko-blackjack](https://github.com/Bombollini/motoko-blackjack)

---

## 🙏 Acknowledgments

- [Internet Computer](https://internetcomputer.org/) - Decentralized platform
- [Motoko](https://internetcomputer.org/docs/current/motoko/main/motoko) - Smart contract language
- [React](https://react.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide React](https://lucide.dev/) - Icons
