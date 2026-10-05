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

## Демо: 

https://asyalapa.github.io/memory-game/

## Стек

- Vanilla JavaScript (ES6+)
- DOM API (`document.createElement`, `append`, `classList`,
  `addEventListener`)
- CSS
- `localStorage` для хранения результатов
- Vite для сборки

## Запуск

Нужен Node.js 22+.

```bash
git clone https://github.com/Asyalapa/memory-game.git
cd memory-game
git checkout memory-game
npm install
npm run dev
```

Открыть адрес, который напечатает Vite.

Сборка: `npm run build`, проверка линтером: `npm run lint`.
