import { el } from '../dom.js';
import { PAIRS_COUNT } from '../game/game.js';
import { formatDate } from '../utils/date.js';

const refs = { board: null, moves: null, pairs: null, cards: [] };

export function mountLayout(root, { onNewGame, onLeaderboard, onCardClick }) {
    refs.moves = el('span', { class: 'counter__value' });
    refs.pairs = el('span', { class: 'counter__value' });
    // one delegated listener instead of 16
    refs.board = el('div', {
        class: 'board',
        onClick: (event) => {
            const card = event.target.closest('.card');
            if (card) onCardClick(Number(card.dataset.index));
        },
    });

    root.append(
        el('header', { class: 'header' }, [
            el('h1', { class: 'header__title', text: 'Memory Game' }),
            el('div', { class: 'header__actions' }, [
                el('button', {
                    class: 'btn',
                    type: 'button',
                    text: 'New game',
                    onClick: onNewGame,
                }),
                el('button', {
                    class: 'btn',
                    type: 'button',
                    text: 'Leaderboard',
                    onClick: onLeaderboard,
                }),
            ]),
        ]),
        el('main', { class: 'main' }, [
            el('div', { class: 'counters' }, [
                el('p', { class: 'counter' }, ['Moves: ', refs.moves]),
                el('p', { class: 'counter' }, ['Pairs: ', refs.pairs]),
            ]),
            refs.board,
        ])
    );
}

export function renderBoard(state) {
    refs.cards = state.cards.map((_, index) =>
        el('button', { class: 'card', type: 'button', dataset: { index } }, [
            el('span', { class: 'card__face', 'aria-hidden': 'true' }, [
                el('img', { class: 'card__img', alt: '' }),
            ]),
        ])
    );
    refs.board.replaceChildren(...refs.cards);
    renderCards(state);
}

export function renderCards(state) {
    state.cards.forEach((card, index) => {
        const node = refs.cards[index];
        const img = node.firstChild.firstChild;
        const closed = card.status === 'closed';

        node.className = `card card--${card.status}`;
        if (closed) {
            img.removeAttribute('src');
        } else if (img.getAttribute('src') !== card.face.src) {
            img.src = card.face.src;
        }
        node.setAttribute(
            'aria-label',
            closed ? `Card ${index + 1}, face down` : `Card ${index + 1}, ${card.face.name}`
        );
    });
}

export function renderCounters(state) {
    refs.moves.textContent = state.moves;
    refs.pairs.textContent = `${state.pairs} / ${PAIRS_COUNT}`;
}

export function buildVictory(moves) {
    return el('p', { class: 'modal__text', text: `You found all pairs in ${moves} moves.` });
}

export function buildLeaderboard(results) {
    if (results.length === 0) {
        return el('p', { class: 'modal__text', text: 'No results yet' });
    }
    const rows = results.map((result, index) =>
        el('tr', {}, [
            el('td', { text: index + 1 }),
            el('td', { text: result.moves }),
            el('td', { text: formatDate(result.date) }),
        ])
    );
    return el('table', { class: 'table' }, [
        el('thead', {}, [
            el('tr', {}, [
                el('th', { text: 'Place' }),
                el('th', { text: 'Moves' }),
                el('th', { text: 'Date' }),
            ]),
        ]),
        el('tbody', {}, rows),
    ]);
}
