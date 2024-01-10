const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/chatController');

chatRouter.get('/get-chat', chatController.getChat);
chatRouter.post('/upload-chat', chatController.uploadChat);
chatRouter.post('/update-chat', chatController.updateChat);
chatRouter.post('/delete-chat', chatController.deleteChat);

module.exports = chatRouter;