const {Router} = require('express');
const Book = require('../models/book');
const router = Router();


/**
 *
 * Список
 */
router.get('/list', async (req, res) => {
    try {
        const books = await Book.getBooksList(req);
        res.json({books});
    }catch (e) {
        res.status(500).json({
            error: 'Необработанная ошибка при выводе списка книг'
        });
    }
});

/**
 *
 * Добавление
 */
router.post('/add', async (req, res) => {
    try {
        const result = await Book.addBook(req);
        res.status(result.code).json({
            message: result.message
        });
    } catch (e) {
        res.status(500).json({
            error: 'Необработанная ошибка при добавлении книги'
        });
    }
});

/**
 *
 * Редактирование
 */
router.put('/edit/:id', async (req, res) => {
    try {
        const result = await Book.editBook(req);
        res.status(result.code).json({
            message: result.message
        });
    } catch (e) {
        res.status(500).json({
            error: 'Необработанная ошибка при обновлении книги'
        })
    }
});


module.exports = router;