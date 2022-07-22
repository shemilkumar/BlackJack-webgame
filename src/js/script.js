'use-strict'

import view from "./view.js";

const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'jack': 10,
    'queen': 10, 'king': 10, 'ace': 11,
};

class Deck {

    _allCardsShuffled = [];

    _suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    _ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

    // Jackpot check
    // _suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    // _ranks = ['2', 'king', 'ace'];

    _createCard = (suitsValue, ranksValue) => ({ suit: suitsValue, rank: ranksValue });

    _allCards = [].concat.apply([], this._suits.map(s => this._ranks.map(r => this._createCard(s, r))));

    constructor() {
        // this._cardMaking();
        this._shuffle();
    }


    // _cardMaking() {
    //     // this._allCards = [].concat.apply([], this._suits.map(s => this._ranks.map(r => this._createCard(s, r))));
    //     for (const suit of this._suits) {
    //         for (const rank of this._ranks) {
    //             this._allCards.push(this._createCard(suit, rank));
    //         }
    //     }
    // }

    _shuffle() {
        this._allCardsShuffled = this._allCards.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    deal() {
        return this._allCardsShuffled.pop(0);
    }
}

class Hand {

    handCards = [];
    handValue = 0;

    _addCard(card) {
        this.handCards.push(card);
        this.handValue = this.handValue + cardValues[card.rank];
    }

    hit(card) {
        this._addCard(card);
        console.log("card added", this.handCards, this.handValue);
    }

    stay(card) {
        while (this.handValue < 17)
            this._addCard(card);

    }
}


class Chips {

    chips = 100;

    winBet(bet) {
        this.chips += bet;
    }

    looseBet(bet) {
        this.chips -= bet;
    }
    // takeBet() {
    //     // alert("You have 100 chips in your pocket");
    //     // let betFromUser = +(prompt("Place your bet"));
    //     this._showChipsModal();
    // }
}


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


class Play {


    _deck;
    _player;
    _dealer;
    _chips;
    _bet;
    _choice;
    _round = 0;

    // Main Elements
    _btnStay = document.querySelector('.btn-stay');
    _btnHit = document.querySelector('.btn-hit');

    // Modal elements
    _count = 0;
    _chipsContainerEl = document.querySelector('.chips-container');
    _overlay = document.querySelector('.overlay');

    _btnBetCount = document.querySelector('.chips-btn');
    _availableChips = document.querySelector('.available-chips');
    _totalChipsValue = document.querySelector('.chips-value-total');
    _btnPlaceBet = document.querySelector('.btn-place-bet');

    //Flash message
    _successMssgEl = document.querySelector('.success_container');
    _errorMssgEl = document.querySelector('.error_container');
    _errorClose = document.querySelector('.error-close');
    _successClose = document.querySelector('.success-close');
    _jackpotEl = document.querySelector('.jackpot_container');

    constructor() {


        this._btnHit.addEventListener('click', this._addHitHandler.bind(this));
        this._btnStay.addEventListener('click', this._addStayHandler.bind(this));

        // Modal events
        this._btnBetCount.addEventListener('click', this._betCountHandler.bind(this));
        this._btnPlaceBet.addEventListener('click', this._placeBetHandler.bind(this));

        //Flash events
        this._errorClose.addEventListener('click', this._closeMessage.bind(this, 0));
        this._successClose.addEventListener('click', this._closeMessage.bind(this, 1));

    }

    // Modal methods

    _clearChips() {
        this._count = 0;
        this._totalChipsValue.textContent = 0;
    }

    _showChipsModal() {

        this._availableChips.textContent = this._chips.chips;

        this._chipsContainerEl.classList.remove('hidden');
        this._overlay.classList.remove('hidden');
    }

    _closeChipsModal() {
        this._chipsContainerEl.classList.add('hidden');
        this._overlay.classList.add('hidden');
    }

    _betCountHandler(e) {

        if (e.target.querySelector('.single-chip')) return;

        if (e.target.dataset.value === '1') this._count++;
        if (e.target.dataset.value === '5') this._count += 5;
        if (e.target.dataset.value === '10') this._count += 10;
        if (e.target.dataset.value === '20') this._count += 20;
        if (e.target.dataset.value === '50') this._count += 50;
        if (e.target.dataset.value === '100') this._count += 100;

        this._totalChipsValue.textContent = this._count;
    }

    _placeBetHandler() {

        let betFromUser = +(this._totalChipsValue.textContent);

        if (betFromUser === 0) alert("Please select your chips for the bet");

        if (betFromUser > 0) {

            if (betFromUser > this._chips.chips) {
                alert("your bet amount is more than your available chips");
                this._clearChips();
            }

            if (betFromUser <= this._chips.chips) {
                this._closeChipsModal();
                this._clearChips();

                this._bet = betFromUser;
                this._startPlay();
            }
        }
    }

    //flash methods
    _flashMessage(flag = 1) {
        flag === 1 ? this._successMssgEl.classList.remove('hidden') : this._errorMssgEl.classList.remove('hidden');;
        this._overlay.classList.remove('hidden');
    }

    _closeMessage(flag = 1) {
        flag === 1 ? this._successMssgEl.classList.add('hidden') : this._errorMssgEl.classList.add('hidden');;
        this._overlay.classList.add('hidden');
    }

    _autoFlashOff(flash) {
        setTimeout(() => this._closeMessage(flash), 2500);
    }

    _showFlash(flag) {
        this._flashMessage(flag);
        this._autoFlashOff(flag);
    }

    _showJackpot() {
        setTimeout(() => {
            this._jackpotEl.classList.remove('hidden');
            this._overlay.classList.remove('hidden');
            setTimeout(() => {
                this._jackpotEl.classList.add('hidden');
                this._overlay.classList.remove('hidden');
            }, 2500);
        }, 800);

    }

    // Main methods

    _addHitHandler() {
        this._player.hit(this._deck.deal());
        view.render([this._player.handCards], [this._player.handValue], true);

        this._hitCheck();
    }

    _addStayHandler() {
        this._dealer.stay(this._deck.deal());
        this._stayCheck();
    }

    _addCardsForStarting() {
        this._player.hit(this._deck.deal());
        this._dealer.hit(this._deck.deal());
    }

    _startPlay() {

        console.log("=============== round " + (++this._round) + "================");

        this._deck = new Deck();
        this._player = new Hand();
        this._dealer = new Hand();

        console.log(this._bet);

        ["player", "dealer"].map(el => this._addCardsForStarting());

        this._showWithoutFirstCard();

        this._player.handValue === 21 ? this._jackPot() : '';
        this._player.handValue > 21 ? this._playerWin() : '';
    }


    _hitCheck(dealerCheck = false) {

        if (!dealerCheck) {
            (this._player.handValue >= 22) ? this._dealerWin() : '';
            (this._player.handValue === 21) ? this._jackPot() : '';
        }

        if (dealerCheck) this._dealer.handValue >= 22 ? this._playerWin() : this._dealerWin();
    }

    _stayCheck() {

        if (this._dealer.handValue < 22) {

            if (this._dealer.handValue > this._player.handValue) {
                this._dealerWin();
            }
            else {
                while (this._dealer.handValue <= this._player.handValue)
                    this._dealer.hit(this._deck.deal());

                this._hitCheck(true);
            }
        }
        else this._playerWin();
    }

    _dealerWin() {

        this._chips.looseBet(this._bet);
        console.log(this._chips.chips);
        setTimeout(() => this._showFlash(0), 1000);

        console.log("dealer wins --");
        this._showResult();
    }

    _playerWin() {

        this._chips.winBet(this._bet);
        console.log(this._chips.chips);
        setTimeout(() => this._showFlash(1), 1000);

        console.log("player wins --");
        this._showResult();
    }

    _jackPot() {
        console.log("Jackpot !!!");
        this._chips.winBet(this._bet);
        this._showJackpot();
        this._showResult();
    }

    _showWithoutFirstCard() {

        const valueWithoutFirstCard = this._dealer.handValue - cardValues[this._dealer.handCards[0].rank]
        console.log("Dealer - without first card");
        console.log(this._dealer.handCards, valueWithoutFirstCard);
        console.log("Player");
        console.log(this._player.handCards, this._player.handValue);

        // Render the Views
        const cardArr = [this._player.handCards, this._dealer.handCards, true];
        const valuesArr = [this._player.handValue, valueWithoutFirstCard];

        view.render(cardArr, valuesArr);
    }

    _playAgain() {
        this._choice = prompt("Do u wanna play again ? (y/n)");
        if (this._choice === 'y') this.start();
    }

    _showResult() {

        console.log("Dealer");
        console.log(this._dealer.handCards, this._dealer.handValue);
        console.log("Player");
        console.log(this._player.handCards, this._player.handValue);

        const cardArr = [this._player.handCards, this._dealer.handCards];
        const valuesArr = [this._player.handValue, this._dealer.handValue];

        view.render(cardArr, valuesArr);

        setTimeout(() => this._playAgain(), 4000);
    }

    start() {

        if (this._round === 0) this._chips = new Chips();

        if (this._chips.chips > 0) this._showChipsModal();

        if (this._chips.chips <= 0) {

            this._overlay.classList.remove('hidden');

            console.log("You loose the game !");
            alert("You loose the game, you dont have any chips for bet !!!");
            this._chips = 0;
            return;
        }
    }
}

const game = function () {
    const play = new Play();
    play.start();
}

game();