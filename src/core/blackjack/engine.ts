import { GameState, Card, Suit, Rank, Hand } from "./types";

export class BlackjackEngine {
  private deck: Card[] = [];
  private state: GameState;
  private onStateChange: (state: GameState) => void;

  constructor(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.state = this.getInitialState();
    this.initializeDeck();
  }

  private getInitialState(): GameState {
    return {
      phase: "IDLE",
      playerHands: [
        {
          cards: [],
          isBusted: false,
          isStanding: false,
          score: 0,
          result: "NONE",
          bet: 0,
          payout: 0,
          isDoubled: false,
          isSplitted: false,
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
        isDoubled: false,
        isSplitted: false,
      },
    };
  }

  private initializeDeck() {
    const suits: Suit[] = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];
    const ranks: Rank[] = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    this.deck = [];

    for (let i = 0; i < 4; i++) {
      for (const suit of suits) {
        for (const rank of ranks) {
          this.deck.push({ suit, rank, isHidden: false });
        }
      }
    }
    this.deck = this.deck.sort(() => Math.random() - 0.5);
  }

  private drawCard(): Card | undefined {
    if (this.deck.length < 10) this.initializeDeck();
    return this.deck.pop();
  }

  private calculateScore(cards: Card[]): number {
    let score = 0;
    let aces = 0;
    for (const card of cards) {
      if (card.isHidden) continue;
      if (["J", "Q", "K"].includes(card.rank)) score += 10;
      else if (card.rank === "A") {
        aces += 1;
        score += 11;
      } else score += parseInt(card.rank);
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  }

  public updateScores() {
    this.state.playerHands.forEach((hand) => {
      hand.score = this.calculateScore(hand.cards);
      hand.isBusted = hand.score > 21;
    });
    this.state.dealerHand.score = this.calculateScore(
      this.state.dealerHand.cards,
    );
    this.state.dealerHand.isBusted = this.state.dealerHand.score > 21;
  }

  private emitState() {
    this.onStateChange(JSON.parse(JSON.stringify(this.state)));
  }

  public getState(): GameState {
    return this.state;
  }

  public startGame() {
    this.state = this.getInitialState();
    this.state.phase = "BETTING";
    this.emitState();
  }

  public startDealing(bet: number) {
    this.state.phase = "DEALING";
    this.state.playerHands[0].bet = bet;
    this.emitState();
  }

  public dealToPlayer() {
    this.state.playerHands[this.state.activeHandIndex].cards.push(
      this.drawCard()!,
    );
    this.updateScores();
    this.emitState();
  }

  public dealToDealer(isHidden: boolean = false) {
    const card = this.drawCard()!;
    card.isHidden = isHidden;
    this.state.dealerHand.cards.push(card);
    this.updateScores();
    this.emitState();
  }

  public finishDealing() {
    const playerHand = this.state.playerHands[0];
    if (playerHand.score === 21) {
      playerHand.result = "BLACKJACK";
      playerHand.payout = playerHand.bet * 2.5;
      this.state.phase = "PAYOUT";
      this.revealDealerCard();
    } else {
      this.state.phase = "PLAYER_TURN";
    }
    this.emitState();
  }

  // --- REGRAS AVANÇADAS ---

  public performDouble() {
    const hand = this.state.playerHands[this.state.activeHandIndex];
    if (hand.cards.length !== 2) return;

    hand.bet *= 2;
    hand.isDoubled = true;
    this.dealToPlayer();
    this.playerStand();
  }

  public performSplit() {
    const hand = this.state.playerHands[this.state.activeHandIndex];
    if (hand.cards.length !== 2 || hand.cards[0].rank !== hand.cards[1].rank)
      return;

    const newHand: Hand = {
      cards: [hand.cards.pop()!],
      bet: hand.bet,
      isBusted: false,
      isStanding: false,
      score: 0,
      result: "NONE",
      payout: 0,
      isDoubled: false,
      isSplitted: true,
    };

    hand.isSplitted = true;
    this.state.playerHands.splice(this.state.activeHandIndex + 1, 0, newHand);

    this.dealToPlayer();
    const originalIndex = this.state.activeHandIndex;
    this.state.activeHandIndex += 1;
    this.dealToPlayer();
    this.state.activeHandIndex = originalIndex;

    this.updateScores();
    this.emitState();
  }

  public playerHit() {
    this.dealToPlayer();
    const hand = this.state.playerHands[this.state.activeHandIndex];
    if (hand.isBusted) {
      hand.isStanding = true;
      this.handleTurnSwitch();
    }
  }

  public playerStand() {
    this.state.playerHands[this.state.activeHandIndex].isStanding = true;
    this.handleTurnSwitch();
  }

  private handleTurnSwitch() {
    if (this.state.activeHandIndex < this.state.playerHands.length - 1) {
      this.state.activeHandIndex += 1;
      this.emitState(); // Apenas emite a mudança de mão
    } else {
      this.state.phase = "DEALER_TURN";
      this.revealDealerCard(); // Revela a carta escondida
      this.emitState(); // Avisa que o Dealer vai começar
    }
  }

  public revealDealerCard() {
    this.state.dealerHand.cards.forEach((c) => (c.isHidden = false));
    this.updateScores();
    this.emitState();
  }

  public evaluateResults() {
    this.state.phase = "PAYOUT";
    const dealerScore = this.state.dealerHand.score;
    const dealerBusted = this.state.dealerHand.isBusted;

    for (const hand of this.state.playerHands) {
      if (hand.result === "BLACKJACK") continue;
      if (hand.isBusted) {
        hand.result = "BUST";
        hand.payout = 0;
      } else if (dealerBusted) {
        hand.result = "WIN";
        hand.payout = hand.bet * 2;
      } else if (hand.score > dealerScore) {
        hand.result = "WIN";
        hand.payout = hand.bet * 2;
      } else if (hand.score < dealerScore) {
        hand.result = "LOSS";
        hand.payout = 0;
      } else {
        hand.result = "PUSH";
        hand.payout = hand.bet;
      }
    }
    this.emitState();
  }

  // * ----------- DEV / DEBUG FUNCTIONS -----------

  // Forçar uma mão para debug
  public forceHand(ranks: Rank[]) {
    // Limpa a mão do jogador
    this.state.playerHands = [
      {
        cards: [],
        isBusted: false,
        isStanding: false,
        score: 0,
        result: "NONE",
        bet: this.state.playerHands[0].bet || 100,
        payout: 0,
        isDoubled: false,
        isSplitted: false,
      },
    ];

    // Injeta as cartas escolhidas (usando SPADES como padrão para teste)
    this.state.playerHands[0].cards = ranks.map((rank) => ({
      suit: "SPADES",
      rank,
      isHidden: false,
    }));

    // Atualiza os estados
    this.updateScores();
    this.emitState();
  }
}
