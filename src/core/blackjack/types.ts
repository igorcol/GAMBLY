export type Suit = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  isHidden: boolean;
}

export type ActionType = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT';

export interface GameAction {
  type: ActionType;
  payload?: unknown;
}

export type GamePhase = 'IDLE' | 'BETTING' | 'DEALING' | 'PLAYER_TURN' | 'DEALER_TURN' | 'PAYOUT';

export type HandResult = 'WIN' | 'LOSS' | 'PUSH' | 'BUST' | 'BLACKJACK' | 'NONE';

export interface Hand {
  cards: Card[];
  isBusted: boolean;
  isStanding: boolean;
  score: number;
  result: HandResult;       
  bet: number;              
  payout: number;
  // --- REGRAS AVANÇADAS ---
  isDoubled: boolean;       // Se a mão foi dobrada
  isSplitted: boolean;      // Se a mão veio de um split
}

export interface GameState {
  phase: GamePhase;
  playerHands: Hand[];      
  activeHandIndex: number;  // Qual mão estamos jogando no momento
  dealerHand: Hand;
}