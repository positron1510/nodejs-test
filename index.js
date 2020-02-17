const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const sequelize = require('./utils/database');
const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// подключение роутов
app.use('/api', apiRoutes);

// просто заглушка корень проекта
app.use((req, res, next) => {
    res.sendFile('/index.html');
});

async function start() {
    try {
        // если раскомментировать параметр, при перезапуске сервера будут пересоздаваться таблицы
        await sequelize.sync(/*{force: true}*/);
        app.listen(PORT);
    } catch (e) {
        console.log(e);
    }
}

start();