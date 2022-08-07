

class View {

    // _parentElement = '';
    _dealerElement = document.querySelector('.cards-container-dealer');
    _playerElement = document.querySelector('.cards-container-player');

    _dealerValueEl = document.querySelector('.dealer-sum-amount');
    _playerValueEl = document.querySelector('.player-sum-amount');

    _clear(element) {
        element.innerHTML = '';
    }

    render(cardArr, valuesArr, oneCard = false) {

        const [playerHandCards = false, dealerHandCards = false, firstCard = false] = cardArr;
        const [playerValue = false, dealerValue = false] = valuesArr;

        if (oneCard) {
            playerHandCards ? this._generateMarkup(playerHandCards, this._playerElement) : '';
            playerValue ? this._playerValueEl.textContent = playerValue : '';
        }

        if (dealerValue && playerValue) {
            this._dealerValueEl.textContent = dealerValue;
            this._playerValueEl.textContent = playerValue;
        }

        if (!firstCard) {
            if (dealerHandCards && playerHandCards) {
                this._generateMarkup(dealerHandCards, this._dealerElement);
                this._generateMarkup(playerHandCards, this._playerElement);
            }
        }

        if (firstCard) {
            if (dealerHandCards && playerHandCards) {
                this._showWithoutFirstCard(dealerHandCards, this._dealerElement);
                this._generateMarkup(playerHandCards, this._playerElement);
            }
        }

    }

    _generateMarkup(handofCards, parentElement) {

        const handCards = handofCards;

        const markup = handCards.map(this._generateCardsMarkup).join('');

        if (!markup) return;

        this._clear(parentElement);
        parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _showWithoutFirstCard(handofCards, parentElement) {
        const markup = this._generateWithoutFirstMarkup(handofCards[1]);

        if (!markup) return;

        this._clear(parentElement);
        parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _generateCardsMarkup(card) {
        // return `<img src="/src/img/cards/${card.rank}_of_${card.suit}.png" alt="Card"  class="single-card">`;
        return `<img src="/cards/${card.rank}_of_${card.suit}.png" class="single-card lazy-img ">`;
    }

    _generateWithoutFirstMarkup(card) {
        // return `<img src="/src/img/back_card_blue.png" alt="FirstCard" class="back-card" ><img src="/src/img/cards/${card.rank}_of_${card.suit}.png" alt="Card" class="single-card">`;
        return `<img src="/back_card_blue.png" class="back-card" ><img src="/cards/${card.rank}_of_${card.suit}.png" class="single-card lazy-img">`;
    }
}

export default new View();