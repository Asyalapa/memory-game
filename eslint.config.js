import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

const HTML_PROPS = ['innerHTML', 'outerHTML'];
const DIALOG_FNS = ['alert', 'confirm', 'prompt'];
const bannedGlobals = [
    ...DIALOG_FNS.map((name) => ({ name, message: `${name} запрещён.` })),
    { name: 'DOMParser', message: 'DOMParser запрещён.' },
];
const bannedProperties = [
    ...HTML_PROPS.map((property) => ({
        property,
        message: `${property} запрещён. Только createElement + append.`,
    })),
    { property: 'insertAdjacentHTML', message: 'insertAdjacentHTML запрещён.' },
    { property: 'createContextualFragment', message: 'createContextualFragment запрещён.' },
    { object: 'document', property: 'write', message: 'document.write запрещён.' },
    { object: 'document', property: 'writeln', message: 'document.writeln запрещён.' },
    ...['window', 'globalThis'].flatMap((object) =>
        [...DIALOG_FNS, 'DOMParser'].map((property) => ({
            object,
            property,
            message: `${object}.${property} запрещён.`,
        })),
    ),
];
const createElementBan = {
    object: 'document',
    property: 'createElement',
    message: 'document.createElement вызывается только в src/dom.js. Используй el().',
};
const bannedSyntax = HTML_PROPS.flatMap((name) => [
    {
        selector: `Property[key.name='${name}']`,
        message: `Ключ ${name} в объекте запрещён: через Object.assign это та же запись innerHTML.`,
    },
    {
        selector: `Property[key.value='${name}']`,
        message: `Ключ '${name}' в объекте запрещён.`,
    },
]);
const BROWSER_ONLY = [
    'document', 'window', 'globalThis', 'localStorage', 'sessionStorage',
    'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
    'fetch', 'requestAnimationFrame',
];
const bannedInPure = BROWSER_ONLY.map((name) => ({
    name,
    message: `${name} запрещён в чистых модулях: логика должна работать в Node.`,
}));


export default [
    { ignores: ['dist/**', 'node_modules/**'] },
    js.configs.recommended,

    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: globals.browser,
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'error',
            eqeqeq: ['error', 'always'],
            'prefer-const': 'error',
            'no-restricted-syntax': ['error', ...bannedSyntax],
            'no-restricted-globals': ['error', ...bannedGlobals],
            'no-restricted-properties': ['error', ...bannedProperties, createElementBan],
        },
    },

    {
        files: ['src/dom.js'],
        rules: {
            'no-restricted-properties': ['error', ...bannedProperties],
        },
    },

    {
        files: ['src/game/**/*.js', 'src/utils/**/*.js', 'src/data/**/*.js'],
        rules: {
            'no-restricted-globals': ['error', ...bannedGlobals, ...bannedInPure],
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['**/ui/**', '**/storage/**', '**/dom.js', '**/script.js'],
                            message: 'Чистые модули не зависят от UI, storage и DOM-хелпера.',
                        },
                    ],
                },
            ],
        },
    },

    prettierConfig,
];