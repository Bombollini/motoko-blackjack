# 🃏 Motoko Blackjack

> Full-stack decentralized Blackjack game built with **Motoko** (Internet Computer) for backend logic and **React + Vite** for the frontend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Motoko](https://img.shields.io/badge/backend-Motoko-orange.svg)
![React](https://img.shields.io/badge/frontend-React-blue.svg)
![Internet Computer](https://img.shields.io/badge/platform-Internet%20Computer-purple.svg)

---

## 🎮 Fitur Utama

### 🎯 **Full Backend Game Logic (Motoko)**
- **Deck shuffling** with Fisher-Yates algorithm
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

### 🏆 **User Profile & Statistics**
- **Persistent user profiles** with Internet Identity
- **Win/Loss tracking** per user
- **Total games played** statistics
- **Last active** timestamps
- **Leaderboard ready** data structure

### 🎪 **Advanced Game Features**
- **Double Down** with bet doubling
- **Surrender** with half-bet loss
- **Split** (coming soon)
- **Insurance** (coming soon)
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

// Main game functions
public func createGame(initialHP: Nat) : async ?GameState
public func performGameAction(action: GameAction) : async ?GameResult
public func getGameState() : async ?GameState
```

### Frontend (React + Vite)
```javascript
// Component structure
App.jsx
├── MainMenu.jsx
├── Profile.jsx
├── GameTable.jsx
│   ├── Card.jsx
│   ├── BetModal.jsx
│   └── ResultModal.jsx
└── GameOver.jsx

// State management
- AuthContext (Internet Identity)
- Game state via backend calls
- Local UI state (React hooks)
```

---

## 📂 Project Structure

```
📁 motoko-blackjack/
├── 📁 src/
│   ├── 📁 blackjack_backend/
│   │   └── 📄 main.mo              # Motoko backend logic
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
│   │   │   ├── 📄 MainMenu.jsx     # Main menu
│   │   │   ├── 📄 Profile.jsx      # User profile
│   │   │   └── 📄 GameOver.jsx     # Game over screen
│   │   ├── 📁 contexts/
│   │   │   └── 📄 AuthContext.jsx  # Auth state management
│   │   └── 📁 utils/
│   │       ├── 📄 actor.js         # Canister interaction
│   │       └── 📄 backendUtils.js  # Response parsing
│   └── 📁 declarations/            # Auto-generated canister bindings
├── 📄 dfx.json                     # DFX configuration
├── 📄 package.json                 # NPM dependencies
├── 📄 vite.config.js               # Vite configuration
├── 📄 tsconfig.json                # TypeScript config
└── 📄 README.md                    # This file
```

---

## 🎯 Game Flow

1. **User Authentication** via Internet Identity
2. **Profile Creation** (first time users)
3. **Game Creation** with HP = 100
4. **Bet Placement** (5-50 HP, or All-in)
5. **Card Dealing** (2 cards each)
6. **Player Actions** (Hit, Stand, Double Down, Surrender)
7. **Dealer Play** (automatic until 17+)
8. **Result Calculation** & HP update
9. **Stats Update** (wins/losses)
10. **Next Round** or **Game Over**

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
