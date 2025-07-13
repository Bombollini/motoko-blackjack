/**
 * main.mo
 * Main actor for Motoko Blackjack backend
 * 
 * This is the entry point for the Blackjack game canister.
 * It handles user authentication, game state management, and 
 * coordinates between different modules.
 */

import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Types "./lib/types";
import Game "./lib/game";

actor BlackjackBackend {
  // Import types from module
  public type Card = Types.Card;
  public type GameState = Types.GameState;
  public type GameAction = Types.GameAction;
  public type GameResult = Types.GameResult;
  public type PlayerStats = Types.PlayerStats;

  // Stable storage for upgrades
  private stable var gameStatesEntries : [(Principal, GameState)] = [];
  private stable var playerStatsEntries : [(Principal, PlayerStats)] = [];
  private stable var gameIdCounter : Nat = 0;

  // In-memory storage
  private var gameStates = Map.HashMap<Principal, GameState>(0, Principal.equal, Principal.hash);
  private var playerStats = Map.HashMap<Principal, PlayerStats>(0, Principal.equal, Principal.hash);

  /**
   * System hooks for canister upgrades
   */
  system func preupgrade() {
    gameStatesEntries := Iter.toArray(gameStates.entries());
    playerStatsEntries := Iter.toArray(playerStats.entries());
  };

  system func postupgrade() {
    gameStates := Map.fromIter(gameStatesEntries.vals(), gameStatesEntries.size(), Principal.equal, Principal.hash);
    playerStats := Map.fromIter(playerStatsEntries.vals(), playerStatsEntries.size(), Principal.equal, Principal.hash);
  };

  /**
   * Validate caller is not anonymous
   */
  private func validateCaller(caller: Principal) : Bool {
    not Principal.isAnonymous(caller);
  };

  // =============================================================================
  // GAME MANAGEMENT FUNCTIONS
  // =============================================================================

  /**
   * Create a new game for the caller
   * @param initialHP Starting HP (always reset to 100)
   * @return New game state or null if unauthorized
   */
  public shared(msg) func createGame(_initialHP: Nat) : async ?GameState {
    let caller = msg.caller;
    if (not validateCaller(caller)) {
      return null;
    };
    
    gameIdCounter += 1;
    let gameId = Game.generateGameId(gameIdCounter);
    let gameState = Game.createNewGame(gameId, 100); // Always start with 100 HP
    
    gameStates.put(caller, gameState);
    ?gameState;
  };

  /**
   * Get current game state for the caller
   * @return Game state or null if not found
   */
  public query(msg) func getGameState() : async ?GameState {
    let caller = msg.caller;
    if (not validateCaller(caller)) {
      return null;
    };
    gameStates.get(caller);
  };

  /**
   * Perform a game action
   * @param action The action to perform
   * @return Game result or null if unauthorized
   */
  public shared(msg) func performGameAction(action: GameAction) : async ?GameResult {
    let caller = msg.caller;
    if (not validateCaller(caller)) {
      return null;
    };
    
    switch (gameStates.get(caller)) {
      case null { null };
      case (?gameState) {
        let result = processGameAction(gameState, action);
        gameStates.put(caller, result.gameState);
        ?result;
      };
    };
  };

  /**
   * Process a game action using the Game module
   */
  private func processGameAction(gameState: GameState, action: GameAction) : GameResult {
    switch (action) {
      case (#PlaceBet(amount)) {
        Game.placeBet(gameState, amount);
      };
      case (#Hit) {
        Game.hit(gameState);
      };
      case (#Stand) {
        Game.stand(gameState);
      };
      case (#DoubleDown) {
        Game.doubleDown(gameState);
      };
      case (#Surrender) {
        Game.surrender(gameState);
      };
      case (#Split) {
        Game.split(gameState);
      };
      case (#NextRound) {
        Game.nextRound(gameState);
      };
    };
  };

  /**
   * Update player HP after a round
   * @param newHP New HP value
   * @param hpChange Change in HP
   * @return Success status
   */
  public shared(msg) func updatePlayerHP(newHP: Nat, _hpChange: Int) : async Bool {
    let caller = msg.caller;
    if (not validateCaller(caller)) {
      return false;
    };

    switch (gameStates.get(caller)) {
      case null { false };
      case (?gameState) {
        let updatedGameState = {
          gameState with
          playerHP = newHP;
          updatedAt = gameState.updatedAt; // Keep original timestamp for this update
        };
        gameStates.put(caller, updatedGameState);
        
        // Update game stats if round ended
        if (gameState.gamePhase == "result") {
          let won = switch (gameState.roundResult) {
            case (?"win") { true };
            case (?"blackjack") { true };
            case (?"lose") { false };
            case (?"bust") { false };
            case (_) { return true }; // push, surrender - no stats update needed
          };
          
          // Update player stats
          ignore updatePlayerStats(caller, won);
        };
        
        true;
      };
    };
  };

  /**
   * Check if player can continue playing
   * @return True if player has HP > 0
   */
  public query(msg) func canContinueGame() : async Bool {
    let caller = msg.caller;
    if (not validateCaller(caller)) {
      return false;
    };
    
    switch (gameStates.get(caller)) {
      case null { false };
      case (?gameState) {
        gameState.playerHP > 0;
      };
    };
  };

  /**
   * Update player statistics
   * @param caller The principal of the player
   * @param won Whether the player won
   * @return Success status
   */
  private func updatePlayerStats(caller: Principal, won: Bool) : Bool {
    let currentStats = switch (playerStats.get(caller)) {
      case null {
        { totalWins = 0; totalLoses = 0; totalGames = 0 };
      };
      case (?stats) { stats };
    };
    
    let newStats = {
      totalWins = if (won) currentStats.totalWins + 1 else currentStats.totalWins;
      totalLoses = if (won) currentStats.totalLoses else currentStats.totalLoses + 1;
      totalGames = currentStats.totalGames + 1;
    };
    
    playerStats.put(caller, newStats);
    true;
  };

  /**
   * Get player statistics
   * @return Player stats or default stats if not found
   */
  public query(msg) func getPlayerStats() : async PlayerStats {
    let caller = msg.caller;
    if (not validateCaller(caller)) {
      return { totalWins = 0; totalLoses = 0; totalGames = 0 };
    };
    
    switch (playerStats.get(caller)) {
      case null { { totalWins = 0; totalLoses = 0; totalGames = 0 } };
      case (?stats) { stats };
    };
  };

  /**
   * Legacy greeting function for compatibility
   * @param name Name to greet
   * @return Greeting message
   */
  public query func greet(name : Text) : async Text {
    "Hello, " # name # "!";
  };
};
