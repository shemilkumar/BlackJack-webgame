'use-strict'

const dealercardsContainer = document.querySelector('.cards-container-dealer');
const playercardsContainer = document.querySelector('.cards-container-player');
const sumDealer = document.querySelector('.dealer-sum-amount');
const sumPlayer = document.querySelector('.player-sum-amount');

const btnStay = document.querySelector('.btn-stay');
const btnHit = document.querySelector('.btn-hit');

// const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
// // const ranks = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'queen', 'king', 'ace'];

// const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

// const values = {
//     '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'ten': 10, 'jack': 10,
//     'queen': 10, 'king': 10, 'ace': 11,
// };

// const createCard = (suitsValue, ranksValue) => ({ suit: suitsValue, rank: ranksValue });

// // const cards = ranks.map(ranksValue => suits.forEach(suitsValue => createCard(suitsValue, ranksValue)));

// const allCards = [];

// for (const suit of suits) {
//     for (const rank of ranks) {
//         allCards.push(createCard(suit, rank));
//     }
// }
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'jack': 10,
    'queen': 10, 'king': 10, 'ace': 11,
};

let deck, player, dealer;

class Deck {

    _allCards = [];
    _allCardsShuffled = [];

    _suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    _ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

    constructor() {
        this._cardMaking();
        this._shuffle();
    }

    _createCard = (suitsValue, ranksValue) => ({ suit: suitsValue, rank: ranksValue });

    _cardMaking() {
        for (const suit of this._suits) {
            for (const rank of this._ranks) {
                this._allCards.push(this._createCard(suit, rank));
            }
        }
    }

    _shuffle() {
        this._allCardsShuffled = this._allCards.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    deal() {
        return this._allCardsShuffled.pop();
    }
}

class Hand {
    handCards = [];
    handValue = 0;

    addCard(card) {
        this.handCards.push(card);
        this.handValue = this.handValue + cardValues[card.rank];
    }

    hit(card) {
        this.addCard(card);
        console.log("card added", this.handCards, this.handValue);
    }

    stay(card) {
        while (this.handValue < 17)
            this.addCard(card);
    }

    // _hitOrStay(card, value) {
    //     if (value === 'hit') {
    //         this.addCard(card);
    //     }
    //     if (value === 'stay') {
    //         while (this.handValue < 17)
    //             this.addCard(card);
    //     }
    // }

}

// class Chips {

//     // givivng 100 chips to the user
//     chips = 100;

//     // when win the bet, add the bet amount to the chips
//     winBet(bet) {
//         this.chips += bet;
//     }

//     // when loose the bet, decrease the bet amount from the chips
//     looseBet() {
//         this.chips -= bet;
//     }
// }


const init = function () {

    deck = new Deck();

    player = new Hand();
    dealer = new Hand();


    const players = ["player", "dealer"];

    for (const iterator of players) {
        player.addCard(deck.deal());
        dealer.addCard(deck.deal());
    }

    console.log("Dealer - without first card");
    console.log(dealer.handCards, dealer.handValue - cardValues[dealer.handCards[0].rank]);
    console.log("Player");
    console.log(player.handCards, player.handValue);

    if (player.handValue === 21) {
        console.log("player wins -- player = 21");
        console.log("Dealer");
        console.log(dealer.handCards, dealer.handValue);
        console.log("Player");
        console.log(player.handCards, player.handValue);
    }

    btnHit.addEventListener('click', function () {
        player.hit(deck.deal());
        hitCheck();
    });

    btnStay.addEventListener('click', function () {
        dealer.stay(deck.deal());
        stayCheck();
    });
}

const hitCheck = function (dealerCheck = false) {
    if (!dealerCheck) {
        if (player.handValue > 22) {
            console.log("dealer wins -- player > 21");
            console.log("Dealer");
            console.log(dealer.handCards, dealer.handValue);
            console.log("Player");
            console.log(player.handCards, player.handValue);
        }
    }
    if (dealerCheck) {
        if (dealer.handValue > 22) {
            console.log("player wins -- dealer > 21");
            console.log("Dealer");
            console.log(dealer.handCards, dealer.handValue);
            console.log("Player");
            console.log(player.handCards, player.handValue);
        }
    }
}

const stayCheck = function () {

    if (dealer.handValue < 22) {
        if (dealer.handValue > player.handValue) {
            console.log("dealer wins,, greater than player");
            console.log("Dealer");
            console.log(dealer.handCards, dealer.handValue);
            console.log("Player");
            console.log(player.handCards, player.handValue);
        }
        else {

            dealer.hit(deck.deal());
            hitCheck(true);
            // console.log("player wins,, greater than dealer");
            // console.log("Dealer");
            // console.log(dealer.handCards, dealer.handValue);
            // console.log("Player");
            // console.log(player.handCards, player.handValue);
        }
    }
    else {
        console.log("player wins -- dealer > 21");
        console.log("Dealer");
        console.log(dealer.handCards, dealer.handValue);
        console.log("Player");
        console.log(player.handCards, player.handValue);
    }

}

init();
// startPlay();
















// let markup = h.cards.map(card => `<img src="/src/img/cards/${card.rank}_of_${card.suit}.png" alt="Card" class="single-card">`).join('\n');

// dealercardsContainer.innerHTML = ' ';
// dealercardsContainer.insertAdjacentHTML("afterbegin", markup);

// // let span = h.cards.map(card => `<span class="sum-amount ">${card.value}</span>`).join('\n');
// console.log(h.value);
// sumDealer.innerHTML = '';
// sumDealer.insertAdjacentHTML("afterbegin", `<span class="sum-amount ">${h.value}</span>`);

// h.value = 0;
// h.cards = [];

// for (let i = 0; i < 3; i++) {
//     h.addCard(d.deal());
//     // console.log(h.cards)
// }

// markup = h.cards.map(card => `<img src="/src/img/cards/${card.rank}_of_${card.suit}.png" alt="Card" class="single-card">`).join('\n');

// playercardsContainer.innerHTML = ' ';
// playercardsContainer.insertAdjacentHTML("afterbegin", markup);

// sumPlayer.innerHTML = '';
// sumPlayer.insertAdjacentHTML("afterbegin", `<span class="sum-amount ">${h.value}</span>`);

// console.log(markup);