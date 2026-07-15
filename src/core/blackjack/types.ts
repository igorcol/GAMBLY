export type Suit = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  // Carta virada para baixo (ex: do dealer))
  isHidden: boolean;
}

export type ActionType = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT';

export interface GameAction {
  type: ActionType;
  payload?: unknown;
}

export type GamePhase = 'IDLE' | 'BETTING' | 'DEALING' | 'PLAYER_TURN' | 'DEALER_TURN' | 'PAYOUT';

export interface Hand {
  cards: Card[];
  isBusted: boolean;
  isStanding: boolean;
  score: number;
}

export interface GameState {
  phase: GamePhase;
  // Array de mãos para prever a mecânica de "Split" 
  playerHands: Hand[];
  activeHandIndex: number;
  dealerHand: Hand;
}