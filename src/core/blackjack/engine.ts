import { GameState, GameAction, Card, Hand } from "./types";
import { createDeck, shuffleDeck, calculateScore } from "./deck";

export class BlackjackEngine {
  private deck: Card[] = [];
  private state: GameState;
  private onStateChange: (state: GameState) => void;

  constructor(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.state = this.getInitialState();
  }

  private getInitialState(): GameState {
    return {
      phase: "IDLE",
      // Adicionado bet: 0, payout: 0
      playerHands: [
        {
          cards: [],
          isBusted: false,
          isStanding: false,
          score: 0,
          result: "NONE",
          bet: 0,
          payout: 0,
        },
      ],
      activeHandIndex: 0,
      dealerHand: {
        cards: [],
        isBusted: false,
        isStanding: false,
        score: 0,
        result: "NONE",
        bet: 0,
        payout: 0,
      },
    };
  }

  // Emite um clone profundo do estado para impedir que o React (UI) mute o Core acidentalmente
  private emitState() {
    this.onStateChange(structuredClone(this.state));
  }

  public startGame() {
    this.deck = shuffleDeck(createDeck(6)); // Padrão de cassino: 6 decks
    this.state = this.getInitialState();
    this.state.phase = "BETTING";
    this.emitState();
  }

  public placeBet(amount: number) {
    if (this.state.phase !== 'BETTING') return
    
    // Registra a aposta na mão atual
    this.state.playerHands[0].bet = amount
    this.state.phase = 'DEALING'
    this.emitState()
    this.dealInitialCards()
  }

  private dealInitialCards() {
    const playerHand = this.state.playerHands[0]
    const dealerHand = this.state.dealerHand

    playerHand.cards.push(this.drawCard()!)
    
    const hiddenCard = this.drawCard()!
    hiddenCard.isHidden = true
    dealerHand.cards.push(hiddenCard)
    
    playerHand.cards.push(this.drawCard()!)
    dealerHand.cards.push(this.drawCard()!)

    this.updateScores()

    // Verifica Blackjack natural direto na distribuição
    if (playerHand.score === 21) {
      playerHand.result = 'BLACKJACK'
      playerHand.payout = playerHand.bet * 2.5 // Pagamento clássico 3:2
      this.state.phase = 'PAYOUT'
      this.revealDealerCard()
    } else {
      this.state.phase = 'PLAYER_TURN'
    }
    
    this.emitState()
  }

  private drawCard(): Card | undefined {
    return this.deck.pop();
  }

  private updateScores() {
    const activeHand = this.state.playerHands[this.state.activeHandIndex];
    activeHand.score = calculateScore(activeHand.cards);
    activeHand.isBusted = activeHand.score > 21;

    this.state.dealerHand.score = calculateScore(this.state.dealerHand.cards);
    this.state.dealerHand.isBusted = this.state.dealerHand.score > 21;
  }

  public dispatch(action: GameAction) {
    if (this.state.phase !== "PLAYER_TURN") return;

    const activeHand = this.state.playerHands[this.state.activeHandIndex];

    switch (action.type) {
      case "HIT":
        activeHand.cards.push(this.drawCard()!);
        this.updateScores();

        if (activeHand.isBusted) {
          this.state.phase = "PAYOUT";
          this.revealDealerCard();
          this.evaluateResults(); // NOVO: Avalia o resultado quando estoura
        }
        break;

      case "STAND":
        activeHand.isStanding = true;
        this.state.phase = "DEALER_TURN";
        this.playDealerTurn();
        return;
    }

    this.emitState();
  }

  private revealDealerCard() {
    if (this.state.dealerHand.cards[0]) {
      this.state.dealerHand.cards[0].isHidden = false;
      this.updateScores();
    }
  }

  private playDealerTurn() {
    this.revealDealerCard();

    while (this.state.dealerHand.score < 17) {
      this.state.dealerHand.cards.push(this.drawCard()!);
      this.updateScores();
    }

    this.state.phase = "PAYOUT";
    this.evaluateResults();
    this.emitState();
  }

  private evaluateResults() {
    const dealerScore = this.state.dealerHand.score
    const dealerBusted = this.state.dealerHand.isBusted

    for (const hand of this.state.playerHands) {
      // Ignora se for Blackjack natural (já foi calculado no dealInitialCards)
      if (hand.result === 'BLACKJACK') continue

      if (hand.isBusted) {
        hand.result = 'BUST'
        hand.payout = 0
      } else if (dealerBusted) {
        hand.result = 'WIN'
        hand.payout = hand.bet * 2
      } else if (hand.score > dealerScore) {
        hand.result = 'WIN'
        hand.payout = hand.bet * 2
      } else if (hand.score < dealerScore) {
        hand.result = 'LOSS'
        hand.payout = 0
      } else {
        hand.result = 'PUSH'
        hand.payout = hand.bet // Devolve a aposta
      }
    }
  }
}
