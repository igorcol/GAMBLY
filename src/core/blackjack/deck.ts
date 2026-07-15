import { Card, Rank, Suit } from './types'

const SUITS: Suit[] = ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES']
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export const createDeck = (numberOfDecks: number = 1): Card[] => {
  const deck: Card[] = []
  
  for (let i = 0; i < numberOfDecks; i++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ suit, rank, isHidden: false })
      }
    }
  }
  
  return deck
}

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck]
  
  // Algoritmo Fisher-Yates: o mais performático e justo para arrays
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

export const calculateScore = (cards: Card[]): number => {
  let score = 0
  let acesCount = 0

  for (const card of cards) {
    // Carta virada para baixo (Dealer) não entra na contagem visível
    if (card.isHidden) continue

    if (card.rank === 'A') {
      acesCount += 1
      score += 11 // Assume valor máximo primeiro
    } else if (['J', 'Q', 'K'].includes(card.rank)) {
      score += 10
    } else {
      score += parseInt(card.rank, 10)
    }
  }

  // Ajusta o valor do Ás de 11 para 1 se a mão estourar 21
  while (score > 21 && acesCount > 0) {
    score -= 10
    acesCount -= 1
  }

  return score
}