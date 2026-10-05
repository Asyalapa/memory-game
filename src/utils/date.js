const PAD_LENGTH = 2;

export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const pad = (n) => String(n).padStart(PAD_LENGTH, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}
