const { Sequelize, Model } = require('sequelize');
const sequelize = require('../utils/database');

class Author extends Model {}

Author.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

},{
    underscored: true,
    sequelize,
    modelName: 'author',
});

module.exports = Author;