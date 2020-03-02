const {Sequelize, Model} = require('sequelize');
const sequelize = require('../utils/database');
const Author = require('./author');
const Op = Sequelize.Op;
const Cache = require('../utils/cache');

class Book extends Model {
    /**
     * Добавление книги
     *
     * @param req
     * @returns {Promise<{code: number, message: string}>}
     */
    static async addBook(req) {
        let data = JSON.parse(req.query.data);
        data.release_date = new Date();
        await Book.create(data, {
            include: [Author]
        });

        return {code: 201, message: 'Книга успешно добавлена'};
    }

    /**
     * Список книг
     *
     * @param req
     * @returns {Promise<Model[]>}
     */
    static async getBooksList(req) {
        // GET параметры пагинации offset, limit
        const offset = req.query.offset && !isNaN(req.query.offset) ? parseInt(req.query.offset) : 0;
        const limit = req.query.limit && !isNaN(req.query.limit) ? parseInt(req.query.limit) : 10;

        // GET параметры сортировки sort_field, order, подстроки поиска search
        const properties = ['name', 'picture', 'release_date', 'description', 'authors', 'id'];
        const orders = ['asc', 'desc'];
        const sort_field = req.query.sort_field && properties.find(item => item === req.query.sort_field.toLowerCase()) ? req.query.sort_field.toLowerCase() : 'release_date';
        const order = req.query.order && orders.find(item => item === req.query.order.toLowerCase()) ? req.query.order : 'asc';
        const search = req.query.search ? req.query.search : '';

        // Формируем из get-параметров хэш-ключ для редиса, затем проверяем есть ли что в редисе по данному ключу
        const redisHash = `offset=${offset}&limit=${limit}&sort_field=${sort_field}&order=${order}&search=${search}`;
        const data = await Cache.get(redisHash);

        // Если есть что то в кэше, достаем и возвращаем
        if (data) {
            return JSON.parse(data);
        }

        // начинаем формировать строку запроса
        let query = {
            include: [{
                model: Author,
                attributes: ['name'],
            }],
            offset: offset,
            limit: limit,
        };

        // добавляем к строке запроса сортировку
        if (sort_field === 'authors') {
            query.order = [[ Author, "name", order]]
        }else {
            query.order = [[sort_field, order]];
        }

        let books;

        // GET параметр поиск (если есть)
        if (search) {
            query.where = {
                [Op.or]: [
                    {
                        picture: {
                            [Op.substring]: req.query.search
                        },
                    },
                    {
                        name: {
                            [Op.substring]: req.query.search
                        },
                    },
                    {
                        description: {
                            [Op.substring]: req.query.search
                        },
                    },
                ]
            };

            books = await Book.findAll(query);
            delete query.where;

            query.include[0].where = {
                [Op.or]: [
                    {
                        name: {
                            [Op.substring]: req.query.search
                        },
                    },
                ]
            };

            let authors = await Book.findAll(query);

            let book;
            for (let author of authors) {
                if (books.find(book => book.id === author.id)) continue;
                book = await Book.findAll({
                    include: [{
                        model: Author,
                        attributes: ['name'],
                    }],
                    where: {
                        id: author.id
                    }
                });
                books.push(book[0]);
            }

            // записываем в кэш
            Cache.set(redisHash, JSON.stringify(books));
            return books;
        }

        books = await Book.findAll(query);
        // записываем в кэш
        Cache.set(redisHash, JSON.stringify(books));

        return books;
    }

    /**
     * Обновление книги
     *
     * @param req
     * @returns {Promise<{code: number, message: string}>}
     */
    static async editBook(req) {
        if (req.params.id && !isNaN(req.params.id)) {
            const id = parseInt(req.params.id);
            let data = JSON.parse(req.query.data);

            const book = await Book.findByPk(id);

            if (data.name) book.name = data.name;
            if (data.description) book.description = data.description;
            if (data.picture) book.picture = data.picture;
            book.release_date = new Date();

            await book.save();

            if (data.authors) {
                for (let item of data.authors) {
                    if (item['old_name'] && item['new_name']) {
                        await Author.update({
                            name: item['new_name'],
                        }, {
                            where: {
                               book_id: id,
                               name: item['old_name']
                            }
                        });
                    }
                }
            }
        }

        return {code: 200, message: 'Книга успешно обновлена'};
    }
}

Book.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    picture: {
        type: Sequelize.STRING,
        allowNull: false
    },
    release_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
},{
    underscored: true,
    sequelize,
    modelName: 'book'
});

Book.hasMany(Author, {onDelete: 'CASCADE'});


module.exports = Book;