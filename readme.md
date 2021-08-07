Собираем фронт:
    1. Меняем в src/helpers/index.js значение переменной proxy на:
            на стенд: 'http://kupriunin.ru/coffee'
            на локал: 'http://localhost:8080'

    2. npm start / run build

Собираем бек:
    1. npm run build
    2. Получилось build/src
    3. Забираем оттуда все файлы, и перетаскиваем в /build
    4. Туда же собираем и переносим фронт

На деплой