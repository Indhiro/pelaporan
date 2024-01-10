const chatModel = require('../models/chatModel');

class chatController {
    static getChat(req, res, next) {
        chatModel.getChat(req, res, next);
    };
    
    static uploadChat(req, res, next) {
        chatModel.uploadChat(req, res, next);
    };

    static updateChat(req, res, next) {
        chatModel.updateChat(req, res, next);
    };

    static deleteChat(req, res, next) {
        chatModel.deleteChat(req, res, next);
    };
}

module.exports = chatController;