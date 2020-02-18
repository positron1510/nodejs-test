# nodejs-test
Тестовое задание nodejs/express 

ОС Ubuntu 18.04

nodejs v12.6.0

mysql v5.5.56

Миграция таблиц БД осуществляется при перезапуске сервера, если таблиц нет, создаются. Таблицы описаны в моделях, папка models.

Методы API:

1. Список GET. Пример запроса:

/api/list/?offset=0&limit=10&sort_field=release_date&order=asc&search=строка

limit, offset параметры пагинации, sort_field по какому полю сортируем, order порядок сортировки asc|desc, search подстрока которую надо найти

2. Добавление POST. Пример запроса

/api/add

POST данные одно поле data в формате json. Пример:

data  

{"name":"Название книги","description":"Описание книги","picture":"pic.jpg","authors":[{"name":"Иван Иванов"},{"name":"Петр Петров"}]}

все поля в json строке обязательны

3. Редактирование PUT

/api/edit/<идентификатор книги>

PUT данные одно поле data в формате json. Пример:

data  

{"name":"Новое название книги","description":"Новое описание книги","picture":"new_pic.jpg","authors":[{"old_name":"Иван Иванов", "new_name":"Николай Николаев"}, {"old_name":"Петр Петров", "new_name":"Василий Васильев"}]}

все поля в json строке необязательны
