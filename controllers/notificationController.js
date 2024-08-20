const notificationModel = require('../models/notificationModel');

class NotificationController {
    static getNotif(req, res, next) {
        notificationModel.getNotification(req, res, next);
    };
    
    static updateSeen(req, res, next) {
        notificationModel.updateSeen(req, res, next);
    };
}

module.exports = NotificationController;