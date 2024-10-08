let { asynqQuery } = require('../helpers/helpers');
const { DATABASE } = require('../config/db');

class NotificationModel {
    static async getNotification(req, res, next) {
        let { userId } = req.query;
        let query = `SELECT *, DATE_FORMAT(created_at, "%d-%m-%Y %T") as dateformated 
        FROM ${DATABASE}.tb_notification where id_user = ${userId} ORDER BY seen, created_at desc LIMIT 5;`
        let qCountAll = `SELECT COUNT(id_notification) as count FROM ${DATABASE}.tb_notification where id_user = ${userId} and seen is null`
        let result = await asynqQuery(query)
        let resCount = await asynqQuery(qCountAll)
        res.status(200).send({
            resCount, result
        })
    }

    static async updateSeen(req, res, next) {
        let { id_notification, userId } = req.query;
        let query = `UPDATE ${DATABASE}.tb_notification
        SET seen = 1 
        WHERE id_notification = ${id_notification} and id_user = ${userId};`
        await asynqQuery(query)
        res.status(200).send('success update')
    }
}

module.exports = NotificationModel;
