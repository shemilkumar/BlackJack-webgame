'use-strict'

const dealercardsContainer = document.querySelector('.cards-container-dealer');
const playercardsContainer = document.querySelector('.cards-container-player');
const sumDealer = document.querySelector('.dealer-sum-amount');
const sumPlayer = document.querySelector('.player-sum-amount');


const btnStay = document.querySelector('.btn-stay');
const btnHit = document.querySelector('.btn-hit');

let deck, player, dealer, chips, bet, choice, round = 0;

const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'jack': 10,
    'queen': 10, 'king': 10, 'ace': 11,
};


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

    constructor() {
        // this._hitEvent();
        // this._stayEvent();
        // debugger;
    }

    // _hitEvent() {
    //     this.btnHit.addEventListener('click', this.hitClicked.bind(this));
    //     // this.btnHit.addEventListener('click', function () {
    //     //     console.log("clicked");
    //     // })
    // }
    // _stayEvent() {
    //     this.btnStay.addEventListener('click', this.stayClicked.bind(this));
    // }

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

    // hitClicked() {
    //     console.log(this);
    //     this.hit(deck.deal());
    //     hitCheck();
    //     this.btnHit.removeEventListener('click', this.stayClicked.bind(this));
    // }

    // stayClicked() {
    //     console.log("yes");
    //     this.stay(deck.deal());
    //     stayCheck();
    // }

}

class Chips {
    chips = 100;

    winBet(bet) {
        this.chips += bet;
    }

    looseBet(bet) {
        this.chips -= bet;
    }

    takeBet() {
        while (true) {
            // alert("You have 100 chips in your pocket");
            const betFromUser = +(prompt("Place your bet"));

            if (Number.isFinite(betFromUser)) {

                if (betFromUser > 0) {
                    if (betFromUser <= this.chips) {
                        return betFromUser;
                    }
                    else {
                        alert("your bet amount is more than your available chips");

                    }
                }
                else {
                    alert("Please enter valid amount");
                }

            }
            else {
                alert("Please enter a number");
            }
        }
    }
}

const dealerWin = function (chips, bet, dealer, player) {

    chips.looseBet(bet);
    console.log(chips.chips);

    console.log("dealer wins --");
    console.log("Dealer");
    console.log(dealer.handCards, dealer.handValue);
    console.log("Player");
    console.log(player.handCards, player.handValue);
}

const playerWin = function (chips, bet, dealer, player) {

    chips.winBet(bet);
    console.log(chips.chips);

    console.log("player wins --");
    console.log("Dealer");
    console.log(dealer.handCards, dealer.handValue);
    console.log("Player");
    console.log(player.handCards, player.handValue);
}

const playAgain = function () {
    choice = prompt("Do u wanna play again ? (y/n)");
    if (choice === 'y') call();
}

const init = function () {
    chips = new Chips();
    // bet = chips.takeBet();
}

const play = function () {
    console.log("=============== round " + (++round) + "================")

    deck = new Deck();

    player = new Hand();
    dealer = new Hand();

    console.log(bet);

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

        playerWin(chips, bet, dealer, player);
        playAgain();

    }
}

const hitCheck = function (dealerCheck = false) {
    if (!dealerCheck) {
        if (player.handValue >= 22) {

            dealerWin(chips, bet, dealer, player);
            playAgain();

        }
    }
    if (dealerCheck) {
        if (dealer.handValue >= 22) {

            playerWin(chips, bet, dealer, player);

            playAgain();
        }
        else {
            dealerWin(chips, bet, dealer, player);
            playAgain();
        }
    }
}

const stayCheck = function () {

    if (dealer.handValue < 22) {
        if (dealer.handValue > player.handValue) {

            dealerWin(chips, bet, dealer, player);
            playAgain();
        }
        else {
            while (dealer.handValue <= player.handValue) {
                dealer.hit(deck.deal());
                hitCheck(true);
            }
        }
    }
    else {
        playerWin(chips, bet, dealer, player);
        playAgain();
    }

}

btnHit.addEventListener('click', function () {
    player.hit(deck.deal());
    hitCheck();
});

btnStay.addEventListener('click', function () {
    console.log("yes");
    dealer.stay(deck.deal());
    stayCheck();
});

const call = function () {

    if (round === 0) {
        init();
        bet = chips.takeBet();
        play();
        console.log(round);
    } else {
        if (chips.chips > 0) {
            bet = chips.takeBet();
            play();
            console.log("yes in if");
        }
        else {
            console.log("You loose the game !");
            alert("You loose the game, you dont have any chips for bet !!!");
            return;
        }
    }
}


init();
call();










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