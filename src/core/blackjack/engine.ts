import { GameState, GameAction, Card, Hand } from './types'
import { createDeck, shuffleDeck, calculateScore } from './deck'

export class BlackjackEngine {
  private deck: Card[] = []
  private state: GameState
  private onStateChange: (state: GameState) => void

  constructor(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange
    this.state = this.getInitialState()
  }

  private getInitialState(): GameState {
    return {
      phase: 'IDLE',
      playerHands: [{ cards: [], isBusted: false, isStanding: false, score: 0 }],
      activeHandIndex: 0,
      dealerHand: { cards: [], isBusted: false, isStanding: false, score: 0 }
    }
  }

  // Emite um clone profundo do estado para impedir que o React (UI) mute o Core acidentalmente
  private emitState() {
    this.onStateChange(structuredClone(this.state))
  }

  public startGame() {
    this.deck = shuffleDeck(createDeck(6)) // Padrão de cassino: 6 decks
    this.state = this.getInitialState()
    this.state.phase = 'BETTING'
    this.emitState()
  }

  public placeBet(amount: number) {
    if (this.state.phase !== 'BETTING') return
    // TODO no v1.0: Subtrair do bankroll global aqui
    this.state.phase = 'DEALING'
    this.emitState()
    this.dealInitialCards()
  }

  private dealInitialCards() {
    const playerHand = this.state.playerHands[0]
    const dealerHand = this.state.dealerHand

    // Ordem oficial: Jogador -> Dealer (escondida) -> Jogador -> Dealer (aberta)
    playerHand.cards.push(this.drawCard()!)
    
    const hiddenCard = this.drawCard()!
    hiddenCard.isHidden = true
    dealerHand.cards.push(hiddenCard)
    
    playerHand.cards.push(this.drawCard()!)
    dealerHand.cards.push(this.drawCard()!)

    this.updateScores()

    // Verifica Blackjack natural no momento do deal
    if (playerHand.score === 21) {
      this.state.phase = 'PAYOUT'
      this.revealDealerCard()
    } else {
      this.state.phase = 'PLAYER_TURN'
    }
    
    this.emitState()
  }

  private drawCard(): Card | undefined {
    return this.deck.pop()
  }

  private updateScores() {
    const activeHand = this.state.playerHands[this.state.activeHandIndex]
    activeHand.score = calculateScore(activeHand.cards)
    activeHand.isBusted = activeHand.score > 21

    this.state.dealerHand.score = calculateScore(this.state.dealerHand.cards)
    this.state.dealerHand.isBusted = this.state.dealerHand.score > 21
  }

  public dispatch(action: GameAction) {
    if (this.state.phase !== 'PLAYER_TURN') return

    const activeHand = this.state.playerHands[this.state.activeHandIndex]

    switch (action.type) {
      case 'HIT':
        activeHand.cards.push(this.drawCard()!)
        this.updateScores()
        
        if (activeHand.isBusted) {
          this.state.phase = 'PAYOUT' // Se estourar 21, acabou o turno
          this.revealDealerCard()
        }
        break
        
      case 'STAND':
        activeHand.isStanding = true
        this.state.phase = 'DEALER_TURN'
        this.playDealerTurn()
        return // playDealerTurn já lida com a emissão final
    }

    this.emitState()
  }

  private revealDealerCard() {
    if (this.state.dealerHand.cards[0]) {
      this.state.dealerHand.cards[0].isHidden = false
      this.updateScores()
    }
  }

  private playDealerTurn() {
    this.revealDealerCard()

    // Regra clássica: Dealer sempre compra até ter 17 ou mais
    while (this.state.dealerHand.score < 17) {
      this.state.dealerHand.cards.push(this.drawCard()!)
      this.updateScores()
    }

    this.state.phase = 'PAYOUT'
    this.emitState()
  }
}