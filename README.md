# Memory Game

Классическая игра на поиск пар: игрок открывает карточки по две
и ищет совпадения за минимальное число ходов.

## Что внутри

- 16 карточек (8 пар), случайное перемешивание при каждой игре
- Подсчёт ходов и найденных пар
- Модальное окно победы с итоговым результатом
- Таблица лидеров: топ-10 результатов в `localStorage`
- Кнопка «Новая игра» — перезапуск без перезагрузки страницы
- Интерфейс на чистом JavaScript без фреймворков и библиотек

## Стек

- Vanilla JavaScript (ES6+)
- DOM API (`document.createElement`, `append`, `classList`,
  `addEventListener`)
- CSS
- `localStorage` для хранения результатов
- Vite для сборки

## Ограничения задания (RS School)

- Вся разметка генерируется через `document.createElement`
- В `<body>` только `<script>`
- Запрещены `innerHTML`, `outerHTML`, `insertAdjacentHTML`,
  `document.write`, `DOMParser`, `Range.createContextualFragment`
- Запрещены `alert`, `confirm`, `prompt`
- Без сторонних UI-библиотек и фреймворков