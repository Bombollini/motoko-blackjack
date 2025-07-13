/**
 * deck.mo
 * Card deck utilities for Blackjack
 */

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Types "./types";

module {
  /**
   * Create a standard 52-card deck
   * @return Array of 52 cards (4 suits × 13 values)
   */
  public func createDeck() : [Types.Card] {
    let suits = ["♠", "♥", "♦", "♣"];
    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let deck = Buffer.Buffer<Types.Card>(52);
    
    for (suit in suits.vals()) {
      for (value in values.vals()) {
        deck.add({ suit = suit; value = value });
      };
    };
    
    Buffer.toArray(deck);
  };

  /**
   * Shuffle a deck using Fisher-Yates algorithm with time-based randomness
   * @param deck The deck to shuffle
   * @return Shuffled deck
   */
  public func shuffleDeck(deck: [Types.Card]) : [Types.Card] {
    let mutableDeck = Array.thaw<Types.Card>(deck);
    let size = mutableDeck.size();
    
    // Generate seed from current time
    let seed = Int.abs(Time.now()) % 1000000;
    var currentSeed = seed;
    
    // Fisher-Yates shuffle
    for (i in Iter.range(0, size - 1)) {
      currentSeed := (currentSeed * 1103515245 + 12345) % 2147483647;
      let j = if (i < size) {
        Int.abs(currentSeed) % Nat.max(1, (size - i)) + i
      } else {
        i
      };
      
      let temp = mutableDeck[i];
      mutableDeck[i] := mutableDeck[j];
      mutableDeck[j] := temp;
    };
    
    Array.freeze(mutableDeck);
  };

  /**
   * Deal a card from the top of the deck
   * @param deck The deck to deal from
   * @return (card, remaining deck)
   */
  public func dealCard(deck: [Types.Card]) : (Types.Card, [Types.Card]) {
    let deckSize = deck.size();
    if (deckSize == 0) {
      // Return default card if deck is empty (shouldn't happen in normal play)
      let defaultCard = { suit = "♠"; value = 1 };
      (defaultCard, []);
    } else {
      let card = deck[deckSize - 1];
      let newDeck = Array.tabulate<Types.Card>(deckSize - 1, func(i) = deck[i]);
      (card, newDeck);
    };
  };
}
