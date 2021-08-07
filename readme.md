# coffeeshop

*ЧУТЬ НИЖЕ ДЛЯ ЖЕНИ*
---

open the papochka (folder) after cloning this repo, and do some finger-magic on your magic-terminal;

Koroche:

1. $ cd ./backend

2. $ npm install

*waiting ozhidaniya*

3. $ cd ../frontend

4. $ npm install


*waiting ozhidaniya*


5. $ npm start *(browser should be magically opened after los-colhoz:3000 will launch | DON'T TYKAT' YET)*

6. $ cd ../backend

7. $ npm start


*please tykaite*

ДЛЯ ЖЕНИ:
---
клонируешь репу, открываешь PowerShell, переходишь в нужную директорию, далее:

1. cd ./backend

2. npm install (и ждешь, пока пакеты скачаются (качаются локально, снести все можно переносом в корзину))

3. npm start (скажет зеленым цветом что-то типа там nodemon запустился)

4. cd ../frontend

5. npm install (тоже ждешь, тоже все локально)

6. npm start (должен открыться браузер)

tykayte :)



(FOR NE-FRONTEND RAZRABOV: ctrl+c kills los-kolhoz. Gotta kill 'em all (one for front, one for back))

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

Deploy: 
    Front:
        1. npm run build
        2. move frontend/build files to backend/dist
    Back:
        1. npm run build
        2. move backend/dist/src files to backend/dist
        3. deploy backend/dist files into public_html/coffee
