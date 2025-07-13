/**
 * game.mo
 * Core game logic for Blackjack
 */

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Types "./types";
import Deck "./deck";

module {
  /**
   * Calculate the total value of a hand
   * Handles Ace values (1 or 11) automatically
   * @param hand Array of cards
   * @return Total hand value
   */
  public func calculateHandValue(hand: [Types.Card]) : Nat {
    var value = 0;
    var aces = 0;
    
    for (card in hand.vals()) {
      if (card.value == 1) {
        aces += 1;
        value += 11;
      } else if (card.value > 10) {
        value += 10;
      } else {
        value += card.value;
      };
    };
    
    // Adjust for aces (convert 11 to 1 if needed)
    while (value > 21 and aces > 0) {
      value -= 10;
      aces -= 1;
    };
    
    value;
  };

  /**
   * Check if a hand is blackjack (21 with 2 cards)
   * @param hand Array of cards
   * @return True if blackjack
   */
  public func isBlackjack(hand: [Types.Card]) : Bool {
    hand.size() == 2 and calculateHandValue(hand) == 21;
  };

  /**
   * Check if a hand is bust (over 21)
   * @param hand Array of cards
   * @return True if bust
   */
  public func isBust(hand: [Types.Card]) : Bool {
    calculateHandValue(hand) > 21;
  };

  /**
   * Determine the winner of a round
   * @param playerHand Player's cards
   * @param dealerHand Dealer's cards
   * @return "player", "dealer", or "push"
   */
  public func determineWinner(playerHand: [Types.Card], dealerHand: [Types.Card]) : Text {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);
    let playerBlackjack = isBlackjack(playerHand);
    let dealerBlackjack = isBlackjack(dealerHand);
    
    // Check for bust
    if (isBust(playerHand)) return "dealer";
    if (isBust(dealerHand)) return "player";
    
    // Check for blackjack
    if (playerBlackjack and dealerBlackjack) return "push";
    if (playerBlackjack) return "player";
    if (dealerBlackjack) return "dealer";
    
    // Compare values
    if (playerValue > dealerValue) return "player";
    if (dealerValue > playerValue) return "dealer";
    return "push";
  };

  /**
   * Generate a unique game ID
   * @param counter Current game counter
   * @return Unique game ID
   */
  public func generateGameId(counter: Nat) : Text {
    "game_" # Nat.toText(counter) # "_" # Int.toText(Time.now());
  };

  /**
   * Create a new game state
   * @param gameId Unique game identifier
   * @param playerHP Starting player HP
   * @return New game state
   */
  public func createNewGame(gameId: Text, playerHP: Nat) : Types.GameState {
    let shuffledDeck = Deck.shuffleDeck(Deck.createDeck());
    
    {
      id = gameId;
      playerHand = [];
      dealerHand = [];
      deck = shuffledDeck;
      playerHP = playerHP;
      currentBet = 0;
      gamePhase = "betting";
      roundResult = null;
      message = "Place your HP bet to start the round!";
      round = 1;
      canDouble = false;
      canSplit = false;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
  };

  /**
   * Process placing a bet
   * @param gameState Current game state
   * @param betAmount Amount to bet
   * @return Game result
   */
  public func placeBet(gameState: Types.GameState, betAmount: Nat) : Types.GameResult {
    // Validate game phase
    if (gameState.gamePhase != "betting") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot place bet at this time";
      };
    };
    
    // Validate bet amount
    if (betAmount > gameState.playerHP) {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Not enough HP to place this bet";
      };
    };
    
    // Check if HP is 0
    if (gameState.playerHP == 0) {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Game Over! No HP left to place bet";
      };
    };
    
    // Deal initial cards
    let (playerCard1, deck1) = Deck.dealCard(gameState.deck);
    let (dealerCard1, deck2) = Deck.dealCard(deck1);
    let (playerCard2, deck3) = Deck.dealCard(deck2);
    let (dealerCard2, deck4) = Deck.dealCard(deck3);
    
    let playerHand = [playerCard1, playerCard2];
    let dealerHand = [dealerCard1, dealerCard2];
    
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);
    
    var newGameState = {
      gameState with
      playerHand = playerHand;
      dealerHand = dealerHand;
      deck = deck4;
      currentBet = betAmount;
      gamePhase = "playing";
      message = "Choose your action!";
      canDouble = true;
      canSplit = playerCard1.value == playerCard2.value;
      updatedAt = Time.now();
    };
    
    // Check for blackjack
    if (playerValue == 21) {
      if (dealerValue == 21) {
        newGameState := {
          newGameState with
          gamePhase = "result";
          roundResult = ?"push";
          message = "Push! Both have Blackjack!";
        };
        return {
          gameState = newGameState;
          hpChange = 0;
          success = true;
          message = "Push! Both have Blackjack!";
        };
      } else {
        newGameState := {
          newGameState with
          gamePhase = "result";
          roundResult = ?"blackjack";
          message = "BLACKJACK! You win!";
        };
        // 1.5x payout for blackjack
        let hpChange = if (betAmount >= 2) betAmount + (betAmount / 2) else betAmount + 1;
        return {
          gameState = newGameState;
          hpChange = hpChange;
          success = true;
          message = "BLACKJACK! You win!";
        };
      };
    };
    
    {
      gameState = newGameState;
      hpChange = 0;
      success = true;
      message = "Cards dealt! Choose your action.";
    };
  };

  /**
   * Process hit action
   * @param gameState Current game state
   * @return Game result
   */
  public func hit(gameState: Types.GameState) : Types.GameResult {
    if (gameState.gamePhase != "playing") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot hit at this time";
      };
    };
    
    let (newCard, newDeck) = Deck.dealCard(gameState.deck);
    let newPlayerHand = Array.append(gameState.playerHand, [newCard]);
    let playerValue = calculateHandValue(newPlayerHand);
    
    var newGameState = {
      gameState with
      playerHand = newPlayerHand;
      deck = newDeck;
      canDouble = false;
      canSplit = false;
      updatedAt = Time.now();
    };
    
    if (playerValue > 21) {
      newGameState := {
        newGameState with
        gamePhase = "result";
        roundResult = ?"bust";
        message = "BUST! You lose!";
      };
      return {
        gameState = newGameState;
        hpChange = -(gameState.currentBet:Int);
        success = true;
        message = "BUST! You lose!";
      };
    } else if (playerValue == 21) {
      // Auto-stand on 21
      return stand(newGameState);
    };
    
    newGameState := {
      newGameState with
      message = "Total: " # Nat.toText(playerValue) # ". Hit or Stand?";
    };
    
    {
      gameState = newGameState;
      hpChange = 0;
      success = true;
      message = "Card dealt. Total: " # Nat.toText(playerValue);
    };
  };

  /**
   * Process stand action
   * @param gameState Current game state
   * @return Game result
   */
  public func stand(gameState: Types.GameState) : Types.GameResult {
    if (gameState.gamePhase != "playing") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot stand at this time";
      };
    };
    
    // Play dealer's turn
    playDealerTurn(gameState);
  };

  /**
   * Play the dealer's turn automatically
   * @param gameState Current game state
   * @return Game result
   */
  public func playDealerTurn(gameState: Types.GameState) : Types.GameResult {
    var currentDealerHand = gameState.dealerHand;
    var currentDeck = gameState.deck;
    
    // Dealer draws until 17 or higher
    while (calculateHandValue(currentDealerHand) < 17) {
      let (newCard, newDeck) = Deck.dealCard(currentDeck);
      currentDealerHand := Array.append(currentDealerHand, [newCard]);
      currentDeck := newDeck;
    };
    
    let winner = determineWinner(gameState.playerHand, currentDealerHand);
    let dealerValue = calculateHandValue(currentDealerHand);
    
    var result = "";
    var message = "";
    var hpChange:Int = 0;
    
    switch (winner) {
      case ("player") {
        result := "win";
        message := "You win!";
        hpChange := gameState.currentBet;
      };
      case ("dealer") {
        result := "lose";
        message := "Dealer wins!";
        hpChange := -(gameState.currentBet:Int);
      };
      case ("push") {
        result := "push";
        message := "Push!";
        hpChange := 0;
      };
      case (_) {
        result := "lose";
        message := "Unexpected result";
        hpChange := -(gameState.currentBet:Int);
      };
    };
    
    if (dealerValue > 21) {
      result := "win";
      message := "Dealer BUST! You win!";
      hpChange := gameState.currentBet;
    };
    
    let newGameState = {
      gameState with
      dealerHand = currentDealerHand;
      deck = currentDeck;
      gamePhase = "result";
      roundResult = ?result;
      message = message;
      updatedAt = Time.now();
    };
    
    {
      gameState = newGameState;
      hpChange = hpChange;
      success = true;
      message = message;
    };
  };

  /**
   * Process double down action
   * @param gameState Current game state
   * @return Game result
   */
  public func doubleDown(gameState: Types.GameState) : Types.GameResult {
    if (gameState.gamePhase != "playing") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot double down at this time";
      };
    };
    
    if (gameState.currentBet > gameState.playerHP) {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Not enough HP to double down";
      };
    };
    
    let (newCard, newDeck) = Deck.dealCard(gameState.deck);
    let newPlayerHand = Array.append(gameState.playerHand, [newCard]);
    let playerValue = calculateHandValue(newPlayerHand);
    
    let newGameState = {
      gameState with
      playerHand = newPlayerHand;
      deck = newDeck;
      currentBet = gameState.currentBet * 2;
      canDouble = false;
      canSplit = false;
      updatedAt = Time.now();
    };
    
    if (playerValue > 21) {
      let finalGameState = {
        newGameState with
        gamePhase = "result";
        roundResult = ?"bust";
        message = "BUST! You lose!";
      };
      return {
        gameState = finalGameState;
        hpChange = -(newGameState.currentBet:Int);
        success = true;
        message = "BUST! You lose!";
      };
    };
    
    // Auto-stand after double down
    playDealerTurn(newGameState);
  };

  /**
   * Process surrender action
   * @param gameState Current game state
   * @return Game result
   */
  public func surrender(gameState: Types.GameState) : Types.GameResult {
    if (gameState.gamePhase != "playing") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot surrender at this time";
      };
    };
    
    let newGameState = {
      gameState with
      gamePhase = "result";
      roundResult = ?"surrender";
      message = "Surrendered! Lost half bet.";
      updatedAt = Time.now();
    };
    
    {
      gameState = newGameState;
      hpChange = -(gameState.currentBet / 2:Int);
      success = true;
      message = "Surrendered! Lost half bet.";
    };
  };

  /**
   * Process split action (not implemented yet)
   * @param gameState Current game state
   * @return Game result
   */
  public func split(gameState: Types.GameState) : Types.GameResult {
    {
      gameState = gameState;
      hpChange = 0;
      success = false;
      message = "Split not implemented yet";
    };
  };

  /**
   * Start next round
   * @param gameState Current game state
   * @return Game result
   */
  public func nextRound(gameState: Types.GameState) : Types.GameResult {
    if (gameState.gamePhase != "result") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot start next round at this time";
      };
    };
    
    let shuffledDeck = Deck.shuffleDeck(Deck.createDeck());
    let newGameState = {
      gameState with
      playerHand = [];
      dealerHand = [];
      deck = shuffledDeck;
      currentBet = 0;
      gamePhase = "betting";
      roundResult = null;
      message = "Place your HP bet to start the round!";
      round = gameState.round + 1;
      canDouble = false;
      canSplit = false;
      updatedAt = Time.now();
    };
    
    {
      gameState = newGameState;
      hpChange = 0;
      success = true;
      message = "New round started!";
    };
  };
}
