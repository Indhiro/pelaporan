const express = require('express');
const notificationRouter = express.Router();
const NotificationController = require('../controllers/notificationController');

notificationRouter.get('/get', NotificationController.getNotif);
notificationRouter.get('/seen', NotificationController.updateSeen);

module.exports = notificationRouter;