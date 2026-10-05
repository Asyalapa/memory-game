const STORAGE_KEY = 'memory-game-leaderboard';
export const MAX_LEADERBOARD_SIZE = 10;

const isValid = (r) => r && Number.isFinite(r.moves) && Number.isFinite(r.date);

export function loadResults() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data.filter(isValid) : [];
    } catch {
        return [];
    }
}

export function saveResult(moves, date = Date.now()) {
    const top = [...loadResults(), { moves, date }]
        .sort((a, b) => a.moves - b.moves || a.date - b.date)
        .slice(0, MAX_LEADERBOARD_SIZE);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
    } catch {
        // storage is full or blocked: the game must keep working
    }
    return top;
}
