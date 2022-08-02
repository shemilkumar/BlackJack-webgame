'use-strict'

import view from "./view.js";

const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'jack': 10,
    'queen': 10, 'king': 10,
};

class Deck {

    _allCardsShuffled = [];

    _suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    _ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];


    _createCard = (suitsValue, ranksValue) => ({ suit: suitsValue, rank: ranksValue });

    _allCards = [].concat.apply([], this._suits.map(s => this._ranks.map(r => this._createCard(s, r))));

    constructor() {
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
        return this._allCardsShuffled.pop();
    }
}

class Hand {

    _singleCardEl = '';
    handCards = [];
    handValue = 0;

    hit(card) {

        if (card.rank === 'ace') {

            this.handCards.push(card);

            if (this.handValue > 10) this.handValue = this.handValue + 1;
            if (this.handValue <= 10) this.handValue = this.handValue + 11;
        }
        else {
            this.handCards.push(card);
            this.handValue = this.handValue + cardValues[card.rank];
            // console.log("card added", this.handCards, this.handValue);
        }
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

}


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


class Game {


    _deck;
    _player;
    _dealer;
    _chips;
    _bet;
    _choice;
    _round = 0;
    _highscore;
    _flag;

    // Starting the game - game open
    _btnGameOpen = document.querySelector('.btn-game-open');
    _gameOpenEl = document.querySelector('.gameopen-container')

    // Main Elements
    _btnStay = document.querySelector('.btn-stay');
    _btnHit = document.querySelector('.btn-hit');
    _overlay = document.querySelector('.overlay');

    // Chips Modal elements
    _count = 0;
    _chipsContainerEl = document.querySelector('.chips-container');

    _btnBetCount = document.querySelector('.chips-btn');
    _availableChips = document.querySelector('.available-chips');
    _totalChipsValue = document.querySelector('.chips-value-total');
    _btnPlaceBet = document.querySelector('.btn-place-bet');


    // Quit - prompt btn changed to modal
    _promptQuitBtn = document.querySelector(".place-quit");
    _quitChips = document.querySelector(".quit-chips");

    //Custom alert
    _zeroChipAlertEl = document.querySelector('.chips-0');
    _greaterAvailableChipsEl = document.querySelector('.more-chips');
    _btnCloseAlert = document.querySelectorAll('.close-alert');


    //Flash message
    _successMssgEl = document.querySelector('.success_container');
    _errorMssgEl = document.querySelector('.error_container');
    _errorClose = document.querySelector('.error-close');
    _successClose = document.querySelector('.success-close');
    _jackpotEl = document.querySelector('.jackpot_container');


    //highscore
    _highscoreEl = document.querySelector('.highscore');


    // guide modal
    _btnGuideOpen = document.querySelector('.guide-open-btn');
    _btnGuide = document.querySelector('.btn-guide-modal');
    _guideModalEl = document.querySelector('.guide-container');
    _closeGuideModalEl = document.querySelector('.close-guide-modal');

    // Game Over
    _gameOverEl = document.querySelector('.gameover-container');
    _overlayGameOver = document.querySelector('.overlay-gameover');
    _btnNewGameEl = document.querySelector('.btn-newgame');


    //gameover flash
    _quitGameFlashEl = document.querySelector('.quit-game');
    _looseGameFlashEl = document.querySelector('.loose-game');

    //welcome
    _welcomeChipsEl = document.querySelector('.welcome_chips');


    constructor() {

        // Game opening
        setTimeout(() => {
            this._gameOpenEl.querySelector('img').style.left = '50%';
            this._gameOpenEl.querySelector('.btn-game-open').style.left = '50%';
        }, 1000);

        this._btnGameOpen.addEventListener('click', this.gameOpen.bind(this));

        // Main events
        this._btnHit.addEventListener('click', this._addHitHandler.bind(this));
        this._btnStay.addEventListener('click', this._addStayHandler.bind(this));

        // Modal events
        this._btnBetCount.addEventListener('click', this._betCountHandler.bind(this));
        this._btnPlaceBet.addEventListener('click', this._placeBetHandler.bind(this));

        //Quit event
        this._promptQuitBtn.addEventListener('click', this._promptQuit.bind(this));
        this._btnCloseAlert.forEach(element => element.addEventListener('click', this._closeAlert.bind(this)));

        //Flash events
        this._errorClose.addEventListener('click', this._closeMessage.bind(this, 0));
        this._successClose.addEventListener('click', this._closeMessage.bind(this, 1));


        // guide button event
        [this._btnGuide, this._closeGuideModalEl].forEach(element =>
            element.addEventListener('click', this._closeGuideModal.bind(this)));

        this._btnGuideOpen.addEventListener('click', this._openGuideModal.bind(this));

        // newgame event
        this._btnNewGameEl.addEventListener('click', this._reload.bind(this));

        // geting highscore from browser
        this._getHighscore();
    }

    //gameOpen method
    gameOpen() {
        this._gameOpenEl.querySelector('img').style.left = '-50%';
        this._gameOpenEl.querySelector('.btn-game-open').style.left = '150%';

        if (localStorage.getItem('firstTime') === null) {
            localStorage.setItem('firstTime', true);
            this._flag = true;
        }
        else this._flag = false;


        setTimeout(() => {
            this._gameOpenEl.classList.add('hidden');
            setTimeout(() => {
                if (this._flag === true) this._openGuideModal();
                this.start();
            }, 400);
        }, 350);

    }

    //welcome
    _welcome() {
        this._welcomeChipsEl.classList.remove('hidden');
        this._overlay.classList.remove('hidden');

        setTimeout(() => {
            this._welcomeChipsEl.classList.add('hidden');
            this._overlay.classList.add('hidden');
        }, 1500);
    }

    //Alert
    _closeAlert() {
        this._zeroChipAlertEl.classList.add('hidden');
        this._greaterAvailableChipsEl.classList.add('hidden');

        this._overlay.classList.add('hidden');

        this._showChipsModal();
    }

    _openAlertZeroChip() {
        this._zeroChipAlertEl.classList.remove('hidden');

        this._closeChipsModal();

        this._overlay.classList.remove('hidden');
    }

    _openAlertGreaterAvailChips() {
        this._greaterAvailableChipsEl.classList.remove('hidden');

        this._closeChipsModal();

        this._overlay.classList.remove('hidden');
    }

    // Gameover
    _gameOver() {
        this._gameOverEl.classList.remove('hidden');
        this._overlayGameOver.classList.remove('hidden');

        this._gameOverEl.querySelector('img').style.top = '40%';
        this._gameOverEl.querySelector('.btn-newgame').style.top = '70%';
    }

    // Loose game method
    _looseGame() {

        // this._sound.play();

        this._overlay.classList.remove('hidden');

        this._looseGameFlashEl.style.animation = 'flashanime 1s 1 ease-in-out';
        this._looseGameFlashEl.classList.remove('hidden');

        setTimeout(() => {
            this._looseGameFlashEl.classList.add('hidden');
            this._looseGameFlashEl.style.animation = 'none';

            this._gameOver();
        }, 3000);
    }

    _reload() {
        location.reload();
    }

    // Getting highscore from localstorage
    _getHighscore() {
        if (localStorage.getItem('highscore') === null) this._highscore = 0;
        else {
            this._highscoreEl.textContent = localStorage.getItem('highscore');
            this._highscore = +(localStorage.getItem('highscore'));
        }
    }

    // Guide methods
    _openGuideModal() {
        this._guideModalEl.classList.remove('hidden');
        this._guideModalEl.style.opacity = 1;
    }

    _closeGuideModal() {
        this._guideModalEl.classList.add('hidden');
        this._guideModalEl.style.opacity = 0;
    }


    //Quit Method
    _promptQuit() {
        this._closeChipsModal();
        this._overlay.classList.remove('hidden');

        if (this._highscore < this._chips.chips) {
            this._highscoreEl.textContent = this._chips.chips;
            this._highscore = this._chips.chips;
            localStorage.setItem('highscore', this._highscore);
        }

        this._quitChips.textContent = this._chips.chips + '$';
        this._quitGameFlashEl.style.animation = 'flashanime 1s 1 ease-in-out';
        this._quitGameFlashEl.classList.remove('hidden');

        setTimeout(() => {
            this._quitGameFlashEl.classList.add('hidden');
            this._quitGameFlashEl.style.animation = 'none';

            this._gameOver();
        }, 2500);
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

        this._chipsContainerEl.style.top = '50%';
    }

    _closeChipsModal() {
        this._chipsContainerEl.style.top = '150%';

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

        if (betFromUser === 0) this._openAlertZeroChip();

        if (betFromUser > 0) {

            if (betFromUser > this._chips.chips) {
                this._openAlertGreaterAvailChips();
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
        if (flag === 1) {
            this._successMssgEl.style.animation = 'flashanime 1s 1 ease-in-out';
            this._successMssgEl.classList.remove('hidden');
        } else {
            this._errorMssgEl.style.animation = 'flashanime 1s 1 ease-in-out';
            this._errorMssgEl.classList.remove('hidden');
        }
        this._overlay.classList.remove('hidden');
    }

    _closeMessage(flag = 1) {

        if (flag === 1) {
            this._successMssgEl.classList.add('hidden');
            this._successMssgEl.style.animation = 'none';
        } else {
            this._errorMssgEl.classList.add('hidden');
            this._errorMssgEl.style.animation = 'none';
        }
        this._overlay.classList.add('hidden');
    }

    _autoFlashOff(flash) {
        setTimeout(() => this._closeMessage(flash), 2000);
    }

    _showFlash(flag) {
        this._flashMessage(flag);
        this._autoFlashOff(flag);
    }

    _showJackpot() {
        setTimeout(() => {
            this._jackpotEl.style.animation = 'flashanime 1s 1 ease-in-out';
            this._jackpotEl.classList.remove('hidden');
            this._overlay.classList.remove('hidden');
            setTimeout(() => {
                this._jackpotEl.classList.add('hidden');
                this._overlay.classList.remove('hidden');
                this._jackpotEl.style.animation = 'none';
            }, 2300);
        }, 800);

    }

    // Main methods

    _addHitHandler() {
        this._player.hit(this._deck.deal());
        view.render([this._player.handCards], [this._player.handValue], true);

        this._hitCheck();
    }

    _addStayHandler() {
        while (this._dealer.handValue < 17)
            this._dealer.hit(this._deck.deal());
        this._stayCheck();
    }

    _addCardsForStarting() {
        this._player.hit(this._deck.deal());
        this._dealer.hit(this._deck.deal());
    }

    _startPlay() {

        // console.log("=============== round " + (++this._round) + "================");

        ++this._round;

        this._deck = new Deck();
        this._player = new Hand();
        this._dealer = new Hand();

        // console.log(this._bet);

        ["player", "dealer"].map(el => this._addCardsForStarting());

        this._showWithoutFirstCard();

        this._player.handValue === 21 ? this._jackPot() : '';
        this._player.handValue > 21 ? this._dealerWin() : '';
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

            if (this._dealer.handValue > this._player.handValue) this._dealerWin();
            else {
                while (this._dealer.handValue <= this._player.handValue)
                    this._dealer.hit(this._deck.deal());

                this._hitCheck(true);
            }
        } else this._playerWin();
    }

    _dealerWin() {

        this._chips.looseBet(this._bet);
        setTimeout(() => this._showFlash(0), 1000);

        this._showResult();
    }

    _playerWin() {

        this._chips.winBet(this._bet);
        setTimeout(() => this._showFlash(1), 1000);

        this._showResult();
    }

    _jackPot() {
        this._chips.winBet(this._bet);
        this._showJackpot();
        this._showResult();
    }

    _showWithoutFirstCard() {

        const valueWithoutFirstCard = this._dealer.handValue - cardValues[this._dealer.handCards[0].rank]
        // console.log(this._dealer.handCards, valueWithoutFirstCard);
        // console.log(this._player.handCards, this._player.handValue);

        // Render the Views
        const cardArr = [this._player.handCards, this._dealer.handCards, true];
        const valuesArr = [this._player.handValue, valueWithoutFirstCard];

        view.render(cardArr, valuesArr);
    }

    _showResult() {
        const cardArr = [this._player.handCards, this._dealer.handCards];
        const valuesArr = [this._player.handValue, this._dealer.handValue];

        view.render(cardArr, valuesArr);

        setTimeout(() => this.start(), 3000);
    }

    start() {

        if (this._round === 0) this._chips = new Chips();

        if (this._chips.chips > 0) this._showChipsModal();

        if (this._chips.chips <= 0) {

            this._overlay.classList.remove('hidden');

            setTimeout(() => this._looseGame(), 500);

            this._chips = 0;
            return;
        }
    }
}

const play = function () {
    const game = new Game();
}

play();