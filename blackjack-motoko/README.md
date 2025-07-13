# Blackjack Game in Motoko

This project is a Blackjack game implemented in Motoko, designed to run on the Internet Computer. It consists of a backend that handles game logic and user profiles, and a frontend that provides a user interface for players to interact with the game.

## Project Structure

```
blackjack-motoko
├── src
│   ├── blackjack_backend
│   │   └── main.mo          # Main logic for the Blackjack game
│   └── blackjack_frontend
│       ├── src
│       │   ├── index.html    # Main HTML file for the frontend
│       │   ├── index.js      # JavaScript code for user interactions
│       │   └── index.css     # CSS styles for the frontend
│       └── assets
│           └── sample-asset.txt # Sample asset for the frontend
├── .vessel
│   └── package-set.dhall     # Vessel package manager configuration
├── dfx.json                   # DFINITY SDK configuration file
├── vessel.dhall               # Main configuration file for Vessel
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd blackjack-motoko
   ```

2. **Install Dependencies**
   Make sure you have [Vessel](https://vessel.dfinity.org/) installed. Then run:
   ```bash
   vessel install
   ```

3. **Start the Local Development Environment**
   Ensure you have the DFINITY SDK installed. Then run:
   ```bash
   dfx start
   ```

4. **Deploy the Backend**
   In a new terminal, run:
   ```bash
   dfx deploy
   ```

5. **Run the Frontend**
   Open `src/blackjack_frontend/src/index.html` in your web browser to start playing the game.

## Usage

- Create a user profile to start playing.
- Place bets and make decisions (hit, stand, double down, etc.) during the game.
- Track your wins and losses through your user profile.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project. 

## License

This project is licensed under the MIT License. See the LICENSE file for details.