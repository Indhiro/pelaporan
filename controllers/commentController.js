const commentModel = require('../models/commentModel');

class commentController {
    static getComment(req, res, next) {
        commentModel.getComment(req, res, next);
    };

    static uploadComment(req, res, next) {
        commentModel.uploadComment(req, res, next);
    };

    static updateComment(req, res, next) {
        commentModel.updateComment(req, res, next);
    };

    static deleteComment(req, res, next) {
        commentModel.deleteComment(req, res, next);
    };
    
}

module.exports = commentController;