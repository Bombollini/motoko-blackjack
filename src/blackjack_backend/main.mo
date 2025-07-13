import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";

actor BlackjackBackend {
  // Types
  public type UserProfile = {
    username: Text;
    photoUrl: ?Text;
    totalWins: Nat;
    totalLoses: Nat;
    totalGames: Nat;
    registeredAt: Int;
    lastActive: Int;
  };

  public type GameStats = {
    wins: Nat;
    loses: Nat;
    games: Nat;
  };

  public type Card = {
    suit: Text;
    value: Nat;
  };

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

  public type GameAction = {
    #PlaceBet: Nat;
    #Hit;
    #Stand;
    #DoubleDown;
    #Surrender;
    #Split;
    #NextRound;
  };

  public type GameResult = {
    gameState: GameState;
    hpChange: Int;
    success: Bool;
    message: Text;
  };

  // State
  private stable var userProfilesEntries : [(Principal, UserProfile)] = [];
  private var userProfiles = Map.HashMap<Principal, UserProfile>(0, Principal.equal, Principal.hash);
  
  private stable var gameStatesEntries : [(Principal, GameState)] = [];
  private var gameStates = Map.HashMap<Principal, GameState>(0, Principal.equal, Principal.hash);
  
  private stable var gameIdCounter : Nat = 0;

  // Initialize from stable storage
  system func preupgrade() {
    userProfilesEntries := Iter.toArray(userProfiles.entries());
    gameStatesEntries := Iter.toArray(gameStates.entries());
  };

  system func postupgrade() {
    userProfiles := Map.fromIter(userProfilesEntries.vals(), userProfilesEntries.size(), Principal.equal, Principal.hash);
    gameStates := Map.fromIter(gameStatesEntries.vals(), gameStatesEntries.size(), Principal.equal, Principal.hash);
  };

  // Game Logic Helper Functions
  private func createDeck() : [Card] {
    let suits = ["♠", "♥", "♦", "♣"];
    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let deck = Buffer.Buffer<Card>(52);
    
    for (suit in suits.vals()) {
      for (value in values.vals()) {
        deck.add({
          suit = suit;
          value = value;
        });
      };
    };
    
    Buffer.toArray(deck);
  };

  private func shuffleDeck(deck: [Card]) : [Card] {
    let mutableDeck = Array.thaw<Card>(deck);
    let size = mutableDeck.size();
    
    // Simple shuffle using time-based randomness
    let seed = Int.abs(Time.now()) % 1000000;
    var currentSeed = seed;
    
    for (i in Iter.range(0, size - 1)) {
      currentSeed := (currentSeed * 1103515245 + 12345) % 2147483647;
      let j = Int.abs(currentSeed) % (size - i) + i;
      
      let temp = mutableDeck[i];
      mutableDeck[i] := mutableDeck[j];
      mutableDeck[j] := temp;
    };
    
    Array.freeze(mutableDeck);
  };

  private func dealCard(deck: [Card]) : (Card, [Card]) {
    let deckSize = deck.size();
    if (deckSize == 0) {
      // Return a default card if deck is empty (shouldn't happen in normal play)
      let defaultCard = { suit = "♠"; value = 1 };
      (defaultCard, []);
    } else {
      let card = deck[deckSize - 1];
      let newDeck = Array.tabulate<Card>(deckSize - 1, func(i) = deck[i]);
      (card, newDeck);
    };
  };

  private func calculateHandValue(hand: [Card]) : Nat {
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
    
    // Adjust for aces
    while (value > 21 and aces > 0) {
      value -= 10;
      aces -= 1;
    };
    
    value;
  };

  private func isBlackjack(hand: [Card]) : Bool {
    hand.size() == 2 and calculateHandValue(hand) == 21;
  };

  private func isBust(hand: [Card]) : Bool {
    calculateHandValue(hand) > 21;
  };

  private func determineWinner(playerHand: [Card], dealerHand: [Card]) : Text {
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

  private func generateGameId() : Text {
    gameIdCounter += 1;
    "game_" # Nat.toText(gameIdCounter) # "_" # Int.toText(Time.now());
  };

  // Game Management Functions
  public shared(msg) func createGame(initialHP: Nat) : async ?GameState {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return null;
    };
    
    let gameId = generateGameId();
    let shuffledDeck = shuffleDeck(createDeck());
    
    // Always start with 100 HP, ignore initialHP parameter
    let gameState : GameState = {
      id = gameId;
      playerHand = [];
      dealerHand = [];
      deck = shuffledDeck;
      playerHP = 100;
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
    
    gameStates.put(caller, gameState);
    ?gameState;
  };

  public query(msg) func getGameState() : async ?GameState {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return null;
    };
    gameStates.get(caller);
  };

  public shared(msg) func performGameAction(action: GameAction) : async ?GameResult {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
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

  private func processGameAction(gameState: GameState, action: GameAction) : GameResult {
    switch (action) {
      case (#PlaceBet(amount)) {
        placeBet(gameState, amount);
      };
      case (#Hit) {
        hit(gameState);
      };
      case (#Stand) {
        stand(gameState);
      };
      case (#DoubleDown) {
        doubleDown(gameState);
      };
      case (#Surrender) {
        surrender(gameState);
      };
      case (#Split) {
        split(gameState);
      };
      case (#NextRound) {
        nextRound(gameState);
      };
    };
  };

  private func placeBet(gameState: GameState, betAmount: Nat) : GameResult {
    if (gameState.gamePhase != "betting") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot place bet at this time";
      };
    };
    
    if (betAmount > gameState.playerHP) {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Not enough HP to place this bet";
      };
    };
    
    // Check if HP is 0 or less
    if (gameState.playerHP == 0) {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Game Over! No HP left to place bet";
      };
    };
    
    // Deal initial cards
    let (playerCard1, deck1) = dealCard(gameState.deck);
    let (dealerCard1, deck2) = dealCard(deck1);
    let (playerCard2, deck3) = dealCard(deck2);
    let (dealerCard2, deck4) = dealCard(deck3);
    
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
        let hpChange = if (betAmount >= 2) betAmount + (betAmount / 2) else betAmount + 1; // 1.5x payout, minimum 1
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

  private func hit(gameState: GameState) : GameResult {
    if (gameState.gamePhase != "playing") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot hit at this time";
      };
    };
    
    let (newCard, newDeck) = dealCard(gameState.deck);
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

  private func stand(gameState: GameState) : GameResult {
    if (gameState.gamePhase != "playing") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot stand at this time";
      };
    };
    
    // Play dealer's turn
    let dealerResult = playDealerTurn(gameState);
    dealerResult;
  };

  private func playDealerTurn(gameState: GameState) : GameResult {
    var currentDealerHand = gameState.dealerHand;
    var currentDeck = gameState.deck;
    
    // Dealer draws until 17 or higher
    while (calculateHandValue(currentDealerHand) < 17) {
      let (newCard, newDeck) = dealCard(currentDeck);
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

  private func doubleDown(gameState: GameState) : GameResult {
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
    
    let (newCard, newDeck) = dealCard(gameState.deck);
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

  private func surrender(gameState: GameState) : GameResult {
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

  private func split(gameState: GameState) : GameResult {
    // Split functionality would be more complex - for now return not implemented
    {
      gameState = gameState;
      hpChange = 0;
      success = false;
      message = "Split not implemented yet";
    };
  };

  private func nextRound(gameState: GameState) : GameResult {
    if (gameState.gamePhase != "result") {
      return {
        gameState = gameState;
        hpChange = 0;
        success = false;
        message = "Cannot start next round at this time";
      };
    };
    
    let shuffledDeck = shuffleDeck(createDeck());
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

  // User Profile Functions
  public query(msg) func getProfile() : async ?UserProfile {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return null;
    };
    userProfiles.get(caller);
  };

  public shared(msg) func createProfile(username: Text, photoUrl: ?Text) : async Bool {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return false;
    };

    let profile : UserProfile = {
      username = username;
      photoUrl = photoUrl;
      totalWins = 0;
      totalLoses = 0;
      totalGames = 0;
      registeredAt = Time.now();
      lastActive = Time.now();
    };

    userProfiles.put(caller, profile);
    true;
  };

  public shared(msg) func updateProfile(username: Text, photoUrl: ?Text) : async Bool {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return false;
    };

    switch (userProfiles.get(caller)) {
      case null { false };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          username = username;
          photoUrl = photoUrl;
          totalWins = existingProfile.totalWins;
          totalLoses = existingProfile.totalLoses;
          totalGames = existingProfile.totalGames;
          registeredAt = existingProfile.registeredAt;
          lastActive = Time.now();
        };
        userProfiles.put(caller, updatedProfile);
        true;
      };
    };
  };

  public shared(msg) func updateGameStats(won: Bool) : async Bool {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return false;
    };

    switch (userProfiles.get(caller)) {
      case null { false };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          username = existingProfile.username;
          photoUrl = existingProfile.photoUrl;
          totalWins = if (won) existingProfile.totalWins + 1 else existingProfile.totalWins;
          totalLoses = if (won) existingProfile.totalLoses else existingProfile.totalLoses + 1;
          totalGames = existingProfile.totalGames + 1;
          registeredAt = existingProfile.registeredAt;
          lastActive = Time.now();
        };
        userProfiles.put(caller, updatedProfile);
        true;
      };
    };
  };

  public shared(msg) func updatePlayerHP(newHP: Nat, hpChange: Int) : async Bool {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return false;
    };

    switch (gameStates.get(caller)) {
      case null { false };
      case (?gameState) {
        let updatedGameState = {
          gameState with
          playerHP = newHP;
          updatedAt = Time.now();
        };
        gameStates.put(caller, updatedGameState);
        
        // Also update game stats if round ended
        if (gameState.gamePhase == "result") {
          switch (gameState.roundResult) {
            case (?"win") { ignore updateGameStats(true); };
            case (?"blackjack") { ignore updateGameStats(true); };
            case (?"lose") { ignore updateGameStats(false); };
            case (?"bust") { ignore updateGameStats(false); };
            case (_) { }; // push, surrender - no stats update
          };
        };
        
        true;
      };
    };
  };

  // Add function to check if player can continue
  public query(msg) func canContinueGame() : async Bool {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return false;
    };
    
    switch (gameStates.get(caller)) {
      case null { false };
      case (?gameState) {
        gameState.playerHP > 0;
      };
    };
  };

  public query func getAllProfiles() : async [(Principal, UserProfile)] {
    Iter.toArray(userProfiles.entries());
  };

  public query func getTotalUsers() : async Nat {
    userProfiles.size();
  };

  // Legacy function for compatibility
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
