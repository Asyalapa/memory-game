import { CARD_FACES } from '../data/cards.js';
import { shuffle } from '../utils/shuffle.js';

export const PAIRS_COUNT = CARD_FACES.length;
export const MISMATCH_DELAY_MS = 1000;

export function createGame(faces = CARD_FACES, shuffleFn = shuffle) {
    const deck = faces.flatMap((face, pairId) => [
        { pairId, face, status: 'closed' },
        { pairId, face, status: 'closed' },
    ]);
    return {
        cards: shuffleFn(deck),
        moves: 0,
        pairs: 0,
        firstPick: null,
        pendingMismatch: null,
        isFinished: false,
    };
}

export function pickCard(state, index) {
    const card = state.cards[index];
    if (state.isFinished || state.pendingMismatch || !card || card.status !== 'closed') {
        return 'ignored';
    }

    card.status = 'open';
    if (state.firstPick === null) {
        state.firstPick = index;
        return 'first';
    }

    const firstIndex = state.firstPick;
    const first = state.cards[firstIndex];
    state.firstPick = null;
    state.moves += 1;

    if (first.pairId === card.pairId) {
        first.status = 'matched';
        card.status = 'matched';
        state.pairs += 1;
        if (state.pairs === PAIRS_COUNT) {
            state.isFinished = true;
            return 'win';
        }
        return 'match';
    }

    state.pendingMismatch = [firstIndex, index];
    return 'mismatch';
}

export function resolveMismatch(state) {
    if (!state.pendingMismatch) return;
    for (const index of state.pendingMismatch) {
        state.cards[index].status = 'closed';
    }
    state.pendingMismatch = null;
}
