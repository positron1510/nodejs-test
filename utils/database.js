const Sequelize = require('sequelize');

const DB_NAME = 'nodejs_test';
const USER_NAME = 'root';
const PASSWORD = 'root';

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
    },
});

module.exports = sequelize;