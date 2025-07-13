/**
 * types.mo
 * Shared types for Motoko Blackjack backend
 */

import Text "mo:base/Text";

module {
  /** Basic player stats for tracking wins/losses */
  public type PlayerStats = {
    totalWins: Nat;
    totalLoses: Nat;
    totalGames: Nat;
  };

  /** Card object (suit and value) */
  public type Card = {
    suit: Text;
    value: Nat;
  };

  /** State of a single blackjack game */
  public type GameState = {
    id: Text;
    playerHand: [Card];
    dealerHand: [Card];
    deck: [Card];
    playerHP: Nat;
    currentBet: Nat;
    gamePhase: Text; // "betting", "playing", "dealer", "result"
    roundResult: ?Text;
    message: Text;
    round: Nat;
    canDouble: Bool;
    canSplit: Bool;
    createdAt: Int;
    updatedAt: Int;
  };

  /** Supported game actions */
  public type GameAction = {
    #PlaceBet: Nat;
    #Hit;
    #Stand;
    #DoubleDown;
    #Surrender;
    #Split;
    #NextRound;
  };

  /** Result of a game action */
  public type GameResult = {
    gameState: GameState;
    hpChange: Int;
    success: Bool;
    message: Text;
  };
}
