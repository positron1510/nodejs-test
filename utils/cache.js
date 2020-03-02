const redis = require("redis");
const client = redis.createClient();

/**
 *
 * Класс кэширования
 */
class Cache {
    /**
     * Установка значения key со значением value
     * на время delay в секундах (по умолчанию 60 с)
     *
     * @param key
     * @param value
     * @param delay
     */
    static set(key, value, delay=60) {
        client.hmset([key, "data", value]);
        client.hmset([key, "delay", delay]);
        const d = new Date();
        client.hmset([key, "time", d.getTime()]);
    }

    /**
     * Получение значения по ключу
     *
     * @param key
     * @returns {Promise<any>}
     */
    static get(key) {
        return new Promise((resolve, reject) => {
            client.hgetall(key, (err, data) => {
                if (data) {
                    const d = new Date();
                    if (d.getTime() - data.time <= data.delay * 1000) {
                        resolve(data.data);
                    }else {
                        Cache.delete(key);
                        resolve('');
                    }
                }else {
                    resolve('');
                }
            });
        });
    }

    /**
     * Удаление значения по ключу
     *
     * @param key
     */
    static delete(key) {
        client.hdel([key, 'data']);
        client.hdel([key, 'time']);
        client.hdel([key, 'delay']);
    }
}

module.exports = Cache;