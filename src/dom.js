const ALLOWED_ATTRS = new Set([
    'id',
    'type',
    'href',
    'src',
    'alt',
    'title',
    'value',
    'disabled',
    'role',
]);

export function el(tag, props = {}, children = []) {
    const element = document.createElement(tag);

    for (const key of Object.keys(props)) {
        const value = props[key];

        if (key === 'class') {
            element.className = value;
        } else if (key === 'text') {
            element.textContent = value;
        } else if (key === 'dataset' && value && typeof value === 'object') {
            for (const dataKey of Object.keys(value)) {
                element.dataset[dataKey] = value[dataKey];
            }
        } else if (key === 'style' && value && typeof value === 'object') {
            for (const styleKey of Object.keys(value)) {
                element.style[styleKey] = value[styleKey];
            }
        } else if (key.startsWith('aria-')) {
            element.setAttribute(key, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (ALLOWED_ATTRS.has(key)) {
            element.setAttribute(key, value);
        } else {
            throw new Error(`el(): unknown prop "${key}"`);
        }
    }

    appendChildren(element, children);
    return element;
}

function appendChildren(node, children) {
    for (const child of children) {
        if (child === null || child === undefined || child === false) continue;
        if (typeof child === 'string' || typeof child === 'number') {
            node.append(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
            node.append(child);
        } else {
            throw new Error('el(): child must be a string or a Node');
        }
    }
}

export function text(str) {
    return document.createTextNode(String(str));
}

export function fragment(children = []) {
    const frag = document.createDocumentFragment();
    appendChildren(frag, children);
    return frag;
}
