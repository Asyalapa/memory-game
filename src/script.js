import './styles/style.css';
import { el } from './dom.js';
import { CARD_FACES } from './data/cards.js';
import { MISMATCH_DELAY_MS, createGame, pickCard, resolveMismatch } from './game/game.js';
import { loadResults, saveResult } from './storage/leaderboard.js';
import { closeModal, openModal } from './ui/modal.js';
import {
    buildLeaderboard,
    buildVictory,
    mountLayout,
    renderBoard,
    renderCards,
    renderCounters,
} from './ui/render.js';

let state;
let mismatchTimerId = null; // side-effect handle: lives here, not in state

function startNewGame() {
    clearTimeout(mismatchTimerId);
    mismatchTimerId = null;
    state = createGame(CARD_FACES);
    renderBoard(state);
    renderCounters(state);
}

function closeMismatch() {
    mismatchTimerId = null;
    resolveMismatch(state);
    renderCards(state);
}

function showVictory() {
    openModal({
        title: 'You win!',
        content: buildVictory(state.moves),
        actions: [
            {
                label: 'New game',
                onClick: () => {
                    closeModal();
                    startNewGame();
                },
            },
            { label: 'Close', onClick: closeModal },
        ],
    });
}

function showLeaderboard() {
    openModal({
        title: 'Leaderboard',
        content: buildLeaderboard(loadResults()),
        actions: [{ label: 'Close', onClick: closeModal }],
    });
}

function handleCardClick(index) {
    const outcome = pickCard(state, index);
    if (outcome === 'ignored') return;

    renderCards(state);
    if (outcome === 'first') return;

    renderCounters(state);
    if (outcome === 'mismatch') {
        mismatchTimerId = setTimeout(closeMismatch, MISMATCH_DELAY_MS);
    } else if (outcome === 'win') {
        saveResult(state.moves);
        showVictory();
    }
}

const root = el('div', { class: 'app' });
document.body.append(root);
mountLayout(root, {
    onNewGame: startNewGame,
    onLeaderboard: showLeaderboard,
    onCardClick: handleCardClick,
});
startNewGame();
