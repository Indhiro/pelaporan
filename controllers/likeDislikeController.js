const likeDislikeModel = require('../models/likeDislikeModel');

class likeDislikeController {
    static getLikeDislike(req, res, next) {
        likeDislikeModel.getLikeDislike(req, res, next);
    };

    static uploadLikeDislike(req, res, next) {
        likeDislikeModel.uploadLikeDislike(req, res, next);
    };

    static deleteLikeDislike(req, res, next) {
        likeDislikeModel.deleteLikeDislike(req, res, next);
    };
    
}

module.exports = likeDislikeController;