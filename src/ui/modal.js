import { el } from '../dom.js';

const TITLE_ID = 'modal-title';
let active = null;

function onKeydown(event) {
    if (event.key === 'Escape') closeModal();
}

export function openModal({ title, content, actions = [] }) {
    closeModal();
    const opener = document.activeElement;

    const dialog = el(
        'div',
        { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': TITLE_ID },
        [
            el('h2', { id: TITLE_ID, class: 'modal__title', text: title }),
            content,
            el(
                'div',
                { class: 'modal__actions' },
                actions.map(({ label, onClick }) =>
                    el('button', { class: 'btn', type: 'button', text: label, onClick })
                )
            ),
        ]
    );
    const overlay = el(
        'div',
        {
            class: 'overlay',
            onClick: (event) => {
                if (event.target === overlay) closeModal();
            },
        },
        [dialog]
    );

    const background = [...document.body.children];
    background.forEach((node) => {
        node.inert = true;
    });
    document.body.classList.add('is-locked');
    document.body.append(overlay);
    document.addEventListener('keydown', onKeydown);

    dialog.tabIndex = -1;
    dialog.focus();
    active = { overlay, background, opener };
}

export function closeModal() {
    if (!active) return;
    const { overlay, background, opener } = active;
    active = null;

    overlay.remove();
    background.forEach((node) => {
        node.inert = false;
    });
    document.body.classList.remove('is-locked');
    document.removeEventListener('keydown', onKeydown);
    if (opener && opener.isConnected) opener.focus();
}
